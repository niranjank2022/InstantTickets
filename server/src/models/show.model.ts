import mongoose, { Document, Model, Schema } from 'mongoose';
import { SeatStatus } from '../config/enum';

export interface ISeat {
  x: number;
  y: number;
  status: SeatStatus;
  expirationTime: Date | null;
}

export interface IShow extends Document {
  venueId: string;
  name: string;
  startTime: Date;
  endTime: Date;
  seats: ISeat[];
}

const seatSchema = new Schema<ISeat>({
  x: {
    type: Number,
    required: true,
  },
  y: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(SeatStatus),
    default: SeatStatus.Available,
    required: true,
  },
  expirationTime: {
    type: Date || null,
  },
});

const showSchema: Schema = new Schema<IShow>({
  venueId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  seats: {
    type: [seatSchema],
    required: true,
  },
});

export const Show: Model<IShow> = mongoose.model<IShow>('Show', showSchema);
