import { Request, Response } from 'express';
import { ShowService } from '../services/show.service';
import { messages } from '../config/logger';

export const ShowController = {
  createShow: async (req: Request, res: Response) => {
    try {
      const { movieId, venueId, movieTitle, language, format, startTime, endTime } = req.body;
      const show = await ShowService.createShow({
        movieId: movieId,
        venueId: venueId,
        movieTitle: movieTitle,
        language: language,
        format: format,
        startTime: startTime,
        endTime: endTime,
      });
      res.status(201).json({ message: 'Created successfully', showId: show!.id });
    } catch (error) {
      res.status(500).json({
        message: messages.SERVER_ERROR,
        error,
      });
    }
  },

  getShowById: async (req: Request, res: Response) => {
    try {
      const showId = req.params.showId.trim();
      const show = await ShowService.getShowById(showId);

      if (!show) {
        res.status(404).json({
          message: 'show not found',
        });
        return;
      }

      res.status(200).json({
        showId: show.id,
        venueId: show.venueId,
        movieId: show.movieId,
        startTime: show.startTime,
        endTime: show.endTime,
        seats: show.seats,
        language: show.language,
        format: show.format,
      });
    } catch (error) {
      res.status(500).json({
        message: messages.SERVER_ERROR,
        error,
      });
    }
  },

  getShowsByVenueId: async (req: Request, res: Response) => {
    try {
      const venueId = req.params.venueId.trim();
      const shows = await ShowService.getShowsByVenueId(venueId);
      res.status(200).json({
        shows: shows,
      });
    } catch (error) {
      res.status(500).json({
        message: messages.SERVER_ERROR,
        error,
      });
    }
  },

  getSeatMap: async (req: Request, res: Response) => {
    try {
      const showId = req.params.showId.trim();
      const seatmap = await ShowService.getSeatMap(showId);

      if (!seatmap) {
        res.status(404).json({
          message: messages.RECORD_NOT_FOUND,
        });
        return;
      }

      res.status(200).json(seatmap);
    } catch (error) {
      res.status(500).json({
        message: messages.SERVER_ERROR,
        error,
      });
    }
  },
};
