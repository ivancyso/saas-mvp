import Link from "next/link";
import { Lock, Search } from "lucide-react";
import { searchArticles } from "@/lib/search";
import type { Metadata } from "next";

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search: ${q}` : "Search startup ideas",
    description: "Search across 50+ deeply researched startup ideas.",
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const results = query ? searchArticles(query) : [];

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
              href="/pricing"
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

      <main className="mx-auto max-w-3xl px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Search startup ideas
        </h1>

        {/* Search form */}
        <form method="GET" action="/search">
          <div className="flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-3 focus-within:border-gray-900 focus-within:ring-1 focus-within:ring-gray-900 transition-all">
            <Search className="h-5 w-5 shrink-0 text-gray-400" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search startup ideas..."
              autoFocus
              className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none"
            />
          </div>
        </form>

        {/* Results */}
        {query && (
          <div className="mt-8">
            <p className="mb-6 text-sm text-gray-500">
              {results.length === 0
                ? null
                : `${results.length} result${results.length === 1 ? "" : "s"} for "${query}"`}
            </p>

            {results.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-gray-50 px-6 py-10 text-center">
                <p className="text-gray-700 font-medium">
                  No ideas found for &quot;{query}&quot; — try the{" "}
                  <Link
                    href="/tools/idea-finder"
                    className="text-blue-600 hover:underline"
                  >
                    Idea Finder
                  </Link>{" "}
                  instead
                </p>
              </div>
            ) : (
              <ul className="space-y-4">
                {results.map((article) => (
                  <li key={article.slug}>
                    <Link
                      href={`/ideas/${article.slug}`}
                      className="block rounded-xl border border-gray-200 p-5 hover:border-gray-400 hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <h2 className="text-base font-semibold text-gray-900 leading-snug">
                            {article.title}
                          </h2>
                          <p className="mt-1.5 text-sm text-gray-600 line-clamp-2">
                            {article.excerpt}
                          </p>
                        </div>
                        {article.isPremium && (
                          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                        )}
                      </div>
                      <div className="mt-3">
                        <span className="inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                          {article.category}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
