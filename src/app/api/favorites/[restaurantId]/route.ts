import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { FavoriteModel } from "@/models/Favorite";

export async function GET(req: NextRequest, { params }: { params: Promise<{ restaurantId: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: true, favorited: false });
    }

    await connectDB();
    const { restaurantId } = await params;
    const favorite = await FavoriteModel.findOne({ userId: session.user.id, restaurantId });
    return NextResponse.json({ success: true, favorited: !!favorite });
  } catch {
    return NextResponse.json({ success: true, favorited: false });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ restaurantId: string }> }) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { restaurantId } = await params;
    await FavoriteModel.findOneAndDelete({ userId: session.user.id, restaurantId });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/favorites/[restaurantId] error:", error);
    return NextResponse.json({ success: false, error: "Failed to remove favorite" }, { status: 500 });
  }
}
