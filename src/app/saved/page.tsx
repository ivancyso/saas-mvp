import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedArticles } from "@/lib/articles";
import { SavedArticlesView } from "@/components/saved-articles-view";
import { SavedNavLink } from "@/components/saved-nav-link";

export const metadata: Metadata = {
  title: "Saved Articles | IdeaFlow",
  description: "Your bookmarked startup ideas.",
};

export default async function SavedPage() {
  const articles = await getPublishedArticles();

  const serialized = articles.map((a) => ({
    id: a.id,
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    categoryName: a.categoryName,
    isPremium: a.isPremium,
    authorName: a.authorName,
    publishedAt: a.publishedAt ? a.publishedAt.toISOString() : null,
    coverImage: a.coverImage,
  }));

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
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
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

      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Saved Articles
        </h1>
        <p className="mt-3 text-lg text-gray-600">
          Your bookmarked startup ideas.
        </p>

        <SavedArticlesView articles={serialized} />
      </div>
    </div>
  );
}
