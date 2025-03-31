import mongoose, { Document, Model, Schema } from 'mongoose';

interface ISection {
  name: string;
  x: number;
  y: number;
  rows: number;
  columns: number;
  price: number;
}

export interface IVenue extends Document {
  name: string;
  location: string;
  rows: number;
  columns: number;
  rowIndices: string[];
  columnIndices: string[];
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
  location: {
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
  rowIndices: {
    type: [String],
    required: true,
  },
  columnIndices: {
    type: [String],
    required: true,
  },
  sections: {
    type: [sectionSchema],
    required: true,
  },
});

export const Venue: Model<IVenue> = mongoose.model<IVenue>('Venue', venueSchema);
