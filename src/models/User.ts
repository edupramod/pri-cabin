import mongoose, { Schema, Document } from "mongoose";
import type { UserRole } from "@/types";

export interface IUserDocument extends Document {
  name: string;
  email: string;
  phone?: string;
  passwordHash?: string;
  role: UserRole;
  avatar?: string;
  suspended: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    passwordHash: { type: String, select: false },
    role: { type: String, enum: ["customer", "owner", "admin"], default: "customer" },
    avatar: { type: String },
    suspended: { type: Boolean, default: false },
  },
  { timestamps: true }
);


export default mongoose.models.User || mongoose.model<IUserDocument>("User", UserSchema);
