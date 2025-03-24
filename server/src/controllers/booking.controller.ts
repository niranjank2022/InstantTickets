import { Request, Response } from 'express';
import { BookingService } from '../services/booking.service';
import { logError, messages } from '../config/logger';

export const BookingController = {
  createBooking: async (req: Request, res: Response) => {
    try {
      const { userId, showId, venueId, bookedSeats } = req.body;
      const booking = await BookingService.createBooking({
        userId: userId,
        showId: showId,
        venueId: venueId,
        bookingTime: new Date(),
        bookedSeats: bookedSeats,
      });

      res.status(201).json({
        bookingId: booking._id,
        bookingTime: booking.bookingTime,
      });
    } catch (error) {
      if (error instanceof Error) {
        logError(error);
      } else {
        console.error(messages.UNKNOWN_ERROR);
      }

      res.status(500).json({
        message: messages.SERVER_ERROR,
      });
    }
  },
};
