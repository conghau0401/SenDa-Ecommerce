"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { revalidateStore } from "@/lib/revalidate";
import { uniqueSlug } from "@/lib/unique-slug";
import { postSchema, type PostInput } from "@/lib/validators/admin";
import { fieldErrors, type ActionResult } from "@/lib/validators/common";

/** datetime-local (giờ VN, "2026-10-03T14:30") -> Date */
function parseVnDateTime(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value)) return null;
  const t = Date.parse(`${value.slice(0, 16)}:00+07:00`);
  return Number.isNaN(t) ? null : new Date(t);
}

export async function savePost(id: number | null, input: PostInput): Promise<ActionResult<{ id: number }>> {
  await requireAdmin();
  const parsed = postSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Vui lòng kiểm tra lại", errors: fieldErrors(parsed.error) };
  const d = parsed.data;

  const slug = await uniqueSlug(d.slug, d.title, async (s) =>
    !!(await prisma.post.findFirst({ where: { slug: s, ...(id ? { id: { not: id } } : {}) }, select: { id: true } })),
  );

  // Ngày đăng: lấy theo người nhập; nếu đăng mà chưa có ngày -> giữ ngày cũ hoặc lấy hiện tại
  let publishedAt = d.publishedAt ? parseVnDateTime(d.publishedAt) : null;
  if (d.status === "PUBLISHED" && !publishedAt) {
    const existing = id ? await prisma.post.findUnique({ where: { id }, select: { publishedAt: true } }) : null;
    publishedAt = existing?.publishedAt ?? new Date();
  }

  const data = {
    title: d.title,
    slug,
    excerpt: d.excerpt || null,
    content: d.content,
    coverImage: d.coverImage || null,
    status: d.status,
    publishedAt,
    metaTitle: d.metaTitle || null,
    metaDescription: d.metaDescription || null,
  };

  try {
    const saved = id
      ? await prisma.post.update({ where: { id }, data, select: { id: true } })
      : await prisma.post.create({ data, select: { id: true } });
    revalidateStore();
    return { ok: true, data: saved, message: d.status === "PUBLISHED" ? "Đã lưu & đăng bài" : "Đã lưu bản nháp" };
  } catch (err) {
    console.error("savePost", err);
    return { ok: false, message: "Không thể lưu bài viết" };
  }
}

export async function deletePost(id: number): Promise<ActionResult> {
  await requireAdmin();
  try {
    await prisma.post.delete({ where: { id } });
  } catch {
    return { ok: false, message: "Không thể xóa bài viết" };
  }
  revalidateStore();
  return { ok: true, message: "Đã xóa bài viết" };
}
