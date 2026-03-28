import { NextResponse } from "next/server";

export async function POST() {
  // Auth signup is not available in the MDX-only version
  return NextResponse.json(
    { error: "Signup is not available yet" },
    { status: 503 }
  );
}
