import mongoose, { Schema, Document, Types } from "mongoose";

export interface ICabinDocument extends Document {
  restaurantId: Types.ObjectId;
  name: string;
  description: string;
  privacyType: "open" | "semi-private" | "fully-private";
  capacity: number;
  photos: string[];
  active: boolean;
}

const CabinSchema = new Schema<ICabinDocument>(
  {
    restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    privacyType: {
      type: String,
      enum: ["open", "semi-private", "fully-private"],
      required: true,
    },
    capacity: { type: Number, required: true, min: 1 },
    photos: [{ type: String }],
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

CabinSchema.index({ restaurantId: 1 });

export default mongoose.models.Cabin || mongoose.model<ICabinDocument>("Cabin", CabinSchema);
