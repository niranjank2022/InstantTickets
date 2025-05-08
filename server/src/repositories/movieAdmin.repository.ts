import { FilterQuery } from 'mongoose';
import { MovieAdmin, IMovieAdmin } from '../models/movieAdmin.model';
import { messages } from '../config/logger';

export const MovieAdminRepository = {
  create: async (movieAdmin: Partial<IMovieAdmin>) => {
    try {
      return await MovieAdmin.create(movieAdmin);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error('Error: ' + errorMessage);
    }
  },

  findOne: async (filter: FilterQuery<IMovieAdmin>) => {
    try {
      return await MovieAdmin.findOne(filter);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error('Error: ' + errorMessage);
    }
  },

  exists: async (filter: FilterQuery<IMovieAdmin>) => {
    try {
      return await MovieAdmin.exists(filter);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error('Error: ' + errorMessage);
    }
  },
};
