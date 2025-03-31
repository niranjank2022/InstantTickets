import mongoose, { Schema, Model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IAdmin extends Document {
  email: string;
  password: string;
  venues: string[];
  isValidPassword(passwd: string): Promise<boolean>;
}

const adminSchema = new Schema<IAdmin>({
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

adminSchema.pre('save', async function (next) {
  try {
    if (this.isModified('password')) {
      this.password = await bcrypt.hash(this.password, 10);
    }
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to verify the user Wpassword
adminSchema.methods.isValidPassword = async function (passwd: string): Promise<boolean> {
  return await bcrypt.compare(passwd, this.password);
};

export const Admin: Model<IAdmin> = mongoose.model<IAdmin>('Admin', adminSchema);
