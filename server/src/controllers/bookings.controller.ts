import { Request, Response } from "express";
import { Booking } from "../models/bookings";
import { messages } from "../config/logger";


export async function createBooking(req: Request, res: Response) {
    try {
        const {userId, showId, seats} = req.body;
        const booking = await Booking.create({
            userId: userId,
            showId: showId,
            bookingTime: new Date(),
            bookedSeats: seats,
        });

        await booking.save();
        res.status(200).json({
            bookingId: booking._id,
            bookingTime: booking.bookingTime,
        });

    } catch (error) {
        res.status(500).json({
            message: messages.SERVER_ERROR,
        });
    }
}
