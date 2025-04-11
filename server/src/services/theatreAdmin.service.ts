import { ITheatreAdmin } from '../models/theatreAdmin.model';
import { TheatreAdminRepository } from '../repositories/theatreAdmin.repository';
import { messages } from '../config/logger';

export const TheatreAdminService = {
  createTheatreAdmin: async (admin: Partial<ITheatreAdmin>) => {
    try {
      return await TheatreAdminRepository.create(admin);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error('Error: ' + errorMessage);
    }
  },

  getTheatreAdminByEmail: async (email: string) => {
    try {
      return await TheatreAdminRepository.findOne({ email: email });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error('Error: ' + errorMessage);
    }
  },

  addVenueId: async (email: string, venueId: string) => {
    try {
      const admin = await TheatreAdminRepository.findOne({ email: email });
      admin?.venues.push(venueId);
      admin?.save();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error('Error: ' + errorMessage);
    }
  },

  doesTheatreAdminExists: async (email: string) => {
    try {
      return !!(await TheatreAdminRepository.exists({ email: email }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error('Error: ' + errorMessage);
    }
  },
};
