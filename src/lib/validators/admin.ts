import { z } from "zod";
import { POST_STATUSES } from "../constants";

const slugSchema = z
  .string()
  .trim()
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug chỉ gồm chữ thường không dấu, số và dấu gạch ngang")
  .or(z.literal(""));

const money = (label: string) =>
  z.coerce
    .number({ invalid_type_error: `${label} phải là số` })
    .int(`${label} phải là số nguyên`)
    .min(0, `${label} không được âm`)
    .max(1_000_000_000, `${label} quá lớn`);

const imagePath = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || v.startsWith("/uploads/") || /^https:\/\//.test(v), "Đường dẫn ảnh không hợp lệ");

export const productSchema = z
  .object({
    name: z.string().trim().min(2, "Tên sản phẩm tối thiểu 2 ký tự").max(150),
    slug: slugSchema,
    sku: z.string().trim().max(50).optional().default(""),
    categoryId: z.coerce.number().int().positive().nullable(),
    price: money("Giá").refine((v) => v > 0, "Giá phải lớn hơn 0"),
    salePrice: money("Giá khuyến mãi").nullable(),
    stock: z.coerce.number().int("Tồn kho phải là số nguyên").min(0, "Tồn kho không được âm").max(100000),
    sortOrder: z.coerce.number().int().min(-100000).max(100000).default(0),
    shortDesc: z.string().trim().max(300).optional().default(""),
    description: z.string().max(100_000).default(""),
    careGuide: z.string().max(100_000).default(""),
    images: z
      .array(z.object({ url: imagePath.refine((v) => v !== "", "Thiếu ảnh"), alt: z.string().trim().max(200).default("") }))
      .max(20, "Tối đa 20 ảnh"),
    isActive: z.boolean(),
    showOnHome: z.boolean(),
    isFeatured: z.boolean(),
    isNew: z.boolean(),
    metaTitle: z.string().trim().max(120).optional().default(""),
    metaDescription: z.string().trim().max(300).optional().default(""),
  })
  .refine((d) => d.salePrice == null || d.salePrice < d.price, {
    path: ["salePrice"],
    message: "Giá khuyến mãi phải nhỏ hơn giá gốc",
  });

export type ProductInput = z.input<typeof productSchema>;

export const PRODUCT_FLAGS = ["isActive", "showOnHome", "isFeatured", "isNew"] as const;
export type ProductFlag = (typeof PRODUCT_FLAGS)[number];

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Tên danh mục tối thiểu 2 ký tự").max(100),
  slug: slugSchema,
  description: z.string().trim().max(500).optional().default(""),
  image: imagePath.optional().default(""),
  isActive: z.boolean(),
  sortOrder: z.coerce.number().int().min(-100000).max(100000).default(0),
});

export type CategoryInput = z.input<typeof categorySchema>;

export const postSchema = z.object({
  title: z.string().trim().min(5, "Tiêu đề tối thiểu 5 ký tự").max(200),
  slug: slugSchema,
  excerpt: z.string().trim().max(500).optional().default(""),
  content: z.string().max(200_000).default(""),
  coverImage: imagePath.optional().default(""),
  status: z.enum(POST_STATUSES),
  publishedAt: z.string().optional().default(""), // ISO datetime-local, để trống = lúc đăng
  metaTitle: z.string().trim().max(120).optional().default(""),
  metaDescription: z.string().trim().max(300).optional().default(""),
});

export type PostInput = z.input<typeof postSchema>;
