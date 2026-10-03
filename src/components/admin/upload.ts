"use client";

export type UploadedImage = { url: string; width: number; height: number };

/** Gửi ảnh lên /api/upload, ném lỗi với thông báo tiếng Việt nếu thất bại */
export async function uploadImages(files: File[]): Promise<UploadedImage[]> {
  const tooBig = files.find((f) => f.size > 5 * 1024 * 1024);
  if (tooBig) throw new Error(`"${tooBig.name}" vượt quá 5MB`);

  const form = new FormData();
  files.forEach((f) => form.append("files", f));
  const res = await fetch("/api/upload", { method: "POST", body: form });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Upload thất bại");
  return data.files as UploadedImage[];
}
