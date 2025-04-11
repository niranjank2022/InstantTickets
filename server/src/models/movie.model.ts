import mongoose, { Document, Model, Schema } from 'mongoose';
import { config } from '../config/config';

export interface IMovie extends Document {
  title: string;
  rating: number;
  img: string;
  languages: string[];
  formats: string[];
  genres: string[];
  cities: string[];
}

const movieSchema = new Schema<IMovie>({
  title: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    default: config.PLACEHOLDER_IMG,
  },
  languages: {
    type: [String],
    required: true,
  },
  formats: {
    type: [String],
    required: true,
  },
  genres: {
    type: [String],
    required: true,
  },
  cities: {
    type: [String],
    required: true,
  },
  rating: {
    type: Number,
    default: 0,
  },
});

export const Movie: Model<IMovie> = mongoose.model<IMovie>('Movie', movieSchema);
