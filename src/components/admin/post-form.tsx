"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ExternalLink, Save, Trash2 } from "lucide-react";
import { deletePost, savePost } from "@/actions/admin/posts";
import { slugify } from "@/lib/slug";
import type { PostStatus } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button, buttonClass } from "../ui/button";
import { FormField, fieldAria, inputClass } from "../ui/form-field";
import { Card } from "./ui";
import { ImageUpload } from "./image-upload";
import { RichTextEditor } from "./rich-text-editor";
import { ConfirmButton } from "./confirm-button";

export type PostFormValues = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  status: PostStatus;
  publishedAt: string; // datetime-local theo giờ VN
  metaTitle: string;
  metaDescription: string;
};

export function PostForm({ id, initial }: { id: number | null; initial: PostFormValues }) {
  const router = useRouter();
  const [v, setV] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [slugTouched, setSlugTouched] = useState(!!initial.slug);
  const [pending, startTransition] = useTransition();

  const set = <K extends keyof PostFormValues>(k: K, val: PostFormValues[K]) => setV((s) => ({ ...s, [k]: val }));

  const submit = (status: PostStatus) =>
    startTransition(async () => {
      const res = await savePost(id, { ...v, status }).catch(() => ({ ok: false as const, message: "Mất kết nối" }));
      if (res.ok) {
        toast.success(res.message ?? "Đã lưu");
        setErrors({});
        set("status", status);
        if (!id && res.data) router.replace(`/admin/tin-tuc/${res.data.id}`);
        else router.refresh();
      } else {
        toast.error(res.message);
        if ("errors" in res && res.errors) setErrors(res.errors);
      }
    });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit(v.status);
      }}
      noValidate
      className="grid items-start gap-6 lg:grid-cols-[1fr_320px]"
    >
      <div className="min-w-0 space-y-6">
        <Card>
          <div className="space-y-5">
            <FormField id="post-title" label="Tiêu đề" required error={errors.title}>
              <input
                {...fieldAria("post-title", errors.title)}
                value={v.title}
                onChange={(e) => {
                  set("title", e.target.value);
                  if (!slugTouched) set("slug", slugify(e.target.value));
                }}
                className={cn(inputClass, "text-lg font-semibold")}
              />
            </FormField>
            <FormField id="post-slug" label="Slug" error={errors.slug} hint={`/tin-tuc/${v.slug || "..."}`}>
              <input
                {...fieldAria("post-slug", errors.slug)}
                value={v.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  set("slug", slugify(e.target.value));
                }}
                className={inputClass}
              />
            </FormField>
            <FormField id="post-excerpt" label="Tóm tắt" error={errors.excerpt} hint="Hiển thị ở danh sách bài viết">
              <textarea
                {...fieldAria("post-excerpt", errors.excerpt)}
                value={v.excerpt}
                onChange={(e) => set("excerpt", e.target.value)}
                rows={2}
                maxLength={500}
                className={inputClass}
              />
            </FormField>
          </div>
        </Card>

        <Card title="Nội dung" bodyClassName="p-0">
          <RichTextEditor value={v.content} onChange={(html) => set("content", html)} minHeight={360} placeholder="Viết nội dung bài viết..." />
        </Card>

        <Card title="SEO" description="Để trống để dùng tiêu đề và tóm tắt">
          <div className="space-y-5">
            <FormField id="post-metaTitle" label="Meta title" error={errors.metaTitle}>
              <input {...fieldAria("post-metaTitle", errors.metaTitle)} value={v.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} maxLength={120} className={inputClass} />
            </FormField>
            <FormField id="post-metaDescription" label="Meta description" error={errors.metaDescription}>
              <textarea
                {...fieldAria("post-metaDescription", errors.metaDescription)}
                value={v.metaDescription}
                onChange={(e) => set("metaDescription", e.target.value)}
                rows={2}
                maxLength={300}
                className={inputClass}
              />
            </FormField>
          </div>
        </Card>
      </div>

      <div className="space-y-6 lg:sticky lg:top-6">
        <Card title="Xuất bản">
          <p className="mb-4 text-sm">
            Trạng thái:{" "}
            <span className={cn("font-semibold", v.status === "PUBLISHED" ? "text-leaf-700" : "text-muted")}>
              {v.status === "PUBLISHED" ? "Đã đăng" : "Bản nháp"}
            </span>
          </p>
          <FormField id="post-publishedAt" label="Ngày đăng" hint="Để trống = lúc bấm Đăng. Đặt ngày tương lai để hẹn giờ." error={errors.publishedAt}>
            <input type="datetime-local" id="post-publishedAt" value={v.publishedAt} onChange={(e) => set("publishedAt", e.target.value)} className={inputClass} />
          </FormField>
          <div className="mt-5 flex flex-col gap-2">
            <Button onClick={() => submit("PUBLISHED")} loading={pending}>
              {!pending && <Save className="size-4" aria-hidden />}
              {v.status === "PUBLISHED" ? "Cập nhật bài" : "Đăng bài"}
            </Button>
            <Button variant="outline" onClick={() => submit("DRAFT")} disabled={pending}>
              {v.status === "PUBLISHED" ? "Chuyển về nháp" : "Lưu nháp"}
            </Button>
            {id && initial.status === "PUBLISHED" && (
              <Link href={`/tin-tuc/${initial.slug}`} target="_blank" className="inline-flex items-center justify-center gap-1.5 py-1 text-sm text-leaf-700 hover:underline">
                Xem bài viết <ExternalLink className="size-3.5" aria-hidden />
              </Link>
            )}
          </div>
        </Card>

        <Card title="Ảnh đại diện">
          <ImageUpload value={v.coverImage} onChange={(url) => set("coverImage", url)} aspect="aspect-[16/10]" />
        </Card>

        {id && (
          <ConfirmButton
            title="Xóa bài viết này?"
            description="Bài viết sẽ bị xóa vĩnh viễn."
            action={() => deletePost(id)}
            onDone={() => router.push("/admin/tin-tuc")}
            className={buttonClass({ variant: "ghost", size: "sm", className: "w-full text-red-600 hover:bg-red-50 hover:text-red-700" })}
          >
            <Trash2 className="size-4" aria-hidden /> Xóa bài viết
          </ConfirmButton>
        )}
      </div>
    </form>
  );
}
