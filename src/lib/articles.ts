import { db } from "@/db";
import { articles, categories } from "@/db/schema";
import { eq, desc, isNotNull, and } from "drizzle-orm";

export async function getPublishedArticles() {
  return db
    .select({
      id: articles.id,
      title: articles.title,
      slug: articles.slug,
      excerpt: articles.excerpt,
      coverImage: articles.coverImage,
      categoryId: articles.categoryId,
      categoryName: categories.name,
      categorySlug: categories.slug,
      authorName: articles.authorName,
      isPremium: articles.isPremium,
      publishedAt: articles.publishedAt,
    })
    .from(articles)
    .leftJoin(categories, eq(articles.categoryId, categories.id))
    .where(isNotNull(articles.publishedAt))
    .orderBy(desc(articles.publishedAt));
}

export async function getArticleBySlug(slug: string) {
  const rows = await db
    .select({
      id: articles.id,
      title: articles.title,
      slug: articles.slug,
      excerpt: articles.excerpt,
      content: articles.content,
      coverImage: articles.coverImage,
      categoryId: articles.categoryId,
      categoryName: categories.name,
      categorySlug: categories.slug,
      authorName: articles.authorName,
      isPremium: articles.isPremium,
      publishedAt: articles.publishedAt,
      updatedAt: articles.updatedAt,
    })
    .from(articles)
    .leftJoin(categories, eq(articles.categoryId, categories.id))
    .where(and(eq(articles.slug, slug), isNotNull(articles.publishedAt)))
    .limit(1);

  return rows[0] ?? null;
}

export async function getArticlesByCategory(categorySlug: string) {
  return db
    .select({
      id: articles.id,
      title: articles.title,
      slug: articles.slug,
      excerpt: articles.excerpt,
      coverImage: articles.coverImage,
      authorName: articles.authorName,
      isPremium: articles.isPremium,
      publishedAt: articles.publishedAt,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(articles)
    .innerJoin(categories, eq(articles.categoryId, categories.id))
    .where(and(eq(categories.slug, categorySlug), isNotNull(articles.publishedAt)))
    .orderBy(desc(articles.publishedAt));
}

export async function getAllCategories() {
  return db.select().from(categories).orderBy(categories.name);
}
