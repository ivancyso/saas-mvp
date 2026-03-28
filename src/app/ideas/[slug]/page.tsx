import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getArticleBySlug } from "@/lib/articles";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { Lock } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: "Article Not Found | IdeaFlow" };
  }

  return {
    title: `${article.title} | IdeaFlow`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt?.toISOString(),
      authors: [article.authorName],
      ...(article.coverImage ? { images: [article.coverImage] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      ...(article.coverImage ? { images: [article.coverImage] } : {}),
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const hasAccess = !article.isPremium;

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
              href="/#pricing"
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
            >
              Subscribe
            </Link>
          </div>
        </div>
      </nav>

      <article className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8">
          <Link
            href="/ideas"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            &larr; Back to all ideas
          </Link>
        </div>

        <header>
          <div className="flex items-center gap-3 mb-4">
            {article.categoryName && (
              <Link
                href={`/category/${article.categorySlug}`}
                className="text-sm font-medium uppercase tracking-wide text-blue-600 hover:text-blue-700"
              >
                {article.categoryName}
              </Link>
            )}
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

          <div className="mt-6 flex items-center gap-4 text-sm text-gray-500 border-b border-gray-100 pb-8">
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
            <MDXRemote source={article.content} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
          </div>
        ) : (
          <div className="mt-10">
            <div
              className="prose prose-lg prose-gray max-w-none relative overflow-hidden"
              style={{ maxHeight: "400px" }}
            >
              <MDXRemote source={article.content.slice(0, 600)} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
            </div>
            <div className="relative -mt-24 pt-24 bg-gradient-to-t from-white via-white/95 to-transparent">
              <div className="rounded-xl border-2 border-gray-200 bg-gray-50 p-8 text-center">
                <Lock className="mx-auto h-8 w-8 text-gray-400" />
                <h3 className="mt-4 text-xl font-semibold text-gray-900">
                  This is a Pro article
                </h3>
                <p className="mt-2 text-gray-600">
                  Subscribe to read the full research. Get access to all startup ideas for $29/month.
                </p>
                <div className="mt-6 flex items-center justify-center gap-3">
                  <Link
                    href="/auth/signup"
                    className="rounded-lg bg-gray-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
                  >
                    Subscribe to read full article
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
