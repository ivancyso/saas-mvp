import { NextResponse } from "next/server";
import { db } from "@/db";
import { emailSubscribers } from "@/db/schema";

export async function POST(req: Request) {
  const body = await req.json();
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address" },
      { status: 400 }
    );
  }

  try {
    await db
      .insert(emailSubscribers)
      .values({ email })
      .onConflictDoNothing({ target: emailSubscribers.email });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}
