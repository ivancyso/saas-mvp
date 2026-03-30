"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Lock, Bookmark } from "lucide-react";
import { BookmarkButton } from "./bookmark-button";

const STORAGE_KEY = "ideaflow_saved";

interface ArticleItem {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  categoryName: string;
  isPremium: boolean;
  authorName: string;
  publishedAt: string | null;
  coverImage: string | null;
}

interface SavedArticlesViewProps {
  articles: ArticleItem[];
}

export function SavedArticlesView({ articles }: SavedArticlesViewProps) {
  const [savedSlugs, setSavedSlugs] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    function load() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        setSavedSlugs(raw ? (JSON.parse(raw) as string[]) : []);
      } catch {
        setSavedSlugs([]);
      }
    }

    setMounted(true);
    load();

    window.addEventListener("ideaflow_saved_updated", load);
    return () => window.removeEventListener("ideaflow_saved_updated", load);
  }, []);

  if (!mounted) {
    return (
      <div className="mt-16 text-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  const saved = articles.filter((a) => savedSlugs.includes(a.slug));

  if (saved.length === 0) {
    return (
      <div className="mt-16 text-center">
        <Bookmark className="mx-auto h-12 w-12 text-gray-200" />
        <h2 className="mt-4 text-xl font-semibold text-gray-900">
          No saved articles yet
        </h2>
        <p className="mt-2 text-gray-500">
          Bookmark articles to read them later.
        </p>
        <Link
          href="/ideas"
          className="mt-6 inline-block rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
        >
          Browse ideas
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {saved.map((article) => (
        <div
          key={article.id}
          className="relative rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
        >
          <BookmarkButton
            slug={article.slug}
            className="absolute top-3 right-3 z-10"
          />
          <Link href={`/ideas/${article.slug}`} className="group block">
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
                  <time dateTime={article.publishedAt}>
                    {new Date(article.publishedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                )}
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
