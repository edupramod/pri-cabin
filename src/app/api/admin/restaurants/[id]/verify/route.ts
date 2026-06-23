import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import RestaurantModel from "@/models/Restaurant";
import UserModel from "@/models/User";
import { sendRestaurantVerifiedEmail } from "@/services/email.service";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    await connectDB();
    const { id } = await params;
    const { status } = await req.json();

    if (!["verified", "rejected", "suspended", "pending"].includes(status)) {
      return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 });
    }

    const restaurant = await RestaurantModel.findByIdAndUpdate(
      id,
      { verified: status },
      { new: true }
    ).populate("ownerId", "name email");

    if (!restaurant) {
      return NextResponse.json({ success: false, error: "Restaurant not found" }, { status: 404 });
    }

    if (status === "verified") {
      const owner = restaurant.ownerId as { name: string; email: string };
      sendRestaurantVerifiedEmail({
        to: owner.email,
        ownerName: owner.name,
        restaurantName: restaurant.name,
      }).catch(console.error);
    }

    return NextResponse.json({ success: true, data: restaurant });
  } catch (error) {
    console.error("PATCH /api/admin/restaurants/[id]/verify error:", error);
    return NextResponse.json({ success: false, error: "Failed to update restaurant" }, { status: 500 });
  }
}
