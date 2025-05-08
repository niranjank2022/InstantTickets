import mongoose, { Schema, Model, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { config } from '../config/config';

export interface IMovieAdmin extends Document {
  email: string;
  password: string;
  movies: string[];
  isValidPassword(passwd: string): Promise<boolean>;
}

const movieAdminSchema = new Schema<IMovieAdmin>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  movies: {
    type: [String],
    default: [],
  },
});

movieAdminSchema.pre('save', async function (next) {
  try {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, config.HASH_SALT);
    }
    next();
  } catch (error) {
    next(error as Error);
  }
});

movieAdminSchema.methods.isValidPassword = async function (passwd: string): Promise<boolean> {
  return await bcrypt.compare(passwd, this.password);
};

export const MovieAdmin: Model<IMovieAdmin> = mongoose.model<IMovieAdmin>('MovieAdmin', movieAdminSchema);
