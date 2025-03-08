import mongoose, { Document, Model, Schema } from 'mongoose';

interface IBooking extends Document {
  userId: string;
  showId: string;
  venueId: string;
  bookingTime: Date;
  bookedSeats: string[];
}

const bookingSchema = new Schema<IBooking>({
  userId: {
    type: String,
    required: true,
  },
  showId: {
    type: String,
    required: true,
  },
  venueId: {
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
