import { Request, Response } from 'express';
import { BookingService } from '../services/booking.service';
import { messages } from '../config/logger';
import { getIo } from '../socket/socket';
import { SeatStatus } from '../config/enum';

export const BookingController = {
  createBooking: async (req: Request, res: Response) => {
    try {
      const { email, showId, bookedSeats } = req.body;
      const booking = await BookingService.createBooking({
        email: email,
        showId: showId,
        bookingTime: new Date(),
        bookedSeats: bookedSeats,
      });

      for (const seatId of bookedSeats) {
        const y = seatId.charCodeAt(0) - 65;
        const x = parseInt(seatId.slice(1)) - 1;
        getIo().emit('seatUpdate', { x, y, showId, seatStatus: SeatStatus.Booked });
      }

      res.status(201).json({
        bookingId: booking.id,
        bookingTime: booking.bookingTime,
      });
    } catch (error) {
      res.status(500).json({
        message: messages.SERVER_ERROR,
        error,
      });
    }
  },

  getTicketByBookingId: async (req: Request, res: Response) => {
    try {
      const bookingId = req.params.bookingId;
      const ticket = await BookingService.getTicketByBookingId(bookingId);
      if (!ticket) {
        res.status(404).json({ message: 'Ticket not found' });
        return;
      }
      res.status(200).json(ticket);
    } catch (error) {
      res.status(500).json({
        message: messages.SERVER_ERROR,
        error,
      });
    }
  },
};
