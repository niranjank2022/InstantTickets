import { Booking, IBooking } from '../models/booking.model';
import { messages } from '../config/logger';
import { FilterQuery } from 'mongoose';

export const BookingRepository = {
  findById: async (id: string): Promise<IBooking | null> => {
    try {
      return await Booking.findById(id);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error(messages.booking.FIND_ERROR + errorMessage);
    }
  },

  find: async (filter: FilterQuery<IBooking>) => {
    try {
      return await Booking.find(filter);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error(messages.booking.FIND_ERROR + errorMessage);
    }
  },

  create: async (booking: Partial<IBooking>) => {
    try {
      return await Booking.create(booking);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error(messages.booking.CREATE_ERROR + errorMessage);
    }
  },

  deleteMany: async (filter: Partial<IBooking>) => {
    try {
      return await Booking.deleteMany(filter as FilterQuery<IBooking>);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error(messages.booking.DELETE_ERROR + errorMessage);
    }
  },
};
