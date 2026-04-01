import Fuse from "fuse.js";
import { getAllArticles } from "./mdx";

export interface SearchRecord {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  isPremium: boolean;
}

export function buildSearchIndex(): SearchRecord[] {
  const articles = getAllArticles();
  return articles.map((a) => ({
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt,
    category: a.categoryName,
    isPremium: a.isPremium,
  }));
}

export function searchArticles(query: string): SearchRecord[] {
  if (!query.trim()) return [];

  const records = buildSearchIndex();
  const fuse = new Fuse(records, {
    keys: ["title", "excerpt", "category"],
    threshold: 0.4,
    includeScore: true,
  });

  return fuse.search(query).map((r) => r.item);
}
