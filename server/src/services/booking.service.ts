import { IBooking } from '../models/booking.model';
import { BookingRepository } from '../repositories/booking.repository';
import { messages } from '../config/logger';

export const BookingService = {
  getBookingById: async (bookingId: string) => {
    try {
      return await BookingRepository.findById(bookingId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error(messages.booking.FIND_ERROR + errorMessage);
    }
  },

  createBooking: async (booking: Partial<IBooking>) => {
    try {
      return await BookingRepository.create(booking);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error(messages.booking.CREATE_ERROR + errorMessage);
    }
  },

  deleteAllBookings: async () => {
    try {
      return await BookingRepository.deleteMany({});
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error(messages.booking.DELETE_ERROR + errorMessage);
    }
  },
};
