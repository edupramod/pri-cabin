import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import RestaurantModel from "@/models/Restaurant";
import CabinModel from "@/models/Cabin";

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB();
    const { slug } = await params;

    const restaurant = await RestaurantModel.findOne({ slug, verified: "verified" }).lean() as (Record<string, unknown> & { _id: unknown }) | null;
    if (!restaurant) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }

    const cabins = await CabinModel.find({ restaurantId: restaurant._id as string, active: true }).lean();
    return NextResponse.json({ success: true, data: { ...restaurant, cabins } });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
