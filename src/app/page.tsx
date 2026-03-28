import Link from "next/link";
import { Check } from "lucide-react";
import { PLANS } from "@/lib/plans";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="text-xl font-bold text-gray-900">SaaS MVP</div>
          <div className="flex items-center gap-4">
            <Link
              href="/auth/signin"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <div className="inline-block rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 mb-6">
          14-day free trial &middot; No credit card required
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Ship your SaaS
          <br />
          <span className="text-blue-600">faster than ever</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          Everything you need to launch, grow, and scale your subscription
          business. Built with the modern stack, deployed in minutes.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/auth/signup"
            className="rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Start free trial
          </Link>
          <Link
            href="#pricing"
            className="rounded-lg border border-gray-300 px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            View pricing
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-gray-100 bg-gray-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Everything you need to succeed
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Authentication",
                desc: "Email/password and Google OAuth out of the box. Secure sessions with JWT.",
              },
              {
                title: "Subscription Billing",
                desc: "Stripe-powered billing with free trials, upgrades, and customer portal.",
              },
              {
                title: "Dashboard",
                desc: "Beautiful dashboard shell with sidebar navigation and responsive design.",
              },
              {
                title: "Database",
                desc: "PostgreSQL with Drizzle ORM. Type-safe queries and automatic migrations.",
              },
              {
                title: "SEO Ready",
                desc: "Server-side rendering, metadata API, and optimized performance scores.",
              },
              {
                title: "Deploy Anywhere",
                desc: "Optimized for Vercel with zero-config. Works with any Node.js host.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-gray-200 bg-white p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Simple, transparent pricing
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-gray-600">
            Start free and scale as you grow. All plans include a 14-day trial.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {(
              Object.entries(PLANS) as [
                string,
                (typeof PLANS)[keyof typeof PLANS],
              ][]
            ).map(([key, plan]) => (
              <div
                key={key}
                className={`rounded-xl border p-8 ${
                  key === "pro"
                    ? "border-blue-600 ring-2 ring-blue-600 relative"
                    : "border-gray-200"
                }`}
              >
                {key === "pro" && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white">
                    Most popular
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-900">
                  {plan.name}
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  {plan.description}
                </p>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">
                    ${plan.price}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-gray-600">/mo</span>
                  )}
                </div>
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-gray-600"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/signup"
                  className={`mt-8 block w-full rounded-lg px-4 py-2.5 text-center text-sm font-medium transition-colors ${
                    key === "pro"
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {plan.price === 0 ? "Get started free" : "Start free trial"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} SaaS MVP. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
