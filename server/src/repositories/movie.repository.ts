import { FilterQuery } from 'mongoose';
import { Movie, IMovie } from '../models/movie.model';
import { messages } from '../config/logger';

export const MovieRepository = {
  create: async (movie: Partial<IMovie>) => {
    try {
      return await Movie.create(movie);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error('Error: ' + errorMessage);
    }
  },

  findById: async (id: string): Promise<IMovie | null> => {
    try {
      return await Movie.findById(id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error('Error: ' + errorMessage);
    }
  },

  find: async (filter: FilterQuery<IMovie>) => {
    try {
      return await Movie.find(filter);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error('Error: ' + errorMessage);
    }
  },

  updateById: async (movieId: string, movie: Partial<IMovie>) => {
    try {
      return await Movie.findByIdAndUpdate(movieId, movie);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error('Error: ' + errorMessage);
    }
  },
};
