import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import type Stripe from "stripe";

function getItemPeriodEnd(sub: Stripe.Subscription): Date {
  const item = sub.items.data[0];
  return new Date(item.current_period_end * 1000);
}

function getSubscriptionIdFromInvoice(
  invoice: Stripe.Invoice
): string | null {
  const subDetails = invoice.parent?.subscription_details;
  if (subDetails?.subscription) {
    return typeof subDetails.subscription === "string"
      ? subDetails.subscription
      : subDetails.subscription.id;
  }
  return null;
}

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Webhook Error: ${message}` },
      { status: 400 }
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      if (!userId) break;

      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );

      await db
        .insert(subscriptions)
        .values({
          id: crypto.randomUUID(),
          userId,
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: getItemPeriodEnd(subscription),
          status: subscription.status,
          plan: "pro",
        })
        .onConflictDoUpdate({
          target: subscriptions.userId,
          set: {
            stripeSubscriptionId: subscription.id,
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: getItemPeriodEnd(subscription),
            status: subscription.status,
            plan: "pro",
            updatedAt: new Date(),
          },
        });
      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId = getSubscriptionIdFromInvoice(invoice);
      if (!subscriptionId) break;

      const subscription =
        await stripe.subscriptions.retrieve(subscriptionId);

      await db
        .update(subscriptions)
        .set({
          status: subscription.status,
          stripeCurrentPeriodEnd: getItemPeriodEnd(subscription),
          updatedAt: new Date(),
        })
        .where(
          eq(subscriptions.stripeSubscriptionId, subscription.id)
        );
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await db
        .update(subscriptions)
        .set({
          status: "canceled",
          plan: "free",
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.stripeSubscriptionId, subscription.id));
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      await db
        .update(subscriptions)
        .set({
          status: subscription.status,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: getItemPeriodEnd(subscription),
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.stripeSubscriptionId, subscription.id));
      break;
    }
  }

  return NextResponse.json({ received: true });
}
