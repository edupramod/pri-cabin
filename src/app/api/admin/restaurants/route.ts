import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import RestaurantModel from "@/models/Restaurant";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "20"));
    const skip = (page - 1) * limit;
    const status = searchParams.get("status");

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = {};
    if (status) query.verified = status;

    const [restaurants, total] = await Promise.all([
      RestaurantModel.find(query)
        .populate("ownerId", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      RestaurantModel.countDocuments(query),
    ]);

    return NextResponse.json({ success: true, data: restaurants, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("GET /api/admin/restaurants error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch restaurants" }, { status: 500 });
  }
}
