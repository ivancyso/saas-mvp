import type { MetadataRoute } from "next";
import { db } from "@/db";
import { articles, categories } from "@/db/schema";
import { isNotNull, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://ideaflow.io";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const publishedArticles = await db
    .select({ slug: articles.slug, updatedAt: articles.updatedAt })
    .from(articles)
    .where(isNotNull(articles.publishedAt))
    .orderBy(desc(articles.publishedAt));

  const allCategories = await db
    .select({ slug: categories.slug })
    .from(categories);

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/ideas`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...allCategories.map((cat) => ({
      url: `${BASE_URL}/category/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...publishedArticles.map((article) => ({
      url: `${BASE_URL}/ideas/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
