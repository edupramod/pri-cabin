import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import BookingModel from "@/models/Booking";
import RestaurantModel from "@/models/Restaurant";
import UserModel from "@/models/User";
import { notifyBookingStatusChanged } from "@/services/notification.service";
import { sendBookingApprovedEmail, sendBookingRejectedEmail } from "@/services/email.service";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const booking = await BookingModel.findById(id)
      .populate("restaurantId", "name slug photos address phone")
      .populate("cabinId", "name privacyType capacity")
      .populate("userId", "name email phone")
      .lean() as any;

    if (!booking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }

    const restaurant = await RestaurantModel.findById((booking.restaurantId as { _id: string })._id);
    const isOwner = restaurant?.ownerId.toString() === session.user.id;
    const isCustomer = (booking.userId as { _id: string })._id.toString() === session.user.id;
    const isAdmin = session.user.role === "admin";

    if (!isOwner && !isCustomer && !isAdmin) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    console.error("GET /api/bookings/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch booking" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const { status, ownerNotes } = body;

    const booking = await BookingModel.findById(id).populate("restaurantId").populate("userId");
    if (!booking) {
      return NextResponse.json({ success: false, error: "Booking not found" }, { status: 404 });
    }

    const restaurant = booking.restaurantId as { ownerId: { toString: () => string }; name: string };
    const customer = booking.userId as { _id: { toString: () => string }; name: string; email: string };
    const isOwner = restaurant.ownerId.toString() === session.user.id;
    const isCustomer = customer._id.toString() === session.user.id;
    const isAdmin = session.user.role === "admin";

    // Determine valid status transitions
    if (status === "approved" || status === "rejected") {
      if (!isOwner && !isAdmin) {
        return NextResponse.json({ success: false, error: "Only the restaurant owner can approve/reject" }, { status: 403 });
      }
    } else if (status === "cancelled") {
      if (!isCustomer && !isAdmin) {
        return NextResponse.json({ success: false, error: "Only the customer can cancel" }, { status: 403 });
      }
    } else if (status === "completed") {
      if (!isOwner && !isAdmin) {
        return NextResponse.json({ success: false, error: "Only the restaurant owner can mark as completed" }, { status: 403 });
      }
    }

    const updateData: Record<string, string> = { status };
    if (ownerNotes) updateData.ownerNotes = ownerNotes;

    const updated = await BookingModel.findByIdAndUpdate(id, updateData, { new: true });

    // Send notifications and emails
    if (status === "approved" || status === "rejected") {
      const user = await UserModel.findById(customer._id);
      if (user) {
        notifyBookingStatusChanged(
          customer._id.toString(),
          status,
          restaurant.name,
          id
        ).catch(console.error);

        if (status === "approved") {
          sendBookingApprovedEmail({
            to: user.email,
            userName: user.name,
            restaurantName: restaurant.name,
            bookingDate: booking.bookingDate,
            bookingTime: booking.bookingTime,
            ownerNotes,
          }).catch(console.error);
        } else {
          sendBookingRejectedEmail({
            to: user.email,
            userName: user.name,
            restaurantName: restaurant.name,
          }).catch(console.error);
        }
      }
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("PATCH /api/bookings/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to update booking" }, { status: 500 });
  }
}
