import { auth } from "@/auth";
import { getUserSubscription, isProSubscriber } from "@/lib/subscription";
import { getPublishedArticles } from "@/lib/articles";
import Link from "next/link";
import { CheckCircle, BookOpen, Zap, ArrowRight, Crown } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const [subscription, articles] = await Promise.all([
    userId ? getUserSubscription(userId) : Promise.resolve(null),
    getPublishedArticles(),
  ]);

  const isPro = isProSubscriber(subscription);
  const premiumArticles = articles.filter((a) => a.isPremium);
  const featuredArticle = premiumArticles[0] ?? null;
  const firstName = session?.user?.name?.split(" ")[0] || "there";

  if (!isPro) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {firstName}!
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Upgrade to Pro to unlock the full premium article library.
          </p>
        </div>

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-8 text-center">
          <Crown className="mx-auto h-12 w-12 text-amber-500" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            You&apos;re on the free plan
          </h2>
          <p className="mt-2 text-sm text-gray-600 max-w-sm mx-auto">
            Get full access to all premium deep-dives, in-depth analysis, and
            exclusive startup ideas with a Pro subscription.
          </p>
          <Link
            href="/pricing"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-3 text-sm font-semibold text-white hover:bg-amber-600 transition-colors"
          >
            <Zap className="h-4 w-4" />
            Upgrade to Pro
          </Link>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <h3 className="text-base font-semibold text-gray-900">
            Free articles ({articles.filter((a) => !a.isPremium).length})
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Browse free ideas while on the free plan.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {articles
              .filter((a) => !a.isPremium)
              .slice(0, 4)
              .map((article) => (
                <Link
                  key={article.slug}
                  href={`/ideas/${article.slug}`}
                  className="block rounded-lg border border-gray-100 p-4 hover:border-gray-300 transition-colors"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                    {article.categoryName}
                  </p>
                  <h4 className="mt-1 text-sm font-medium text-gray-900 line-clamp-2">
                    {article.title}
                  </h4>
                </Link>
              ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {firstName}!
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Here&apos;s your Pro dashboard overview.
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
          <CheckCircle className="h-3.5 w-3.5" />
          Pro Active
        </span>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Articles Unlocked
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {premiumArticles.length > 0 ? premiumArticles.length : articles.length}
          </p>
          <p className="mt-0.5 text-xs text-gray-400">Full access</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            New This Week
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {
              articles.filter((a) => {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return a.publishedAt >= weekAgo;
              }).length
            }
          </p>
          <p className="mt-0.5 text-xs text-gray-400">Recently published</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Total Ideas
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {articles.length}
          </p>
          <p className="mt-0.5 text-xs text-gray-400">In the library</p>
        </div>
      </div>

      {/* Featured premium article */}
      {featuredArticle && (
        <div className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-indigo-600">
            <BookOpen className="h-3.5 w-3.5" />
            Featured Deep-Dive
          </div>
          <h2 className="mt-2 text-lg font-bold text-gray-900 line-clamp-2">
            {featuredArticle.title}
          </h2>
          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
            {featuredArticle.excerpt}
          </p>
          <Link
            href={`/ideas/${featuredArticle.slug}`}
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            Read Full Analysis
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}

      {/* Premium Articles section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Premium Articles
          </h2>
          <Link
            href="/dashboard/articles"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            View all
          </Link>
        </div>

        {premiumArticles.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-3 text-sm font-medium text-gray-600">
              More premium deep-dives coming soon. Check back weekly.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {premiumArticles.slice(0, 6).map((article) => (
              <Link
                key={article.slug}
                href={`/ideas/${article.slug}`}
                className="group block rounded-xl border border-gray-200 bg-white p-5 hover:border-indigo-200 hover:shadow-sm transition-all"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-indigo-500">
                  {article.categoryName}
                </p>
                <h3 className="mt-1.5 text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-indigo-700 transition-colors">
                  {article.title}
                </h3>
                <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                  {article.excerpt}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600">
                  Read Full Analysis
                  <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* All articles fallback when no premium articles exist yet */}
      {premiumArticles.length === 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              All Articles ({articles.length})
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.slice(0, 6).map((article) => (
              <Link
                key={article.slug}
                href={`/ideas/${article.slug}`}
                className="group block rounded-xl border border-gray-200 bg-white p-5 hover:border-indigo-200 hover:shadow-sm transition-all"
              >
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  {article.categoryName}
                </p>
                <h3 className="mt-1.5 text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-indigo-700 transition-colors">
                  {article.title}
                </h3>
                <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                  {article.excerpt}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-indigo-600">
                  Read Full Analysis
                  <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
