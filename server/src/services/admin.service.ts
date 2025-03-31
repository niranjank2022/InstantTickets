import { messages } from '../config/logger';
import { IAdmin } from '../models/admin.model';
import { AdminRepository } from '../repositories/admin.repository';

export const AdminService = {
  createAdmin: async (admin: Partial<IAdmin>) => {
    try {
      return await AdminRepository.create(admin);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error(messages.booking.CREATE_ERROR + errorMessage);
    }
  },

  getAdminByEmail: async (email: string) => {
    try {
      return await AdminRepository.findOne({ email: email });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error(messages.booking.CREATE_ERROR + errorMessage);
    }
  },

  doesAdminExists: async (email: string) => {
    try {
      return await AdminRepository.exists({ email: email });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error(messages.booking.CREATE_ERROR + errorMessage);
    }
  },
};
