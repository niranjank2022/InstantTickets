import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IBooking extends Document {
  email: string;
  showId: string;
  bookingTime: Date;
  bookedSeats: string[];
}

const bookingSchema = new Schema<IBooking>({
  email: {
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
  bookedSeats: {
    type: [String],
    required: true,
  },
});

export const Booking: Model<IBooking> = mongoose.model<IBooking>('Booking', bookingSchema);
