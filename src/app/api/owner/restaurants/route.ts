import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import RestaurantModel from "@/models/Restaurant";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = {};
    if (session.user.role !== "admin") {
      query.ownerId = session.user.id;
    }

    const restaurants = await RestaurantModel.find(query)
      .select("_id name verified city")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: restaurants });
  } catch (error) {
    console.error("GET /api/owner/restaurants error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch" }, { status: 500 });
  }
}
