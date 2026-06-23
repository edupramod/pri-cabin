import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import UserModel from "@/models/User";
import RestaurantModel from "@/models/Restaurant";
import BookingModel from "@/models/Booking";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    await connectDB();

    const [
      totalUsers,
      totalRestaurants,
      verifiedRestaurants,
      pendingRestaurants,
      totalBookings,
      pendingBookings,
      approvedBookings,
      topRestaurants,
      recentBookings,
    ] = await Promise.all([
      UserModel.countDocuments(),
      RestaurantModel.countDocuments(),
      RestaurantModel.countDocuments({ verified: "verified" }),
      RestaurantModel.countDocuments({ verified: "pending" }),
      BookingModel.countDocuments(),
      BookingModel.countDocuments({ status: "pending" }),
      BookingModel.countDocuments({ status: "approved" }),
      RestaurantModel.find({ verified: "verified" })
        .sort({ viewCount: -1 })
        .limit(5)
        .select("name viewCount averageRating totalReviews")
        .lean(),
      BookingModel.find()
        .populate("restaurantId", "name")
        .populate("userId", "name email")
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        users: { total: totalUsers },
        restaurants: {
          total: totalRestaurants,
          verified: verifiedRestaurants,
          pending: pendingRestaurants,
        },
        bookings: {
          total: totalBookings,
          pending: pendingBookings,
          approved: approvedBookings,
        },
        topRestaurants,
        recentBookings,
      },
    });
  } catch (error) {
    console.error("GET /api/admin/analytics error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch analytics" }, { status: 500 });
  }
}
