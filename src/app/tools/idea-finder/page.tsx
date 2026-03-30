import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticles } from "@/lib/mdx";
import { IdeaFinderClient } from "./idea-finder-client";

export const metadata: Metadata = {
  title: "Startup Idea Finder — Free Interactive Quiz",
  description:
    "Answer 3 quick questions about your skills, goals, and budget. Get personalized startup ideas matched to your profile.",
};

export default function IdeaFinderPage() {
  const allArticles = getAllArticles();

  const articles = allArticles.map((a) => ({
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    categoryName: a.categoryName,
    isPremium: a.isPremium,
    tags: a.tags,
  }));

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
              className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
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
              href="/#pricing"
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
            >
              Subscribe
            </Link>
          </div>
        </div>
      </nav>

      <IdeaFinderClient articles={articles} />

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 mt-8">
        <div className="mx-auto max-w-6xl px-6 flex items-center justify-between text-sm text-gray-500">
          <span>&copy; {new Date().getFullYear()} IdeaFlow. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/ideas" className="hover:text-gray-700 transition-colors">
              Ideas
            </Link>
            <Link href="/tools/idea-finder" className="hover:text-gray-700 transition-colors">
              Free Tools
            </Link>
            <Link href="/#pricing" className="hover:text-gray-700 transition-colors">
              Pricing
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
