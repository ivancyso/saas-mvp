import { NextResponse } from "next/server";

const MAILERLITE_GROUP_ID = "183327532174542396";

export async function POST(req: Request) {
  const body = await req.json();
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address" },
      { status: 400 }
    );
  }

  const apiKey = process.env.MAILERLITE_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Newsletter service not configured" },
      { status: 503 }
    );
  }

  const mlRes = await fetch("https://connect.mailerlite.com/api/subscribers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ email, groups: [MAILERLITE_GROUP_ID] }),
  });

  if (!mlRes.ok) {
    const mlBody = await mlRes.json().catch(() => ({}));
    const message =
      typeof mlBody?.message === "string"
        ? mlBody.message
        : "Failed to subscribe. Please try again.";
    return NextResponse.json({ error: message }, { status: mlRes.status });
  }

  return NextResponse.json({ success: true });
}
