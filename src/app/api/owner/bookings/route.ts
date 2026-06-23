import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import BookingModel from "@/models/Booking";
import RestaurantModel from "@/models/Restaurant";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(20, parseInt(searchParams.get("limit") || "20"));
    const skip = (page - 1) * limit;

    // Get all restaurants owned by this user
    const myRestaurants = await RestaurantModel.find({ ownerId: session.user.id }).select("_id").lean();
    const restaurantIds = myRestaurants.map((r) => r._id);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = { restaurantId: { $in: restaurantIds } };
    if (status) query.status = status;

    const [bookings, total] = await Promise.all([
      BookingModel.find(query)
        .populate("restaurantId", "name slug")
        .populate("userId", "name email phone")
        .populate("cabinId", "name privacyType")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      BookingModel.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: bookings,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("GET /api/owner/bookings error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch bookings" }, { status: 500 });
  }
}
