import { auth } from "@/auth";
import { getUserSubscription, isProSubscriber } from "@/lib/subscription";
import { getPublishedArticles } from "@/lib/articles";
import Link from "next/link";
import { ArrowRight, BookOpen, Zap } from "lucide-react";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Premium Articles | IdeaFlow Pro",
};

export default async function DashboardArticlesPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/auth/signin");
  }

  const [subscription, articles] = await Promise.all([
    getUserSubscription(userId),
    getPublishedArticles(),
  ]);

  const isPro = isProSubscriber(subscription);

  if (!isPro) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Premium Articles</h1>
          <p className="mt-1 text-sm text-gray-600">
            Upgrade to Pro to unlock the full library.
          </p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-8 text-center">
          <h2 className="text-lg font-semibold text-gray-900">Pro required</h2>
          <p className="mt-2 text-sm text-gray-600">
            Premium articles are exclusively available to Pro subscribers.
          </p>
          <Link
            href="/pricing"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 transition-colors"
          >
            <Zap className="h-4 w-4" />
            Upgrade to Pro
          </Link>
        </div>
      </div>
    );
  }

  const premiumArticles = articles.filter((a) => a.isPremium);
  const allArticles = premiumArticles.length > 0 ? premiumArticles : articles;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Premium Articles</h1>
        <p className="mt-1 text-sm text-gray-600">
          {premiumArticles.length > 0
            ? `${premiumArticles.length} premium deep-dives — fully unlocked for you.`
            : `${articles.length} articles available — premium deep-dives coming soon.`}
        </p>
      </div>

      {premiumArticles.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
          <BookOpen className="mx-auto h-10 w-10 text-gray-300" />
          <p className="mt-3 text-sm font-medium text-gray-600">
            More premium deep-dives coming soon. Check back weekly.
          </p>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {allArticles.map((article) => (
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
            <p className="mt-1 text-xs text-gray-500 line-clamp-3">
              {article.excerpt}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-gray-400">
                {article.publishedAt.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600">
                Read Full Analysis
                <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
