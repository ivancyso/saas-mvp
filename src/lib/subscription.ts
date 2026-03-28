export async function getUserSubscription(_userId: string) {
  // Subscriptions are not available in the MDX-only version
  return null;
}

export function isProSubscriber(
  sub: { status: string; plan: string; stripeCurrentPeriodEnd: Date | null } | null
): boolean {
  if (!sub) return false;
  if (sub.plan !== "pro") return false;
  if (sub.status !== "active" && sub.status !== "trialing") return false;
  if (sub.stripeCurrentPeriodEnd && sub.stripeCurrentPeriodEnd < new Date()) return false;
  return true;
}
