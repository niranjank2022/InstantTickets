import { Show, IShow } from '../models/show.model';
import { messages } from '../config/logger';
import { FilterQuery } from 'mongoose';

export const ShowRepository = {
  create: async (show: Partial<IShow>) => {
    try {
      return await Show.create(show);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error('Error: ' + errorMessage);
    }
  },

  findById: async (showId: string) => {
    try {
      return await Show.findById(showId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error('Error: ' + errorMessage);
    }
  },

  find: async (filter: FilterQuery<IShow>) => {
    try {
      return await Show.find(filter);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error('Error: ' + errorMessage);
    }
  },
};
