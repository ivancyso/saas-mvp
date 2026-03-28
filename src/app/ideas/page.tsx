import Link from "next/link";
import type { Metadata } from "next";
import { getPublishedArticles, getAllCategories } from "@/lib/articles";
import { Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "Startup Ideas | IdeaFlow",
  description:
    "Browse researched startup ideas with market analysis, competitive landscape, and execution playbooks.",
};

export default async function IdeasPage() {
  const [articles, categories] = await Promise.all([
    getPublishedArticles(),
    getAllCategories(),
  ]);

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
              className="text-sm font-medium text-gray-900"
            >
              Ideas
            </Link>
            <Link
              href="/auth/signin"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sign in
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

      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Startup Ideas
        </h1>
        <p className="mt-3 text-lg text-gray-600">
          Researched opportunities with market analysis and execution playbooks.
        </p>

        {categories.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            <Link
              href="/ideas"
              className="rounded-full bg-gray-900 px-4 py-1.5 text-sm font-medium text-white"
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="rounded-full border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        )}

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/ideas/${article.slug}`}
              className="group rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {article.coverImage && (
                <div className="aspect-[16/9] bg-gray-100 overflow-hidden">
                  <img
                    src={article.coverImage}
                    alt={article.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center gap-2">
                  {article.categoryName && (
                    <span className="text-xs font-medium uppercase tracking-wide text-blue-600">
                      {article.categoryName}
                    </span>
                  )}
                  {article.isPremium && (
                    <span className="flex items-center gap-1 text-xs font-medium text-amber-600">
                      <Lock className="h-3 w-3" />
                      Pro
                    </span>
                  )}
                </div>
                <h2 className="mt-2 text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {article.title}
                </h2>
                <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                  {article.excerpt}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                  <span>{article.authorName}</span>
                  {article.publishedAt && (
                    <time dateTime={article.publishedAt.toISOString()}>
                      {article.publishedAt.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {articles.length === 0 && (
          <div className="mt-16 text-center">
            <p className="text-gray-500">No articles published yet. Check back soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
