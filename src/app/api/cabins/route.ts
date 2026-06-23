import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import CabinModel from "@/models/Cabin";
import RestaurantModel from "@/models/Restaurant";
import { cabinSchema } from "@/validators/booking.validator";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const parsed = cabinSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 });
    }

    const { restaurantId, ...cabinData } = body;
    const restaurant = await RestaurantModel.findById(restaurantId);
    if (!restaurant) {
      return NextResponse.json({ success: false, error: "Restaurant not found" }, { status: 404 });
    }
    if (
      restaurant.ownerId.toString() !== session.user.id &&
      session.user.role !== "admin"
    ) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const cabin = await CabinModel.create({ ...parsed.data, restaurantId });
    return NextResponse.json({ success: true, data: cabin }, { status: 201 });
  } catch (error) {
    console.error("POST /api/cabins error:", error);
    return NextResponse.json({ success: false, error: "Failed to create cabin" }, { status: 500 });
  }
}
