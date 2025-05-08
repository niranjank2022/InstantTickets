import mongoose, { Schema, Model, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { config } from '../config/config';

export interface ITheatreAdmin extends Document {
  email: string;
  password: string;
  venues: string[];
  isValidPassword(passwd: string): Promise<boolean>;
}

const theatreAdminSchema = new Schema<ITheatreAdmin>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  venues: {
    type: [String],
    default: [],
  },
});

theatreAdminSchema.pre('save', async function (next) {
  try {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, config.HASH_SALT);
    }
    next();
  } catch (error) {
    next(error as Error);
  }
});

theatreAdminSchema.methods.isValidPassword = async function (passwd: string): Promise<boolean> {
  return await bcrypt.compare(passwd, this.password);
};

export const TheatreAdmin: Model<ITheatreAdmin> = mongoose.model<ITheatreAdmin>('TheatreAdmin', theatreAdminSchema);
