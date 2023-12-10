import mongoose from 'mongoose';

interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  birthdate: Date;
  totalPosts: number;
  totalOffers: number;
  isDeleted: boolean;
  isVerified: boolean;
  isBlocked: boolean;
  reports: string[];
  createdAt: Date;
  verificationCode: string;
  verificationCodeExpires: Date | null;
  photo: string;
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
}

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  firstName: String,
  lastName: String,
  phone: String,
  role: { type: String, default: 'user' },
  birthdate: Date,
  totalPosts: { type: Number, default: 0 },
  totalOffers: { type: Number, default: 0 },
  isDeleted: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: false },
  isBlocked: { type: Boolean, default: false },
  reports: [String],
  createdAt: { type: Date, default: Date.now },
  verificationCode: String,
  verificationCodeExpires: { type: Date, default: null },
  photo: String,
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
export type { IUser };