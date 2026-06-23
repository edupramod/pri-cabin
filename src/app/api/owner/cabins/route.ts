import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import CabinModel from "@/models/Cabin";
import RestaurantModel from "@/models/Restaurant";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const restaurantId = searchParams.get("restaurantId");

    if (!restaurantId) {
      return NextResponse.json({ success: false, error: "restaurantId required" }, { status: 400 });
    }

    // Verify ownership
    const restaurant = await RestaurantModel.findById(restaurantId);
    if (!restaurant) {
      return NextResponse.json({ success: false, error: "Restaurant not found" }, { status: 404 });
    }
    if (restaurant.ownerId.toString() !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const cabins = await CabinModel.find({ restaurantId }).lean();
    return NextResponse.json({ success: true, data: cabins });
  } catch (error) {
    console.error("GET /api/owner/cabins error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch" }, { status: 500 });
  }
}
