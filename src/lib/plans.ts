export const PLANS = {
  free: {
    name: "Free",
    description: "Browse startup ideas",
    price: 0,
    priceId: null,
    features: [
      "Read article previews & summaries",
      "3 full articles per month",
      "Weekly newsletter digest",
      "Browse all categories",
    ],
  },
  pro: {
    name: "Pro",
    description: "Full access to all research",
    price: 29,
    priceId: process.env.STRIPE_PRO_PRICE_ID ?? null,
    features: [
      "Unlimited full article access",
      "Deep-dive startup research",
      "Market sizing & TAM analysis",
      "Weekly newsletter digest",
      "Early access to new ideas",
      "Full archive access",
    ],
  },
} as const;

export type PlanKey = keyof typeof PLANS;

export const FREE_ARTICLE_LIMIT = 3;
