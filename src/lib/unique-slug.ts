import "server-only";
import { slugify } from "./slug";

/**
 * Tạo slug duy nhất: dùng slug người nhập (hoặc sinh từ tên), thêm -2, -3... nếu trùng.
 * `exists(slug)` trả true nếu slug đã được bản ghi KHÁC sử dụng.
 */
export async function uniqueSlug(input: string, fallbackSource: string, exists: (slug: string) => Promise<boolean>) {
  const base = slugify(input || fallbackSource).slice(0, 100) || "muc";
  let slug = base;
  for (let i = 2; await exists(slug); i++) slug = `${base}-${i}`;
  return slug;
}
