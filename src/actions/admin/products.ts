"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { revalidateStore } from "@/lib/revalidate";
import { uniqueSlug } from "@/lib/unique-slug";
import { productDerivedFields } from "@/lib/product-utils";
import { PRODUCT_FLAGS, productSchema, type ProductFlag, type ProductInput } from "@/lib/validators/admin";
import { fieldErrors, type ActionResult } from "@/lib/validators/common";

export async function toggleProductFlag(id: number, flag: ProductFlag, value: boolean): Promise<ActionResult> {
  await requireAdmin();
  if (!PRODUCT_FLAGS.includes(flag)) return { ok: false, message: "Thuộc tính không hợp lệ" };
  try {
    await prisma.product.update({ where: { id }, data: { [flag]: value } });
  } catch {
    return { ok: false, message: "Không tìm thấy sản phẩm" };
  }
  revalidateStore();
  return { ok: true };
}

export async function saveProduct(id: number | null, input: ProductInput): Promise<ActionResult<{ id: number }>> {
  await requireAdmin();
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Vui lòng kiểm tra lại các trường", errors: fieldErrors(parsed.error) };
  const d = parsed.data;

  if (d.categoryId && !(await prisma.category.findUnique({ where: { id: d.categoryId }, select: { id: true } }))) {
    return { ok: false, message: "Danh mục không tồn tại", errors: { categoryId: "Danh mục không tồn tại" } };
  }

  const slug = await uniqueSlug(d.slug, d.name, async (s) =>
    !!(await prisma.product.findFirst({ where: { slug: s, ...(id ? { id: { not: id } } : {}) }, select: { id: true } })),
  );

  const data = {
    name: d.name,
    slug,
    sku: d.sku || null,
    categoryId: d.categoryId,
    price: d.price,
    salePrice: d.salePrice,
    stock: d.stock,
    sortOrder: d.sortOrder,
    shortDesc: d.shortDesc || null,
    description: d.description,
    careGuide: d.careGuide,
    isActive: d.isActive,
    showOnHome: d.showOnHome,
    isFeatured: d.isFeatured,
    isNew: d.isNew,
    metaTitle: d.metaTitle || null,
    metaDescription: d.metaDescription || null,
    ...productDerivedFields({ name: d.name, sku: d.sku, price: d.price, salePrice: d.salePrice }),
  };
  const images = d.images.map((img, i) => ({ url: img.url, alt: img.alt || null, sortOrder: i }));

  try {
    const saved = await prisma.$transaction(async (tx) => {
      if (id) {
        await tx.productImage.deleteMany({ where: { productId: id } });
        return tx.product.update({ where: { id }, data: { ...data, images: { create: images } }, select: { id: true } });
      }
      return tx.product.create({ data: { ...data, images: { create: images } }, select: { id: true } });
    });
    revalidateStore();
    return { ok: true, data: { id: saved.id }, message: id ? "Đã lưu sản phẩm" : "Đã tạo sản phẩm" };
  } catch (err) {
    console.error("saveProduct", err);
    return { ok: false, message: "Không thể lưu sản phẩm" };
  }
}

export async function deleteProduct(id: number): Promise<ActionResult> {
  await requireAdmin();
  try {
    // Đơn hàng cũ vẫn giữ snapshot tên/giá/ảnh (OrderItem.productId -> null)
    await prisma.product.delete({ where: { id } });
  } catch {
    return { ok: false, message: "Không thể xóa sản phẩm" };
  }
  revalidateStore();
  return { ok: true, message: "Đã xóa sản phẩm" };
}
