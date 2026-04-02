import type { Metadata } from "next";
import Link from "next/link";
import { Check, Lock, Shield } from "lucide-react";
import { SavedNavLink } from "@/components/saved-nav-link";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Get full access to every startup idea. Research-backed opportunities with market analysis, TAM estimates, and execution roadmaps. $29/month.",
};

const PRO_FEATURES = [
  "Full access to 40+ research-backed startup ideas",
  "Market data, TAM estimates, and competition analysis",
  "Execution roadmaps for each idea",
  "New ideas added weekly",
  "Cancel anytime",
];

const FREE_FEATURES = [
  "5 free articles — no account required",
  "Weekly newsletter digest",
  "Browse all categories",
];

const LOCKED_PRO_FEATURES = [
  "Full market sizing & TAM analysis",
  "Competition deep-dives",
  "Execution roadmaps",
  "All 40+ research reports",
];

const FAQ = [
  {
    question: "What do I get with Pro?",
    answer:
      "Full access to all startup idea research including market analysis, TAM estimates, competitive landscape breakdowns, and step-by-step execution roadmaps. New ideas are added every week.",
  },
  {
    question: "Can I cancel anytime?",
    answer:
      "Yes, you can cancel your subscription at any time from your dashboard. There are no cancellation fees or lock-in periods.",
  },
  {
    question: "Is there a free tier?",
    answer:
      "Yes, 5 articles are always free — no account required. You can read the full content of those articles without signing up.",
  },
  {
    question: "How often is new content added?",
    answer:
      "New startup ideas are published weekly, every Tuesday. Pro subscribers get early access before ideas go to the newsletter.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "We offer a 7-day money-back guarantee, no questions asked. If you're not satisfied within the first 7 days, contact us for a full refund.",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold text-gray-900">
            IdeaFlow
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/ideas"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Ideas
            </Link>
            <Link
              href="/newsletter"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Newsletter
            </Link>
            <SavedNavLink />
            <Link
              href="/tools/idea-finder"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Free Tools
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              About
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-gray-900 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
            >
              Subscribe
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Get full access to every startup idea
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg text-gray-600">
          Research-backed opportunities with market data, competition analysis,
          and execution roadmaps — published weekly.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="pb-24">
        <div className="mx-auto max-w-3xl px-6">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Free Card */}
            <div className="rounded-xl border border-gray-200 bg-white p-8">
              <h2 className="text-lg font-semibold text-gray-900">Free</h2>
              <p className="mt-1 text-sm text-gray-600">Try it out</p>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">$0</span>
              </div>
              <ul className="mt-6 space-y-3">
                {FREE_FEATURES.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    {feature}
                  </li>
                ))}
                {LOCKED_PRO_FEATURES.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-gray-400"
                  >
                    <Lock className="mt-0.5 h-4 w-4 shrink-0 text-gray-300" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href="/ideas"
                className="mt-8 block w-full rounded-lg border border-gray-300 px-4 py-2.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Start reading free
              </Link>
            </div>

            {/* Pro Card */}
            <div className="relative rounded-xl border border-gray-900 bg-white p-8 ring-2 ring-gray-900">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white">
                Full access
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Pro</h2>
              <p className="mt-1 text-sm text-gray-600">
                Billed monthly, cancel anytime
              </p>
              <div className="mt-4">
                <span className="text-4xl font-bold text-gray-900">$29</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="mt-6 space-y-3">
                {PRO_FEATURES.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-gray-600"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                    {feature}
                  </li>
                ))}
              </ul>
              <form action="/api/stripe/checkout" method="POST">
                <button
                  type="submit"
                  className="mt-8 block w-full rounded-lg bg-gray-900 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-gray-800 transition-colors"
                >
                  Start Pro — $29/mo
                </button>
              </form>
            </div>
          </div>

          {/* Money-back guarantee */}
          <div className="mt-10 flex items-center justify-center gap-3 rounded-xl border border-green-100 bg-green-50 px-6 py-4">
            <Shield className="h-5 w-5 shrink-0 text-green-600" />
            <p className="text-sm font-medium text-green-800">
              7-Day Money-Back Guarantee — no questions asked
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section className="py-20 border-t border-gray-100">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-center text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
            Trusted by founders
          </p>
          <h2 className="text-center text-2xl font-bold text-gray-900">
            Join 2,400+ founders reading Startup Insider
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                initial: "A",
                name: "Alex M.",
                quote: "Found my next startup idea in the second issue. Worth every penny.",
              },
              {
                initial: "S",
                name: "Sarah K.",
                quote: "The market sizing breakdowns alone save me hours of research every week.",
              },
              {
                initial: "J",
                name: "James T.",
                quote: "I've been building for 10 years — IdeaFlow consistently surfaces ideas I hadn't considered.",
              },
            ].map((t) => (
              <div key={t.name} className="rounded-xl border border-gray-200 bg-white p-6">
                <p className="text-sm text-gray-600 italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                    {t.initial}
                  </div>
                  <span className="text-sm font-medium text-gray-900">{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-gray-100 py-24 bg-gray-50">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Frequently asked questions
          </h2>
          <div className="mt-12 space-y-8">
            {FAQ.map(({ question, answer }) => (
              <div key={question}>
                <h3 className="text-base font-semibold text-gray-900">
                  {question}
                </h3>
                <p className="mt-2 text-sm text-gray-600">{answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="mx-auto max-w-6xl px-6 flex items-center justify-between text-sm text-gray-500">
          <span>&copy; {new Date().getFullYear()} IdeaFlow. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/ideas" className="hover:text-gray-700 transition-colors">
              Ideas
            </Link>
            <Link href="/about" className="hover:text-gray-700 transition-colors">
              About
            </Link>
            <Link href="/pricing" className="hover:text-gray-700 transition-colors">
              Pricing
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
