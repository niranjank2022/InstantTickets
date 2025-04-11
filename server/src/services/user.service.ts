import { IUser } from '../models/user.model';
import { UserRepository } from '../repositories/user.repository';
import { messages } from '../config/logger';

export const UserService = {
  createUser: async (user: Partial<IUser>) => {
    try {
      return await UserRepository.create(user);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error('Error: ' + errorMessage);
    }
  },

  getUserByEmail: async (email: string) => {
    try {
      return await UserRepository.findOne({ email: email });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error('Error: ' + errorMessage);
    }
  },

  addVenueId: async (email: string, bookingId: string) => {
    try {
      const user = await UserRepository.findOne({ email: email });
      user?.bookings.push(bookingId);
      user?.save();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error('Error: ' + errorMessage);
    }
  },

  doesUserExists: async (email: string) => {
    try {
      return !!(await UserRepository.exists({ email: email }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error('Error: ' + errorMessage);
    }
  },
};
