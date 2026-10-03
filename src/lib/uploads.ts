import "server-only";
import { randomBytes } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

export const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads");
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const MAX_DIMENSION = 1600;

/** Nhận dạng ảnh qua magic bytes (không tin vào đuôi file / mime do trình duyệt gửi) */
function sniffImage(buf: Buffer): "jpeg" | "png" | "webp" | "gif" | "avif" | null {
  if (buf.length < 12) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpeg";
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return "png";
  if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") return "webp";
  if (buf.toString("ascii", 0, 3) === "GIF") return "gif";
  if (buf.toString("ascii", 4, 12) === "ftypavif") return "avif";
  return null;
}

export class UploadError extends Error {}

/**
 * Lưu ảnh: kiểm tra định dạng + dung lượng, xoay theo EXIF, thu nhỏ tối đa 1600px,
 * chuyển WebP (bỏ metadata). Trả về URL public dạng /uploads/2026/10/abc123.webp
 */
export async function saveImage(buf: Buffer): Promise<{ url: string; width: number; height: number }> {
  if (buf.length > MAX_UPLOAD_BYTES) throw new UploadError("Ảnh vượt quá 5MB");
  if (!sniffImage(buf)) throw new UploadError("Chỉ hỗ trợ ảnh JPG, PNG, WebP, GIF, AVIF");

  const now = new Date();
  const dir = path.join(String(now.getFullYear()), String(now.getMonth() + 1).padStart(2, "0"));
  const name = `${randomBytes(8).toString("hex")}.webp`;
  await fs.mkdir(path.join(UPLOAD_ROOT, dir), { recursive: true });

  let out;
  try {
    out = await sharp(buf, { failOn: "error" })
      .rotate()
      .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(path.join(UPLOAD_ROOT, dir, name));
  } catch {
    throw new UploadError("File ảnh bị lỗi hoặc không đọc được");
  }

  return { url: `/uploads/${dir.split(path.sep).join("/")}/${name}`, width: out.width, height: out.height };
}

/** Đường dẫn file thật cho URL /uploads/... – chặn path traversal */
export function resolveUploadPath(segments: string[]): string | null {
  if (segments.some((s) => !s || s === ".." || s.includes("\\") || s.startsWith("."))) return null;
  const full = path.join(UPLOAD_ROOT, ...segments);
  return full.startsWith(UPLOAD_ROOT + path.sep) ? full : null;
}
