export const PLANS = {
  free: {
    name: "Free",
    description: "Get started for free",
    price: 0,
    priceId: null,
    features: [
      "Up to 100 records",
      "Basic analytics",
      "Email support",
      "1 team member",
    ],
  },
  pro: {
    name: "Pro",
    description: "For growing businesses",
    price: 29,
    priceId: process.env.STRIPE_PRO_PRICE_ID ?? null,
    features: [
      "Unlimited records",
      "Advanced analytics",
      "Priority support",
      "5 team members",
      "API access",
      "Custom integrations",
    ],
  },
  business: {
    name: "Business",
    description: "For large teams",
    price: 99,
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID ?? null,
    features: [
      "Everything in Pro",
      "Unlimited team members",
      "Dedicated support",
      "Custom branding",
      "SLA guarantee",
      "Advanced security",
    ],
  },
} as const;

export type PlanKey = keyof typeof PLANS;
