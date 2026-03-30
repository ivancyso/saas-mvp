import Link from "next/link";
import type { Metadata } from "next";
import { getAllCategories, getPublishedArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Browse Ideas by Category | IdeaFlow",
  description:
    "Explore startup ideas organized by category — SaaS, Entrepreneurship, Side Hustles, and more. Each category has deeply researched opportunities with market analysis.",
};

export default async function CategoryIndexPage() {
  const [categories, articles] = await Promise.all([
    getAllCategories(),
    getPublishedArticles(),
  ]);

  const countByCategory = new Map<string, number>();
  for (const article of articles) {
    const count = countByCategory.get(article.categorySlug) ?? 0;
    countByCategory.set(article.categorySlug, count + 1);
  }

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

      <div className="mx-auto max-w-6xl px-6 py-12">
        <nav className="mb-8 flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-700 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/ideas" className="hover:text-gray-700 transition-colors">Ideas</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Categories</span>
        </nav>

        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Browse by Category
        </h1>
        <p className="mt-3 text-lg text-gray-600">
          Explore startup ideas organized by industry and opportunity type.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const count = countByCategory.get(cat.slug) ?? 0;
            return (
              <Link
                key={cat.id}
                href={`/ideas/category/${cat.slug}`}
                className="group rounded-xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {count} idea{count !== 1 ? "s" : ""}
                </p>
                <p className="mt-3 text-sm text-blue-600 font-medium group-hover:underline">
                  Browse ideas &rarr;
                </p>
              </Link>
            );
          })}
        </div>

        {categories.length === 0 && (
          <div className="mt-16 text-center">
            <p className="text-gray-500">No categories yet. Check back soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
