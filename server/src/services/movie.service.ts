import { IMovie } from '../models/movie.model';
import { MovieRepository } from '../repositories/movie.repository';
import { MovieAdminRepository } from '../repositories/movieAdmin.repository';
import { messages } from '../config/logger';
import { Roles } from '../config/enum';

export const MovieService = {
  createMovie: async (movie: Partial<IMovie>) => {
    try {
      return await MovieRepository.create(movie);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error('Error: ' + errorMessage);
    }
  },

  getMoviesByAdminEmail: async (adminEmail: string) => {
    try {
      const admin = await MovieAdminRepository.findOne({ email: adminEmail });

      if (!admin) {
        return [];
      }

      const res = [];
      for (const movieId of admin!.movies) {
        const movie = await MovieRepository.findById(movieId);
        if (!movie) continue;
        res.push({
          movieId: movie.id,
          title: movie.title,
          img: movie.img,
          languages: movie.languages,
          formats: movie.formats,
          genres: movie.genres,
          cities: movie.cities,
          rating: movie.rating,
        });
      }
      return res;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error('Error: ' + errorMessage);
    }
  },

  getMoviesByCity: async (city: string, role: Roles) => {
    try {
      const movies = await MovieRepository.find({ cities: { $in: [city] } });

      if (!movies) {
        return [];
      }

      const res = [];
      for (const movie of movies) {
        if (role === Roles.TheatreAdmin) {
          res.push({
            movieId: movie.id,
            title: movie.title,
            img: movie.img,
            languages: movie.languages,
            formats: movie.formats,
          });
        } else if (role === Roles.User) {
          res.push({
            movieId: movie.id,
            title: movie.title,
            img: movie.img,
            rating: movie.rating,
            languages: movie.languages,
            formats: movie.formats,
            genres: movie.genres,
          });
        }
      }
      return res;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error('Error: ' + errorMessage);
    }
  },

  updateMovieById: async (movieId: string, movie: Partial<IMovie>) => {
    try {
      return await MovieRepository.updateById(movieId, movie);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error('Error: ' + errorMessage);
    }
  },
};
