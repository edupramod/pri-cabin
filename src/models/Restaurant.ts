import mongoose, { Schema, Document, Types } from "mongoose";

export interface IRestaurantDocument extends Document {
  ownerId: Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  address: string;
  city: string;
  phone: string;
  openingHours: Array<{
    day: string;
    open: string;
    close: string;
    closed: boolean;
  }>;
  amenities: {
    parking: boolean;
    wifi: boolean;
    ac: boolean;
    familyRooms: boolean;
    coupleSeating: boolean;
  };
  photos: string[];
  verified: "pending" | "verified" | "rejected" | "suspended";
  averageRating: number;
  totalReviews: number;
  viewCount: number;
  priceRange: 1 | 2 | 3 | 4;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RestaurantSchema = new Schema<IRestaurantDocument>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true, default: "Pokhara" },
    phone: { type: String, required: true },
    openingHours: [
      {
        day: { type: String, required: true },
        open: { type: String },
        close: { type: String },
        closed: { type: Boolean, default: false },
      },
    ],
    amenities: {
      parking: { type: Boolean, default: false },
      wifi: { type: Boolean, default: false },
      ac: { type: Boolean, default: false },
      familyRooms: { type: Boolean, default: false },
      coupleSeating: { type: Boolean, default: false },
    },
    photos: [{ type: String }],
    verified: {
      type: String,
      enum: ["pending", "verified", "rejected", "suspended"],
      default: "pending",
    },
    averageRating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    priceRange: { type: Number, enum: [1, 2, 3, 4], default: 2 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

RestaurantSchema.index({ city: 1, verified: 1 });
RestaurantSchema.index({ averageRating: -1 });
RestaurantSchema.index({ viewCount: -1 });
RestaurantSchema.index({ name: "text", description: "text", address: "text" });

export default mongoose.models.Restaurant ||
  mongoose.model<IRestaurantDocument>("Restaurant", RestaurantSchema);
