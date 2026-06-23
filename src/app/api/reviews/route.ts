import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import ReviewModel from "@/models/Review";
import BookingModel from "@/models/Booking";
import RestaurantModel from "@/models/Restaurant";
import { reviewSchema } from "@/validators/booking.validator";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get("restaurantId");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(20, parseInt(searchParams.get("limit") || "10"));
    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = {};
    if (restaurantId) query.restaurantId = restaurantId;

    const [reviews, total] = await Promise.all([
      ReviewModel.find(query)
        .populate("userId", "name avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      ReviewModel.countDocuments(query),
    ]);

    return NextResponse.json({ success: true, data: reviews, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("GET /api/reviews error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 });
    }

    const booking = await BookingModel.findById(parsed.data.bookingId);
    if (!booking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }
    if (booking.userId.toString() !== session.user.id) {
      return NextResponse.json({ success: false, error: "You can only review your own bookings" }, { status: 403 });
    }
    if (booking.status !== "completed") {
      return NextResponse.json({ success: false, error: "You can only review completed bookings" }, { status: 400 });
    }

    const existingReview = await ReviewModel.findOne({ bookingId: parsed.data.bookingId });
    if (existingReview) {
      return NextResponse.json({ success: false, error: "You have already reviewed this booking" }, { status: 409 });
    }

    const review = await ReviewModel.create({
      ...parsed.data,
      userId: session.user.id,
      restaurantId: booking.restaurantId,
    });

    // Update restaurant average rating
    const allReviews = await ReviewModel.find({ restaurantId: booking.restaurantId });
    const avg = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await RestaurantModel.findByIdAndUpdate(booking.restaurantId, {
      averageRating: Math.round(avg * 10) / 10,
      totalReviews: allReviews.length,
    });

    const populated = await review.populate("userId", "name avatar");
    return NextResponse.json({ success: true, data: populated }, { status: 201 });
  } catch (error) {
    console.error("POST /api/reviews error:", error);
    return NextResponse.json({ success: false, error: "Failed to create review" }, { status: 500 });
  }
}
