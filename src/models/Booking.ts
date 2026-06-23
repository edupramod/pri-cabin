import mongoose, { Schema, Document, Types } from "mongoose";
import type { BookingStatus } from "@/types";

export interface IBookingDocument extends Document {
  userId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  cabinId?: Types.ObjectId;
  bookingDate: string;
  bookingTime: string;
  peopleCount: number;
  status: BookingStatus;
  notes?: string;
  ownerNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBookingDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true },
    cabinId: { type: Schema.Types.ObjectId, ref: "Cabin" },
    bookingDate: { type: String, required: true },
    bookingTime: { type: String, required: true },
    peopleCount: { type: Number, required: true, min: 1 },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled", "completed"],
      default: "pending",
    },
    notes: { type: String, trim: true },
    ownerNotes: { type: String, trim: true },
  },
  { timestamps: true }
);

BookingSchema.index({ userId: 1, createdAt: -1 });
BookingSchema.index({ restaurantId: 1, status: 1 });
BookingSchema.index({ restaurantId: 1, bookingDate: 1 });

export default mongoose.models.Booking ||
  mongoose.model<IBookingDocument>("Booking", BookingSchema);
