import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import UserModel from "@/models/User";

export async function GET(req: NextRequest) {
  const session = await auth();
  const { searchParams } = new URL(req.url);
  const intendedRole = searchParams.get("role");

  if (session?.user?.id && intendedRole === "owner") {
    await connectDB();
    const user = await UserModel.findById(session.user.id);
    if (user && user.role === "customer") {
      user.role = "owner";
      await user.save();
    }
  }

  const destination = intendedRole === "owner" ? "/owner" : "/";
  return NextResponse.redirect(new URL(destination, req.url));
}