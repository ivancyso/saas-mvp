import {
  getAllArticles,
  getArticleBySlug as getArticleBySlugMdx,
  getAllCategories as getAllCategoriesMdx,
  getArticlesByCategory as getArticlesByCategoryMdx,
} from "./mdx";

export async function getPublishedArticles() {
  return getAllArticles();
}

export async function getArticleBySlug(slug: string) {
  return getArticleBySlugMdx(slug);
}

export async function getArticlesByCategory(categorySlug: string) {
  return getArticlesByCategoryMdx(categorySlug);
}

export async function getAllCategories() {
  return getAllCategoriesMdx();
}
