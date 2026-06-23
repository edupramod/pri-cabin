import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import BookingModel from "@/models/Booking";
import RestaurantModel from "@/models/Restaurant";
import UserModel from "@/models/User";
import { bookingSchema } from "@/validators/booking.validator";
import { notifyBookingReceived } from "@/services/notification.service";
import { sendBookingConfirmedEmail } from "@/services/email.service";
import { rateLimit } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(20, parseInt(searchParams.get("limit") || "10"));
    const skip = (page - 1) * limit;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = { userId: session.user.id };
    const status = searchParams.get("status");
    if (status) query.status = status;

    const [bookings, total] = await Promise.all([
      BookingModel.find(query)
        .populate("restaurantId", "name slug photos city")
        .populate("cabinId", "name privacyType")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      BookingModel.countDocuments(query),
    ]);

    return NextResponse.json({ success: true, data: bookings, total, page, limit, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("GET /api/bookings error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const rl = rateLimit(`booking:${session.user.id}:${ip}`, 5, 60_000);
    if (!rl.success) {
      return NextResponse.json({ success: false, error: "Too many requests. Please wait." }, { status: 429 });
    }

    await connectDB();
    const body = await req.json();
    const parsed = bookingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 });
    }

    const restaurant = await RestaurantModel.findById(parsed.data.restaurantId).populate("ownerId", "_id name email");
    if (!restaurant) {
      return NextResponse.json({ success: false, error: "Restaurant not found" }, { status: 404 });
    }
    if (restaurant.verified !== "verified") {
      return NextResponse.json({ success: false, error: "Restaurant is not available for booking" }, { status: 400 });
    }

    const booking = await BookingModel.create({ ...parsed.data, userId: session.user.id });

    // Notify owner
    const owner = restaurant.ownerId as { _id: string; name: string; email: string };
    await notifyBookingReceived(owner._id.toString(), restaurant.name, booking._id.toString());

    // Email customer
    const user = await UserModel.findById(session.user.id);
    if (user) {
      sendBookingConfirmedEmail({
        to: user.email,
        userName: user.name,
        restaurantName: restaurant.name,
        bookingDate: parsed.data.bookingDate,
        bookingTime: parsed.data.bookingTime,
        peopleCount: parsed.data.peopleCount,
      }).catch(console.error);
    }

    return NextResponse.json({ success: true, data: booking }, { status: 201 });
  } catch (error) {
    console.error("POST /api/bookings error:", error);
    return NextResponse.json({ success: false, error: "Failed to create booking" }, { status: 500 });
  }
}
