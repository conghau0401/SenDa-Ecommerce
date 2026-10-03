import "server-only";
import { cache } from "react";
import type { Prisma } from "@prisma/client";
import { prisma } from "./prisma";
import { PRODUCTS_PER_PAGE } from "./constants";
import { normalizeSearch } from "./product-utils";
import type { SortParam } from "./listing-params";

/* ------------------------------------------------------------------ */
/* Sản phẩm                                                            */
/* ------------------------------------------------------------------ */

/** Dữ liệu tối thiểu để hiển thị 1 thẻ sản phẩm */
const productCardSelect = {
  id: true,
  slug: true,
  name: true,
  price: true,
  salePrice: true,
  stock: true,
  isNew: true,
  isFeatured: true,
  images: { select: { url: true, alt: true }, orderBy: { sortOrder: "asc" }, take: 2 },
  category: { select: { name: true, slug: true } },
} satisfies Prisma.ProductSelect;

export type ProductCardData = Prisma.ProductGetPayload<{ select: typeof productCardSelect }>;

/** Sản phẩm chỉ hiển thị khi đang bật và danh mục (nếu có) cũng đang bật */
const visibleProduct: Prisma.ProductWhereInput = {
  isActive: true,
  OR: [{ categoryId: null }, { category: { isActive: true } }],
};

const SORT_ORDER: Record<SortParam, Prisma.ProductOrderByWithRelationInput[]> = {
  "noi-bat": [{ isFeatured: "desc" }, { sortOrder: "asc" }, { id: "desc" }],
  "moi-nhat": [{ createdAt: "desc" }, { id: "desc" }],
  "gia-tang": [{ finalPrice: "asc" }, { id: "desc" }],
  "gia-giam": [{ finalPrice: "desc" }, { id: "desc" }],
};

export type ProductFilters = {
  q?: string;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: SortParam;
  page?: number;
};

export async function getProducts(filters: ProductFilters) {
  const page = Math.max(1, filters.page ?? 1);
  const and: Prisma.ProductWhereInput[] = [visibleProduct];

  const q = filters.q ? normalizeSearch(filters.q) : "";
  if (q) {
    // searchText đã bỏ dấu + chữ thường -> "sen da" khớp "Sen Đá"; mỗi từ phải xuất hiện
    for (const word of q.split(" ")) and.push({ searchText: { contains: word } });
  }
  if (filters.categorySlug) and.push({ category: { slug: filters.categorySlug } });
  if (filters.minPrice != null) and.push({ finalPrice: { gte: filters.minPrice } });
  if (filters.maxPrice != null) and.push({ finalPrice: { lte: filters.maxPrice } });

  const where: Prisma.ProductWhereInput = { AND: and };
  const orderBy = SORT_ORDER[filters.sort ?? "noi-bat"];

  const [total, items] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * PRODUCTS_PER_PAGE,
      take: PRODUCTS_PER_PAGE,
      select: productCardSelect,
    }),
  ]);

  return { items, total, page, totalPages: Math.max(1, Math.ceil(total / PRODUCTS_PER_PAGE)) };
}

export const getProductBySlug = cache(async (slug: string) => {
  return prisma.product.findFirst({
    where: { AND: [visibleProduct, { slug }] },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      category: { select: { id: true, name: true, slug: true } },
    },
  });
});

export async function getRelatedProducts(productId: number, categoryId: number | null, take = 4) {
  const sameCategory = categoryId
    ? await prisma.product.findMany({
        where: { AND: [visibleProduct, { categoryId, id: { not: productId } }] },
        orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }],
        take,
        select: productCardSelect,
      })
    : [];
  if (sameCategory.length >= take) return sameCategory;

  const filler = await prisma.product.findMany({
    where: { AND: [visibleProduct, { id: { notIn: [productId, ...sameCategory.map((p) => p.id)] } }] },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    take: take - sameCategory.length,
    select: productCardSelect,
  });
  return [...sameCategory, ...filler];
}

export async function getHomeProducts() {
  const [featured, latest] = await Promise.all([
    prisma.product.findMany({
      where: { AND: [visibleProduct, { showOnHome: true }] },
      orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }],
      take: 8,
      select: productCardSelect,
    }),
    prisma.product.findMany({
      where: visibleProduct,
      orderBy: [{ isNew: "desc" }, { createdAt: "desc" }],
      take: 8,
      select: productCardSelect,
    }),
  ]);
  return { featured, latest };
}

/* ------------------------------------------------------------------ */
/* Danh mục                                                            */
/* ------------------------------------------------------------------ */

export const getActiveCategories = cache(async () => {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      image: true,
      description: true,
      _count: { select: { products: { where: { isActive: true } } } },
    },
  });
});

export const getCategoryBySlug = cache(async (slug: string) => {
  return prisma.category.findFirst({ where: { slug, isActive: true } });
});

/* ------------------------------------------------------------------ */
/* Bài viết                                                            */
/* ------------------------------------------------------------------ */

/** Tính lại mỗi lần gọi để không dùng mốc thời gian cũ */
const publishedPost = (): Prisma.PostWhereInput => ({ status: "PUBLISHED", publishedAt: { lte: new Date() } });

const postCardSelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  coverImage: true,
  publishedAt: true,
} satisfies Prisma.PostSelect;

export type PostCardData = Prisma.PostGetPayload<{ select: typeof postCardSelect }>;

export const POSTS_PER_PAGE = 9;

export async function getPosts(page = 1) {
  const where = publishedPost();
  const [total, items] = await Promise.all([
    prisma.post.count({ where }),
    prisma.post.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      skip: (Math.max(1, page) - 1) * POSTS_PER_PAGE,
      take: POSTS_PER_PAGE,
      select: postCardSelect,
    }),
  ]);
  return { items, total, page, totalPages: Math.max(1, Math.ceil(total / POSTS_PER_PAGE)) };
}

export async function getLatestPosts(take = 3, excludeId?: number) {
  return prisma.post.findMany({
    where: { ...publishedPost(), ...(excludeId ? { id: { not: excludeId } } : {}) },
    orderBy: { publishedAt: "desc" },
    take,
    select: postCardSelect,
  });
}

export const getPostBySlug = cache(async (slug: string) => {
  return prisma.post.findFirst({ where: { ...publishedPost(), slug } });
});
