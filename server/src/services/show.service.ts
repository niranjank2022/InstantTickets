import { ISeat, IShow } from '../models/show.model';
import { ShowRepository } from '../repositories/show.repository';
import { VenueRepository } from '../repositories/venue.repository';
import { VenueService } from './venue.service';
import { SeatStatus } from '../config/enum';
import { messages } from '../config/logger';

interface ISeatMap {
  color?: string;
  status?: SeatStatus;
}

interface ILabel {
  color: string;
  price: number;
}

type ShowData = {
  showId: string;
  venueId: string;
  startTime: Date;
  endTime: Date;
  language: string;
  format: string;
};

export const ShowService = {
  getShowById: async (showId: string) => {
    try {
      return await ShowRepository.findById(showId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error('Error: ' + errorMessage);
    }
  },

  createShow: async (show: Partial<IShow>) => {
    try {
      const venue = await VenueService.getVenueById(show.venueId!);
      if (!venue) {
        return;
      }

      const seats: ISeat[] = [];
      for (const section of venue.sections) {
        for (let i = 0; i < section.rows; i++) {
          for (let j = 0; j < section.columns; j++) {
            seats.push({ x: section.x + j, y: section.y + i, expirationTime: null, status: SeatStatus.Available });
          }
        }
      }
      return await ShowRepository.create({ ...show, seats: seats });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error('Error: ' + errorMessage);
    }
  },

  getShowsWithExpiredSeats: async () => {
    try {
      return await ShowRepository.find({ seats: { $elemMatch: { expirationTime: { $lte: new Date() } } } });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error('Error: ' + errorMessage);
    }
  },

  getShowsByVenueId: async (venueId: string) => {
    try {
      const shows = await ShowRepository.find({ venueId: venueId });

      if (!shows) {
        return [];
      }

      const res = [];
      for (const show of shows) {
        res.push({
          showId: show.id,
          startTime: show.startTime,
          endTime: show.endTime,
          language: show.language,
          format: show.format,
          movieTitle: show.movieTitle,
        });
      }
      return res;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error('Error: ' + errorMessage);
    }
  },

  getShowsByMovieIdCity: async (movieId: string, city: string) => {
    try {
      const shows = await ShowRepository.find({ movieId: movieId });

      if (!shows) {
        return [];
      }

      const res = new Map<string, ShowData[]>();
      for (const show of shows) {
        const venue = await VenueService.getVenueById(show.venueId);
        if (venue!.city === city) {
          if (!res.has(venue!.name)) {
            res.set(venue!.name, []);
          }

          res.get(venue!.name)!.push({
            showId: show.id,
            venueId: venue!.name,
            startTime: show.startTime,
            endTime: show.endTime,
            language: show.language,
            format: show.format,
          });
        }
      }

      return Object.fromEntries(res);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error('Error: ' + errorMessage);
    }
  },

  getSeatMap: async (showId: string) => {
    try {
      const show = await ShowRepository.findById(showId);
      if (!show) return null;

      const venue = await VenueRepository.findOne({ _id: show.venueId });
      if (!venue) return null;

      const { rows, columns, sections } = venue;
      const seatmap: (ISeatMap | null)[][] = Array.from({ length: rows }, () =>
        Array.from({ length: columns }, () => null)
      );
      const label = new Map<string, ILabel>();

      for (const section of sections) {
        if (!label.has(section.name)) {
          label.set(section.name, {
            color: section.color,
            price: section.price,
          });
        }

        for (let dr = 0; dr < section.rows; dr++) {
          for (let dc = 0; dc < section.columns; dc++) {
            const r = section.y + dr;
            const c = section.x + dc;
            if (r < rows && c < columns) {
              seatmap[r][c] = { color: section.color };
            }
          }
        }
      }

      for (const seat of show.seats || []) {
        const { x, y, status } = seat;
        if (y < rows && x < columns && seatmap[y][x]) {
          seatmap[y][x] = {
            ...seatmap[y][x],
            status,
          };
        }
      }

      return { seatmap: seatmap, label: Object.fromEntries(label) };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error('Error: ' + errorMessage);
    }
  },
};
