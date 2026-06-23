import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import RestaurantModel from "@/models/Restaurant";
import CabinModel from "@/models/Cabin";
import ReviewModel from "@/models/Review";
import { restaurantSchema } from "@/validators/restaurant.validator";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;

    const restaurant = await RestaurantModel.findById(id).populate("ownerId", "name email").lean() as any;
    if (!restaurant) {
      return NextResponse.json({ success: false, error: "Restaurant not found" }, { status: 404 });
    }

    const [cabins, reviews] = await Promise.all([
      CabinModel.find({ restaurantId: id, active: true }).lean(),
      ReviewModel.find({ restaurantId: id })
        .populate("userId", "name avatar")
        .sort({ createdAt: -1 })
        .limit(10)
        .lean(),
    ]);

    return NextResponse.json({ success: true, data: { ...restaurant, cabins, reviews } });
  } catch (error) {
    console.error("GET /api/restaurants/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch restaurant" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const restaurant = await RestaurantModel.findById(id);

    if (!restaurant) {
      return NextResponse.json({ success: false, error: "Restaurant not found" }, { status: 404 });
    }
    if (
      restaurant.ownerId.toString() !== session.user.id &&
      session.user.role !== "admin"
    ) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = restaurantSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 });
    }

    const updated = await RestaurantModel.findByIdAndUpdate(id, parsed.data, { new: true });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("PUT /api/restaurants/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to update restaurant" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const restaurant = await RestaurantModel.findById(id);

    if (!restaurant) {
      return NextResponse.json({ success: false, error: "Restaurant not found" }, { status: 404 });
    }
    if (
      restaurant.ownerId.toString() !== session.user.id &&
      session.user.role !== "admin"
    ) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    await RestaurantModel.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Restaurant deleted" });
  } catch (error) {
    console.error("DELETE /api/restaurants/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete restaurant" }, { status: 500 });
  }
}
