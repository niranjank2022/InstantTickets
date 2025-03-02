import { Request, Response } from "express";
import { Booking } from "../models/booking.model";
import { messages } from "../config/logger";


export async function createBooking(req: Request, res: Response) {
    try {
        const {userId, showId, venueId, seats} = req.body;
        const booking = await Booking.create({
            userId: userId,
            showId: showId,
            venueId: venueId,
            bookingTime: new Date(),
            bookedSeats: seats,
        });

        await booking.save();
        res.status(200).json({
            bookingId: booking._id,
            bookingTime: booking.bookingTime,
        });

    } catch (error) {
        if (error instanceof Error) {
            console.error("Error message: ", error.message);
            console.error("Error Stack Trace: ", error.stack);
        } else {
            console.error("Unknown error");
        }

        res.status(500).json({
            message: messages.SERVER_ERROR,
        });
    }
}
