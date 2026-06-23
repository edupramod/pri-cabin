import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import UserModel from "@/models/User";
import { registerSchema } from "@/validators/auth.validator";
import { rateLimit } from "@/lib/rate-limit";
import { sendWelcomeEmail } from "@/services/email.service";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const rl = rateLimit(`register:${ip}`, 5, 300_000);
    if (!rl.success) {
      return NextResponse.json({ success: false, error: "Too many registration attempts. Try again later." }, { status: 429 });
    }

    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    await connectDB();

    const existing = await UserModel.findOne({ email: parsed.data.email });
    if (existing) {
      return NextResponse.json({ success: false, error: "An account with this email already exists." }, { status: 409 });
    }

    const validRoles = ["customer", "owner"];
    const role = validRoles.includes(body.role) ? body.role : "customer";

    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    const user = await UserModel.create({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      passwordHash,
      role,
    });

    // Send welcome email asynchronously
    sendWelcomeEmail({ to: user.email, name: user.name }).catch(console.error);

    return NextResponse.json({
      success: true,
      data: { id: user._id, name: user.name, email: user.email, role: user.role },
    }, { status: 201 });
  } catch (error) {
    console.error("POST /api/auth/register error:", error);
    return NextResponse.json({ success: false, error: "Registration failed. Please try again." }, { status: 500 });
  }
}
