import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { FavoriteModel } from "@/models/Favorite";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(20, parseInt(searchParams.get("limit") || "12"));
    const skip = (page - 1) * limit;

    const [favorites, total] = await Promise.all([
      FavoriteModel.find({ userId: session.user.id })
        .populate("restaurantId", "name slug photos averageRating totalReviews city priceRange amenities")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      FavoriteModel.countDocuments({ userId: session.user.id }),
    ]);

    return NextResponse.json({ success: true, data: favorites, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("GET /api/favorites error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch favorites" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { restaurantId } = await req.json();
    if (!restaurantId) {
      return NextResponse.json({ success: false, error: "Restaurant ID is required" }, { status: 400 });
    }

    const existing = await FavoriteModel.findOne({ userId: session.user.id, restaurantId });
    if (existing) {
      await FavoriteModel.findByIdAndDelete(existing._id);
      return NextResponse.json({ success: true, favorited: false });
    }

    await FavoriteModel.create({ userId: session.user.id, restaurantId });
    return NextResponse.json({ success: true, favorited: true }, { status: 201 });
  } catch (error) {
    console.error("POST /api/favorites error:", error);
    return NextResponse.json({ success: false, error: "Failed to toggle favorite" }, { status: 500 });
  }
}
