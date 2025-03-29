import { Movie, IMovie } from '../models/movie.model';
import { messages } from '../config/logger';
import { FilterQuery } from 'mongoose';

export const MovieRepository = {
  findById: async (id: string): Promise<IMovie | null> => {
    try {
      return await Movie.findById(id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error(messages.movie.FIND_ERROR + errorMessage);
    }
  },

  insertMany: async (movies: Partial<IMovie>[]) => {
    try {
      return await Movie.insertMany(movies);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error(messages.movie.INSERT_ERROR + errorMessage);
    }
  },

  deleteMany: async (filter: Partial<IMovie>) => {
    try {
      return await Movie.deleteMany(filter as FilterQuery<IMovie>);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error(messages.movie.DELETE_ERROR + errorMessage);
    }
  },

  find: async (param1: string, param2: any) => {
    try {
      const filter: { [key: string]: string } = {};
      filter[param1] = param2;
      return await Movie.find(filter);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error(messages.movie.FIND_ERROR + errorMessage);
    }
  },
};
