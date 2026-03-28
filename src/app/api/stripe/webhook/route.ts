import { NextResponse } from "next/server";

export async function POST() {
  // Stripe webhooks are not available in the MDX-only version
  return NextResponse.json(
    { error: "Webhooks are not available yet" },
    { status: 503 }
  );
}
