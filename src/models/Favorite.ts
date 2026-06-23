import mongoose, { Schema, Document, Types } from "mongoose";

export interface IFavoriteDocument extends Document {
  userId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  createdAt: Date;
}

const FavoriteSchema = new Schema<IFavoriteDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    restaurantId: { type: Schema.Types.ObjectId, ref: "Restaurant", required: true },
  },
  { timestamps: true }
);

FavoriteSchema.index({ userId: 1, restaurantId: 1 }, { unique: true });

export const FavoriteModel =
  mongoose.models.Favorite ||
  mongoose.model<IFavoriteDocument>("Favorite", FavoriteSchema);
