import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { NewsletterForm } from "@/components/newsletter-form";
import { SavedNavLink } from "@/components/saved-nav-link";

export const metadata: Metadata = {
  title: "Newsletter | IdeaFlow",
  description:
    "Get weekly startup ideas in your inbox. Research-backed breakdowns with market data, TAM estimates, and how to start.",
};

const BENEFITS = [
  {
    title: "Market data & TAM estimates",
    desc: "Every idea includes total addressable market sizing and growth trend analysis so you know the opportunity before you commit.",
  },
  {
    title: "Competition analysis",
    desc: "Who's already in the space, what they're doing right, and where the gaps are — so you can position your startup for success.",
  },
  {
    title: "Execution roadmap",
    desc: "Step-by-step playbooks from idea validation to first paying customer, so you can move fast with confidence.",
  },
];

export default function NewsletterPage() {
  return (
    <div className="min-h-screen bg-white">
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
              className="text-sm font-medium text-gray-900"
            >
              Newsletter
            </Link>
            <SavedNavLink />
            <Link
              href="/about"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              About
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

      <main className="mx-auto max-w-2xl px-6 py-24 text-center">
        <div className="inline-block rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 mb-6">
          Free weekly newsletter
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Get weekly startup ideas in your inbox
        </h1>

        <p className="mt-6 text-lg text-gray-600">
          Research-backed breakdowns with market data, TAM estimates, and how to
          start. Delivered every Tuesday.
        </p>

        <ul className="mt-10 space-y-4 text-left">
          {BENEFITS.map((benefit) => (
            <li key={benefit.title} className="flex items-start gap-4">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100">
                <Check className="h-3.5 w-3.5 text-blue-600" />
              </span>
              <div>
                <p className="font-semibold text-gray-900">{benefit.title}</p>
                <p className="mt-0.5 text-sm text-gray-600">{benefit.desc}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-12 rounded-xl border border-gray-200 bg-gray-50 p-8">
          <p className="mb-4 text-sm font-medium text-gray-700">
            Join thousands of founders getting weekly startup ideas
          </p>
          <NewsletterForm />
          <p className="mt-4 text-xs text-gray-400">
            No spam. Unsubscribe at any time.
          </p>
        </div>
      </main>
    </div>
  );
}
