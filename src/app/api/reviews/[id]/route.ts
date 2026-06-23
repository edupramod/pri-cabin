import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import ReviewModel from "@/models/Review";
import RestaurantModel from "@/models/Restaurant";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const review = await ReviewModel.findById(id);

    if (!review) {
      return NextResponse.json({ success: false, error: "Review not found" }, { status: 404 });
    }

    const isOwner = review.userId.toString() === session.user.id;
    const isAdmin = session.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
    }

    await ReviewModel.findByIdAndDelete(id);

    // Recalculate restaurant rating
    const remaining = await ReviewModel.find({ restaurantId: review.restaurantId });
    const avg = remaining.length > 0
      ? remaining.reduce((sum, r) => sum + r.rating, 0) / remaining.length
      : 0;
    await RestaurantModel.findByIdAndUpdate(review.restaurantId, {
      averageRating: Math.round(avg * 10) / 10,
      totalReviews: remaining.length,
    });

    return NextResponse.json({ success: true, message: "Review deleted" });
  } catch (error) {
    console.error("DELETE /api/reviews/[id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete review" }, { status: 500 });
  }
}
