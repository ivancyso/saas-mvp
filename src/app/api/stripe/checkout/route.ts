import { NextResponse } from "next/server";

export async function POST() {
  // Stripe checkout is not available in the MDX-only version
  return NextResponse.json(
    { error: "Checkout is not available yet" },
    { status: 503 }
  );
}
