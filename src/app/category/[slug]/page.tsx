import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArticlesByCategory, getAllCategories } from "@/lib/articles";
import { Lock } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getAllCategories();
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    return { title: "Category Not Found | IdeaFlow" };
  }

  return {
    title: `${category.name} Startup Ideas | IdeaFlow`,
    description:
      category.description ??
      `Browse startup ideas in ${category.name}. Researched opportunities with market analysis.`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const [articles, categories] = await Promise.all([
    getArticlesByCategory(slug),
    getAllCategories(),
  ]);

  const category = categories.find((c) => c.slug === slug);
  if (!category) {
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
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Ideas
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
        <div className="mb-6">
          <Link
            href="/ideas"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            &larr; All ideas
          </Link>
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          {category.name}
        </h1>
        {category.description && (
          <p className="mt-3 text-lg text-gray-600">{category.description}</p>
        )}

        <div className="mt-8 flex flex-wrap gap-2">
          <Link
            href="/ideas"
            className="rounded-full border border-gray-300 px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            All
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                cat.slug === slug
                  ? "bg-gray-900 text-white"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/ideas/${article.slug}`}
              className="group rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center gap-2">
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
            <p className="text-gray-500">
              No articles in this category yet. Check back soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
