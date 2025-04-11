import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ISection {
  name: string;
  x: number;
  y: number;
  rows: number;
  columns: number;
  price: number;
  color: string;
}

export interface IVenue extends Document {
  name: string;
  city: string;
  rows: number;
  columns: number;
  sections: ISection[];
}

const sectionSchema = new Schema<ISection>(
  {
    name: {
      type: String,
      required: true,
    },
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
    rows: {
      type: Number,
      required: true,
    },
    columns: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

export const venueSchema = new Schema<IVenue>({
  name: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  rows: {
    type: Number,
    required: true,
  },
  columns: {
    type: Number,
    required: true,
  },
  sections: {
    type: [sectionSchema],
    required: true,
  },
});

export const Venue: Model<IVenue> = mongoose.model<IVenue>('Venue', venueSchema);
