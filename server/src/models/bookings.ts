import mongoose, { Model, Schema } from "mongoose";

interface IBookedSeat {
    sectionId: String;
    seatId: String;
    seatNo: String;
}

interface IBooking {
    userId: String;
    showId: String;
    bookingTime: Date;
    bookedSeats: IBookedSeat[];
}

const bookedSeatSchema = new Schema<IBookedSeat>(
    {
        sectionId: {
            type: String,
            required: true,
        },
        seatId: {
            type: String,
            required: true,
        },
        seatNo: {
            type: String,
            required: true,
        },
    },
    {
        _id: false,
    }
);

const bookingSchema = new Schema<IBooking>({
    userId: {
        type: String,
        required: true,
    },
    showId: {
        type: String,
        required: true,
    },
    bookingTime: {
        type: Date,
        required: true,
    },
    bookedSeats: [bookedSeatSchema],
})

export const Booking: Model<IBooking> = mongoose.model<IBooking>("Booking", bookingSchema);
