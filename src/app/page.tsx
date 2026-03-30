import Link from "next/link";
import { Check } from "lucide-react";
import { PLANS } from "@/lib/plans";
import { NewsletterForm } from "@/components/newsletter-form";
import { getAllCategories } from "@/lib/articles";

export default async function LandingPage() {
  const categories = await getAllCategories();

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
              href="#pricing"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
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
      <section className="mx-auto max-w-4xl px-6 py-24 text-center">
        <div className="inline-block rounded-full bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700 mb-6">
          New ideas published weekly
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          Startup ideas backed
          <br />
          <span className="text-blue-600">by real research</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          We publish deeply researched startup opportunities every week.
          Market sizing, competitive analysis, and step-by-step execution
          playbooks — so you can build with confidence.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/ideas"
            className="rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Start reading for free
          </Link>
          <Link
            href="/tools/idea-finder"
            className="rounded-lg border border-gray-300 px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Try the Idea Finder →
          </Link>
          <Link
            href="#pricing"
            className="rounded-lg border border-gray-300 px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            View pricing
          </Link>
        </div>
      </section>

      {/* Browse by Category */}
      {categories.length > 0 && (
        <section className="border-t border-gray-100 py-16">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-2xl font-bold text-gray-900">Browse by Category</h2>
            <p className="mt-2 text-gray-600">
              Explore startup ideas by industry and opportunity type.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/ideas/category/${cat.slug}`}
                  className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sample article previews */}
      <section className="border-t border-gray-100 bg-gray-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            What you get with IdeaFlow
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-gray-600">
            Every idea comes with the research you need to evaluate and execute.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Market Analysis",
                desc: "TAM/SAM/SOM breakdown, growth trends, and timing analysis for every opportunity.",
              },
              {
                title: "Competitive Landscape",
                desc: "Who else is building in this space, what they're doing right, and where the gaps are.",
              },
              {
                title: "Execution Playbook",
                desc: "Step-by-step guide to validate, build, and launch. From MVP to first paying customer.",
              },
              {
                title: "Revenue Models",
                desc: "Proven monetization strategies with pricing benchmarks from comparable businesses.",
              },
              {
                title: "Risk Assessment",
                desc: "Known challenges, regulatory considerations, and mitigation strategies.",
              },
              {
                title: "Weekly Updates",
                desc: "Fresh ideas delivered to your inbox every week. Never miss an opportunity.",
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

      {/* Social proof placeholder */}
      <section className="py-16 border-t border-gray-100">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-gray-400">
            Trusted by founders and investors
          </p>
          <div className="mt-8 flex items-center justify-center gap-12 text-gray-300">
            <span className="text-lg font-semibold">YC Founders</span>
            <span className="text-lg font-semibold">Angel Investors</span>
            <span className="text-lg font-semibold">Indie Hackers</span>
            <span className="text-lg font-semibold">VCs</span>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 border-t border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            Simple pricing
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-gray-600">
            Start free. Upgrade when you're ready for full access.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-2 max-w-2xl mx-auto">
            {(
              Object.entries(PLANS) as [
                string,
                (typeof PLANS)[keyof typeof PLANS],
              ][]
            ).map(([key, plan]) => (
              <div
                key={key}
                className={`rounded-xl border p-8 bg-white ${
                  key === "pro"
                    ? "border-gray-900 ring-2 ring-gray-900 relative"
                    : "border-gray-200"
                }`}
              >
                {key === "pro" && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gray-900 px-3 py-1 text-xs font-medium text-white">
                    Full access
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
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/auth/signup"
                  className={`mt-8 block w-full rounded-lg px-4 py-2.5 text-center text-sm font-medium transition-colors ${
                    key === "pro"
                      ? "bg-gray-900 text-white hover:bg-gray-800"
                      : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {plan.price === 0 ? "Get started free" : "Start 14-day free trial"}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-24 border-t border-gray-100">
        <div className="mx-auto max-w-xl px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Get ideas in your inbox
          </h2>
          <p className="mt-4 text-gray-600">
            Join our free weekly newsletter. New startup ideas with market analysis
            delivered every Tuesday.
          </p>
          <p className="mt-4 text-sm font-medium text-blue-600">
            Join 0+ founders getting weekly startup ideas
          </p>
          <div className="mt-8">
            <NewsletterForm />
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
            <Link href="#pricing" className="hover:text-gray-700 transition-colors">
              Pricing
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
