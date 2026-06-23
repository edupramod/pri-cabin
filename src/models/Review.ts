import mongoose, { Schema, Document, Types } from "mongoose";

export interface IReviewDocument extends Document {
  userId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  bookingId: Types.ObjectId;
  rating: number;
  comment: string;
  photos: string[];
  createdAt: Date;
}

const ReviewSchema = new Schema<IReviewDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true },
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true, unique: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
    photos: [{ type: String }],
  },
  { timestamps: true }
);

ReviewSchema.index({ restaurantId: 1, createdAt: -1 });
ReviewSchema.index({ userId: 1 });

export default mongoose.models.Review ||
  mongoose.model<IReviewDocument>("Review", ReviewSchema);
