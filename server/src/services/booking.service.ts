import { IBooking } from '../models/booking.model';
import { BookingRepository } from '../repositories/booking.repository';
import { messages } from '../config/logger';
import { ShowService } from './show.service';
import { VenueService } from './venue.service';

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

  getTicketByBookingId: async (bookingId: string) => {
    try {
      const booking = await BookingRepository.findById(bookingId);
      if (!booking) {
        throw new Error('Ticket not found');
      }

      const show = await ShowService.getShowById(booking.showId);
      if (!show) {
        throw new Error('Show not found');
      }

      const venue = await VenueService.getVenueById(show.venueId);
      if (!venue) {
        throw new Error('Venue not found');
      }

      return {
        bookingId,
        title: show.movieTitle,
        venue: venue.name,
        seats: booking.bookedSeats,
        showTime: show.startTime,
        bookingTime: booking.bookingTime,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : messages.UNKNOWN_ERROR;
      throw new Error(messages.booking.FIND_ERROR + errorMessage);
    }
  },
};
