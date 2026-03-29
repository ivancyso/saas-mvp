import { headers } from "next/headers";
import { db } from "@/db";
import { subscriptions, users } from "@/db/schema";
import { getStripe } from "@/lib/stripe";
import { eq } from "drizzle-orm";
import type Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = (await headers()).get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return Response.json({ error: "Missing signature or webhook secret" }, { status: 400 });
  }

  const stripe = getStripe();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch {
    return Response.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  if (!db) {
    return Response.json({ received: true });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const clerkUserId = session.metadata?.clerkUserId;
    if (!clerkUserId || !session.subscription || !session.customer) return Response.json({ received: true });

    // Ensure user exists
    await db.insert(users).values({ id: clerkUserId, email: "" }).onConflictDoNothing();

    const sub = await stripe.subscriptions.retrieve(session.subscription as string);

    await db
      .insert(subscriptions)
      .values({
        id: crypto.randomUUID(),
        userId: clerkUserId,
        stripeCustomerId: session.customer as string,
        stripeSubscriptionId: session.subscription as string,
        stripePriceId: sub.items.data[0]?.price?.id ?? null,
        stripeCurrentPeriodEnd: new Date((sub as unknown as { current_period_end: number }).current_period_end * 1000),
        status: "active",
        plan: "pro",
      })
      .onConflictDoUpdate({
        target: subscriptions.stripeSubscriptionId,
        set: {
          status: "active",
          plan: "pro",
          stripeCurrentPeriodEnd: new Date((sub as unknown as { current_period_end: number }).current_period_end * 1000),
          updatedAt: new Date(),
        },
      });
  }

  if (event.type === "customer.subscription.updated") {
    const sub = event.data.object as Stripe.Subscription;
    const isActive = sub.status === "active" || sub.status === "trialing";

    await db
      .update(subscriptions)
      .set({
        status: isActive ? "active" : sub.status,
        plan: isActive ? "pro" : "free",
        stripeCurrentPeriodEnd: new Date((sub as unknown as { current_period_end: number }).current_period_end * 1000),
        cancelAtPeriodEnd: sub.cancel_at_period_end,
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.stripeSubscriptionId, sub.id));
  }

  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;

    await db
      .update(subscriptions)
      .set({ status: "cancelled", plan: "free", updatedAt: new Date() })
      .where(eq(subscriptions.stripeSubscriptionId, sub.id));
  }

  return Response.json({ received: true });
}
