"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { revalidateStore } from "@/lib/revalidate";
import { uniqueSlug } from "@/lib/unique-slug";
import { categorySchema, type CategoryInput } from "@/lib/validators/admin";
import { fieldErrors, type ActionResult } from "@/lib/validators/common";

export async function saveCategory(id: number | null, input: CategoryInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Vui lòng kiểm tra lại", errors: fieldErrors(parsed.error) };
  const d = parsed.data;

  const slug = await uniqueSlug(d.slug, d.name, async (s) =>
    !!(await prisma.category.findFirst({ where: { slug: s, ...(id ? { id: { not: id } } : {}) }, select: { id: true } })),
  );
  const data = { name: d.name, slug, description: d.description || null, image: d.image || null, isActive: d.isActive, sortOrder: d.sortOrder };

  try {
    if (id) await prisma.category.update({ where: { id }, data });
    else await prisma.category.create({ data });
  } catch (err) {
    console.error("saveCategory", err);
    return { ok: false, message: "Không thể lưu danh mục" };
  }
  revalidateStore();
  return { ok: true, message: id ? "Đã lưu danh mục" : "Đã tạo danh mục" };
}

export async function toggleCategoryActive(id: number, value: boolean): Promise<ActionResult> {
  await requireAdmin();
  try {
    await prisma.category.update({ where: { id }, data: { isActive: value } });
  } catch {
    return { ok: false, message: "Không tìm thấy danh mục" };
  }
  revalidateStore();
  return { ok: true };
}

export async function deleteCategory(id: number): Promise<ActionResult> {
  await requireAdmin();
  try {
    // Sản phẩm thuộc danh mục sẽ chuyển thành "Chưa phân loại" (onDelete: SetNull)
    await prisma.category.delete({ where: { id } });
  } catch {
    return { ok: false, message: "Không thể xóa danh mục" };
  }
  revalidateStore();
  return { ok: true, message: "Đã xóa danh mục" };
}
