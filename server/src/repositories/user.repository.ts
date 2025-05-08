import { FilterQuery } from 'mongoose';
import { messages } from '../config/logger';
import { User, IUser } from '../models/user.model';

export const UserRepository = {
  create: async (user: Partial<IUser>) => {
    try {
      return await User.create(user);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error('Error: ' + errorMessage);
    }
  },

  findOne: async (filter: FilterQuery<IUser>) => {
    try {
      return await User.findOne(filter);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error('Error: ' + errorMessage);
    }
  },

  exists: async (filter: FilterQuery<IUser>) => {
    try {
      return await User.exists(filter);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error('Error: ' + errorMessage);
    }
  },
};
