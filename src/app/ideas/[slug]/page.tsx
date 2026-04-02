import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { getArticleBySlug, getArticlesByCategory, getPublishedArticles } from "@/lib/articles";
import { getUserSubscription, isProSubscriber } from "@/lib/subscription";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { Lock } from "lucide-react";
import { ShareButtons } from "@/components/share-buttons";
import { BookmarkButton } from "@/components/bookmark-button";
import { SavedNavLink } from "@/components/saved-nav-link";
import { ReadingProgress } from "@/components/reading-progress";
import { TableOfContents } from "@/components/table-of-contents";

function calcReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

function extractToc(content: string): TocItem[] {
  const lines = content.split("\n");
  const items: TocItem[] = [];
  for (const line of lines) {
    const h2 = line.match(/^## (.+)$/);
    const h3 = line.match(/^### (.+)$/);
    const match = h2 ?? h3;
    if (!match) continue;
    const text = match[1].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    items.push({ id, text, level: h2 ? 2 : 3 });
  }
  return items;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

function truncateDescription(text: string, maxLen = 160): string {
  if (text.length <= maxLen) return text;
  const truncated = text.slice(0, maxLen - 1);
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > 100 ? truncated.slice(0, lastSpace) : truncated) + "…";
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: "Article Not Found | IdeaFlow" };
  }

  const description = truncateDescription(article.excerpt);

  return {
    title: `${article.title} | IdeaFlow`,
    description,
    openGraph: {
      title: article.title,
      description,
      type: "article",
      url: `/ideas/${slug}`,
      siteName: "IdeaFlow",
      publishedTime: article.publishedAt?.toISOString(),
      authors: [article.authorName],
      images: [
        `/api/og?title=${encodeURIComponent(article.title)}&excerpt=${encodeURIComponent(article.excerpt)}`,
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      images: [
        `/api/og?title=${encodeURIComponent(article.title)}&excerpt=${encodeURIComponent(article.excerpt)}`,
      ],
    },
  };
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ideaflow.app";

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const readingTime = calcReadingTime(article.content);
  const tocItems = extractToc(article.content);

  const sameCategoryArticles = article.categorySlug
    ? (await getArticlesByCategory(article.categorySlug))
        .filter((a) => a.slug !== slug)
        .sort((a, b) => a.title.localeCompare(b.title))
    : [];
  const relatedArticles = sameCategoryArticles.length >= 3
    ? sameCategoryArticles.slice(0, 3)
    : await (async () => {
        const all = await getPublishedArticles();
        const sameSlugs = new Set(sameCategoryArticles.map((a) => a.slug));
        const others = all.filter((a) => a.slug !== slug && !sameSlugs.has(a.slug));
        return [...sameCategoryArticles, ...others].slice(0, 3);
      })();

  // Server-side subscription check
  let hasAccess = !article.isPremium;
  if (article.isPremium) {
    const { userId } = await auth();
    if (userId) {
      const sub = await getUserSubscription(userId);
      hasAccess = isProSubscriber(sub);
    }
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    author: { "@type": "Person", name: article.authorName },
    datePublished: article.publishedAt?.toISOString(),
    dateModified: article.updatedAt?.toISOString(),
    ...(article.coverImage ? { image: article.coverImage } : {}),
    publisher: {
      "@type": "Organization",
      name: "IdeaFlow",
    },
    isAccessibleForFree: !article.isPremium,
    ...(article.isPremium
      ? {
          hasPart: {
            "@type": "WebPageElement",
            isAccessibleForFree: false,
            cssSelector: ".article-content",
          },
        }
      : {}),
  };

  return (
    <div className="min-h-screen bg-white">
      <ReadingProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

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
              href="/#pricing"
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
            >
              Subscribe
            </Link>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 py-12 lg:flex lg:gap-12 lg:items-start">
      <TableOfContents items={tocItems} />
      <article className="min-w-0 flex-1 max-w-3xl">
        <div className="mb-8">
          <nav className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-700 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/ideas" className="hover:text-gray-700 transition-colors">Ideas</Link>
            {article.categoryName && (
              <>
                <span>/</span>
                <Link
                  href={`/ideas/category/${article.categorySlug}`}
                  className="hover:text-gray-700 transition-colors"
                >
                  {article.categoryName}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-gray-900 font-medium truncate max-w-[200px]">{article.title}</span>
          </nav>
        </div>

        <header>
          <div className="flex items-center gap-3 mb-4">
            {article.isPremium && (
              <span className="flex items-center gap-1 text-sm font-medium text-amber-600">
                <Lock className="h-3.5 w-3.5" />
                Pro
              </span>
            )}
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl leading-tight">
            {article.title}
          </h1>

          <p className="mt-4 text-xl text-gray-600 leading-relaxed">
            {article.excerpt}
          </p>

          <div className="mt-6 flex items-center justify-between gap-4 text-sm text-gray-500 border-b border-gray-100 pb-8">
            <div className="flex items-center gap-4">
              <span>By {article.authorName}</span>
              {article.publishedAt && (
                <time dateTime={article.publishedAt.toISOString()}>
                  {article.publishedAt.toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              )}
              <span>{readingTime} min read</span>
            </div>
            <div className="flex items-center gap-3">
              <BookmarkButton slug={slug} />
              <ShareButtons
                title={article.title}
                url={`${BASE_URL}/ideas/${slug}`}
              />
            </div>
          </div>
        </header>

        {article.coverImage && (
          <div className="mt-8 aspect-[16/9] overflow-hidden rounded-xl">
            <img
              src={article.coverImage}
              alt={article.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {hasAccess ? (
          <div
            className="article-content mt-10 prose prose-lg prose-gray max-w-none
              prose-headings:font-semibold prose-headings:tracking-tight
              prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-xl
              prose-table:border-collapse prose-th:border prose-th:border-gray-300 prose-th:bg-gray-50 prose-th:px-4 prose-th:py-2 prose-td:border prose-td:border-gray-200 prose-td:px-4 prose-td:py-2"
          >
            <MDXRemote source={article.content} options={{ mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] } }} />
          </div>
        ) : (
          <div className="mt-10 relative">
            <div className="prose prose-lg prose-gray max-w-none">
              <MDXRemote
                source={article.content
                  .split(/\n\n+/)
                  .filter((block) => block.trim().length > 0)
                  .slice(0, 3)
                  .join("\n\n")}
                options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
              />
            </div>
            <div
              className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
              style={{
                backdropFilter: "blur(4px)",
                WebkitBackdropFilter: "blur(4px)",
                maskImage: "linear-gradient(to bottom, transparent 0%, black 40%)",
                WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 40%)",
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none" />
            <div className="relative mt-8 flex flex-col items-center text-center py-10">
              <Lock className="h-8 w-8 text-gray-400" />
              <h3 className="mt-4 text-xl font-semibold text-gray-900">
                Continue reading with Pro
              </h3>
              <p className="mt-2 text-gray-600 max-w-sm">
                Get full access to this research and all startup ideas for $29/month.
              </p>
              <div className="mt-6 flex items-center justify-center gap-3">
                <Link
                  href="/sign-up"
                  className="rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
                >
                  Unlock Full Article — $29/mo
                </Link>
                <Link
                  href="/sign-in"
                  className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        )}
        {relatedArticles.length > 0 && (
          <section className="mt-16 border-t border-gray-100 pt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
            <div className="grid gap-6 sm:grid-cols-3">
              {relatedArticles.map((related) => (
                <Link
                  key={related.slug}
                  href={`/ideas/${related.slug}`}
                  className="group block rounded-xl border border-gray-200 p-5 hover:border-gray-300 hover:shadow-sm transition-all"
                >
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {related.title}
                  </h3>
                  {related.excerpt && (
                    <p className="mt-2 text-sm text-gray-500 line-clamp-2">{related.excerpt}</p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
      </div>
    </div>
  );
}
