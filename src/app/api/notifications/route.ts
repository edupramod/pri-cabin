import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import NotificationModel from "@/models/Notification";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { searchParams } = new URL(req.url);
    const unreadOnly = searchParams.get("unread") === "true";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = { userId: session.user.id };
    if (unreadOnly) query.read = false;

    const [notifications, unreadCount] = await Promise.all([
      NotificationModel.find(query).sort({ createdAt: -1 }).limit(20).lean(),
      NotificationModel.countDocuments({ userId: session.user.id, read: false }),
    ]);

    return NextResponse.json({ success: true, data: notifications, unreadCount });
  } catch (error) {
    console.error("GET /api/notifications error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch notifications" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { ids, markAll } = await req.json();

    if (markAll) {
      await NotificationModel.updateMany({ userId: session.user.id, read: false }, { read: true });
    } else if (ids?.length) {
      await NotificationModel.updateMany(
        { _id: { $in: ids }, userId: session.user.id },
        { read: true }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PATCH /api/notifications error:", error);
    return NextResponse.json({ success: false, error: "Failed to update notifications" }, { status: 500 });
  }
}
