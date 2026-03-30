import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArticlesByCategory, getAllCategories } from "@/lib/articles";
import { Lock } from "lucide-react";

interface PageProps {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((cat) => ({ category: cat.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  const categories = await getAllCategories();
  const cat = categories.find((c) => c.slug === category);

  if (!cat) {
    return { title: "Category Not Found | IdeaFlow" };
  }

  return {
    title: `Best ${cat.name} Ideas for 2026 | IdeaFlow`,
    description: `Explore the best ${cat.name.toLowerCase()} ideas for 2026 — researched opportunities with market analysis, competitive landscape, and execution playbooks.`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { category } = await params;
  const [articles, categories] = await Promise.all([
    getArticlesByCategory(category),
    getAllCategories(),
  ]);

  const cat = categories.find((c) => c.slug === category);

  if (!cat) {
    notFound();
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
          <span className="text-gray-900 font-medium">{cat.name}</span>
        </nav>

        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Best {cat.name} Ideas for 2026
        </h1>
        <p className="mt-3 text-lg text-gray-600">
          {articles.length} researched {cat.name.toLowerCase()} opportunit{articles.length === 1 ? "y" : "ies"} with market analysis and execution playbooks.
        </p>

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
                  <span className="text-xs font-medium uppercase tracking-wide text-blue-600">
                    {article.categoryName}
                  </span>
                  {article.isPremium && (
                    <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                      <Lock className="h-3.5 w-3.5" />
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
            <p className="text-gray-500">No articles in this category yet. Check back soon.</p>
          </div>
        )}

        <div className="mt-16 border-t border-gray-100 pt-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Browse other categories</h2>
          <div className="flex flex-wrap gap-2">
            {categories
              .filter((c) => c.slug !== category)
              .map((c) => (
                <Link
                  key={c.id}
                  href={`/ideas/category/${c.slug}`}
                  className="rounded-full border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {c.name}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
