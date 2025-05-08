import { FilterQuery } from 'mongoose';
import { TheatreAdmin, ITheatreAdmin } from '../models/theatreAdmin.model';
import { messages } from '../config/logger';

export const TheatreAdminRepository = {
  create: async (admin: Partial<ITheatreAdmin>) => {
    try {
      return await TheatreAdmin.create(admin);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error('Error: ' + errorMessage);
    }
  },

  findOne: async (filter: FilterQuery<ITheatreAdmin>) => {
    try {
      return await TheatreAdmin.findOne(filter);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error('Error: ' + errorMessage);
    }
  },

  exists: async (filter: FilterQuery<ITheatreAdmin>) => {
    try {
      return await TheatreAdmin.exists(filter);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error('Error: ' + errorMessage);
    }
  },
};
