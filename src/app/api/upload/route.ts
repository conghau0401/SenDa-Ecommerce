import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { saveImage, UploadError } from "@/lib/uploads";

export const runtime = "nodejs";

const MAX_FILES = 10;

/** POST multipart/form-data, field "files" (1..10 ảnh) -> { files: [{ url, width, height }] } */
export async function POST(req: Request) {
  if (!(await getCurrentAdmin())) {
    return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Dữ liệu upload không hợp lệ" }, { status: 400 });
  }

  const files = form.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) return NextResponse.json({ error: "Chưa chọn ảnh" }, { status: 400 });
  if (files.length > MAX_FILES) return NextResponse.json({ error: `Tối đa ${MAX_FILES} ảnh mỗi lần` }, { status: 400 });

  try {
    const saved = [];
    for (const file of files) saved.push(await saveImage(Buffer.from(await file.arrayBuffer())));
    return NextResponse.json({ files: saved });
  } catch (err) {
    if (err instanceof UploadError) return NextResponse.json({ error: err.message }, { status: 400 });
    console.error("upload", err);
    return NextResponse.json({ error: "Không thể lưu ảnh" }, { status: 500 });
  }
}
