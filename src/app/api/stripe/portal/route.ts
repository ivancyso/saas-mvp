import { NextResponse } from "next/server";

export async function POST() {
  // Stripe portal is not available in the MDX-only version
  return NextResponse.json(
    { error: "Billing portal is not available yet" },
    { status: 503 }
  );
}
