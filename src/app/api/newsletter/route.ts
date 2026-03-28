import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address" },
      { status: 400 }
    );
  }

  // TODO: integrate with email service (Resend, ConvertKit, etc.)
  // For now, accept the subscription without persisting
  return NextResponse.json({ success: true });
}
