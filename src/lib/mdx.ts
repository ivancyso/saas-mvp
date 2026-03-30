import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content", "ideas");

export interface ArticleFrontmatter {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tier: "free" | "pro";
  publishedAt: string;
  author: string;
  tags?: string[];
}

export interface ArticleMeta {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  categoryName: string;
  categorySlug: string;
  isPremium: boolean;
  authorName: string;
  publishedAt: Date;
  coverImage: string | null;
  tags: string[];
}

export interface ArticleFull extends ArticleMeta {
  content: string;
  updatedAt: Date;
}

function slugifyCategory(category: string): string {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getMdxFiles(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) {
    return [];
  }
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".mdx"));
}

function parseArticleFile(
  filename: string
): { meta: ArticleMeta; content: string } | null {
  const filePath = path.join(CONTENT_DIR, filename);
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  const frontmatter = data as ArticleFrontmatter;

  if (!frontmatter.title || !frontmatter.slug || !frontmatter.publishedAt) {
    return null;
  }

  const meta: ArticleMeta = {
    id: frontmatter.slug,
    title: frontmatter.title,
    slug: frontmatter.slug,
    excerpt: frontmatter.excerpt ?? "",
    categoryName: frontmatter.category ?? "",
    categorySlug: slugifyCategory(frontmatter.category ?? ""),
    isPremium: frontmatter.tier === "pro",
    authorName: frontmatter.author ?? "Editorial Team",
    publishedAt: new Date(frontmatter.publishedAt),
    coverImage: null,
    tags: frontmatter.tags ?? [],
  };

  return { meta, content };
}

export function getAllArticles(): ReadonlyArray<ArticleMeta> {
  const files = getMdxFiles();
  const articles: ArticleMeta[] = [];

  for (const file of files) {
    const parsed = parseArticleFile(file);
    if (parsed) {
      articles.push(parsed.meta);
    }
  }

  return articles.sort(
    (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
  );
}

export function getArticleBySlug(slug: string): ArticleFull | null {
  const files = getMdxFiles();

  for (const file of files) {
    const parsed = parseArticleFile(file);
    if (parsed && parsed.meta.slug === slug) {
      return {
        ...parsed.meta,
        content: parsed.content,
        updatedAt: parsed.meta.publishedAt,
      };
    }
  }

  return null;
}

export function getAllCategories(): ReadonlyArray<{
  id: string;
  name: string;
  slug: string;
  description: string | null;
}> {
  const articles = getAllArticles();
  const categoryMap = new Map<
    string,
    { id: string; name: string; slug: string; description: string | null }
  >();

  for (const article of articles) {
    if (article.categoryName && !categoryMap.has(article.categorySlug)) {
      categoryMap.set(article.categorySlug, {
        id: article.categorySlug,
        name: article.categoryName,
        slug: article.categorySlug,
        description: null,
      });
    }
  }

  return Array.from(categoryMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}

export function getArticlesByCategory(
  categorySlug: string
): ReadonlyArray<ArticleMeta> {
  return getAllArticles().filter(
    (article) => article.categorySlug === categorySlug
  );
}
