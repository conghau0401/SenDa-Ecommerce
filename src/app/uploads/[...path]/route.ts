import fs from "node:fs/promises";
import path from "node:path";
import { resolveUploadPath } from "@/lib/uploads";

export const runtime = "nodejs";

const MIME: Record<string, string> = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".avif": "image/avif",
};

/**
 * Khi chạy production (`next start`), Next chỉ phục vụ file trong /public có sẵn lúc build.
 * Route này phục vụ ảnh admin upload sau khi build. File có sẵn lúc build vẫn do Next phục vụ trực tiếp.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const file = resolveUploadPath((await params).path);
  const type = file ? MIME[path.extname(file).toLowerCase()] : undefined;
  if (!file || !type) return new Response("Not found", { status: 404 });

  try {
    const data = await fs.readFile(file);
    return new Response(new Uint8Array(data), {
      headers: {
        "Content-Type": type,
        // Tên file ngẫu nhiên, không bao giờ ghi đè -> cache lâu dài
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
