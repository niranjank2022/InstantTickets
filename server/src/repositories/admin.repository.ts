import { FilterQuery } from 'mongoose';
import { messages } from '../config/logger';
import { Admin, IAdmin } from '../models/admin.model';

export const AdminRepository = {
  create: async (admin: Partial<IAdmin>) => {
    try {
      return await Admin.create(admin);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error(messages.booking.CREATE_ERROR + errorMessage);
    }
  },

  findOne: async (filter: Partial<IAdmin>) => {
    try {
      return await Admin.findOne(filter as FilterQuery<IAdmin>);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error(messages.booking.DELETE_ERROR + errorMessage);
    }
  },

  exists: async (filter: Partial<IAdmin>) => {
    try {
      return await Admin.exists(filter as FilterQuery<IAdmin>);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error(messages.booking.DELETE_ERROR + errorMessage);
    }
  },
};
