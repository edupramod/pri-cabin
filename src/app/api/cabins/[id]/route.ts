import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import CabinModel from "@/models/Cabin";
import RestaurantModel from "@/models/Restaurant";
import { cabinSchema } from "@/validators/booking.validator";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const cabin = await CabinModel.findById(id);
    if (!cabin) {
      return NextResponse.json({ success: false, error: "Cabin not found" }, { status: 404 });
    }

    const restaurant = await RestaurantModel.findById(cabin.restaurantId);
    if (!restaurant || (restaurant.ownerId.toString() !== session.user.id && session.user.role !== "admin")) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const parsed = cabinSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.flatten() }, { status: 400 });
    }

    const updated = await CabinModel.findByIdAndUpdate(id, parsed.data, { new: true });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("PUT /api/cabins/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to update cabin" }, { status: 500 });
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
    const cabin = await CabinModel.findById(id);
    if (!cabin) {
      return NextResponse.json({ success: false, error: "Cabin not found" }, { status: 404 });
    }

    const restaurant = await RestaurantModel.findById(cabin.restaurantId);
    if (!restaurant || (restaurant.ownerId.toString() !== session.user.id && session.user.role !== "admin")) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    await CabinModel.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Cabin deleted" });
  } catch (error) {
    console.error("DELETE /api/cabins/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete cabin" }, { status: 500 });
  }
}
