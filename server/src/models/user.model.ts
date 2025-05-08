import mongoose, { Schema, Model, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { config } from '../config/config';

export interface IUser extends Document {
  email: string;
  password: string;
  bookings: string[];
  isValidPassword(passwd: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  bookings: {
    type: [String],
    default: [],
  },
});

userSchema.pre('save', async function (next) {
  try {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, config.HASH_SALT);
    }
    next();
  } catch (error) {
    next(error as Error);
  }
});

userSchema.methods.isValidPassword = async function (passwd: string): Promise<boolean> {
  return await bcrypt.compare(passwd, this.password);
};

export const User: Model<IUser> = mongoose.model<IUser>('User', userSchema);
