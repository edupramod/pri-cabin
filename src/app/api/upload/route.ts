import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateSignedUploadParams } from "@/lib/cloudinary";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const rl = rateLimit(`upload:${session.user.id}:${ip}`, 20, 60_000);
    if (!rl.success) {
      return NextResponse.json({ success: false, error: "Upload rate limit exceeded" }, { status: 429 });
    }

    const { folder } = await req.json();
    const params = await generateSignedUploadParams(folder || "private-dining");
    return NextResponse.json({ success: true, data: params });
  } catch (error) {
    console.error("POST /api/upload error:", error);
    return NextResponse.json({ success: false, error: "Failed to generate upload params" }, { status: 500 });
  }
}
