"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { deleteCategory, saveCategory, toggleCategoryActive } from "@/actions/admin/categories";
import { slugify } from "@/lib/slug";
import { useDialog } from "@/hooks/use-dialog";
import { Button } from "../ui/button";
import { FormField, fieldAria, inputClass } from "../ui/form-field";
import { EmptyState } from "../ui/empty-state";
import { ToggleSwitch } from "./toggle-switch";
import { ConfirmButton } from "./confirm-button";
import { ImageUpload } from "./image-upload";
import { tableCls } from "./ui";

export type CategoryRow = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
  sortOrder: number;
  productCount: number;
};

type FormState = { name: string; slug: string; description: string; image: string; isActive: boolean; sortOrder: string };

function CategoryDialog({ editing, onClose }: { editing: CategoryRow | "new"; onClose: () => void }) {
  const router = useRouter();
  const isNew = editing === "new";
  const [v, setV] = useState<FormState>(
    isNew
      ? { name: "", slug: "", description: "", image: "", isActive: true, sortOrder: "0" }
      : {
          name: editing.name,
          slug: editing.slug,
          description: editing.description ?? "",
          image: editing.image ?? "",
          isActive: editing.isActive,
          sortOrder: String(editing.sortOrder),
        },
  );
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();
  const ref = useDialog<HTMLDivElement>(true, () => !pending && onClose());

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await saveCategory(isNew ? null : editing.id, { ...v, sortOrder: Number(v.sortOrder) || 0 }).catch(() => ({
        ok: false as const,
        message: "Mất kết nối",
      }));
      if (res.ok) {
        toast.success(res.message ?? "Đã lưu");
        router.refresh();
        onClose();
      } else {
        toast.error(res.message);
        if ("errors" in res && res.errors) setErrors(res.errors);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <motion.div className="absolute inset-0 cursor-pointer bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cat-dialog-title"
        className="relative max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-surface shadow-lift sm:rounded-2xl"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 id="cat-dialog-title" className="font-semibold text-leaf-900">
            {isNew ? "Thêm danh mục" : "Sửa danh mục"}
          </h2>
          <button type="button" onClick={onClose} className="flex size-9 items-center justify-center rounded-full hover:bg-sand" aria-label="Đóng">
            <X className="size-5" />
          </button>
        </div>
        <form onSubmit={submit} noValidate className="space-y-4 p-5">
          <FormField id="c-name" label="Tên danh mục" required error={errors.name}>
            <input
              {...fieldAria("c-name", errors.name)}
              value={v.name}
              data-autofocus
              onChange={(e) => {
                const name = e.target.value;
                setV((s) => ({ ...s, name, slug: slugTouched ? s.slug : slugify(name) }));
              }}
              className={inputClass}
            />
          </FormField>
          <div className="grid grid-cols-[1fr_100px] gap-3">
            <FormField id="c-slug" label="Slug" error={errors.slug} hint={`/danh-muc/${v.slug || "..."}`}>
              <input
                {...fieldAria("c-slug", errors.slug)}
                value={v.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  setV((s) => ({ ...s, slug: slugify(e.target.value) }));
                }}
                className={inputClass}
              />
            </FormField>
            <FormField id="c-sort" label="Thứ tự" error={errors.sortOrder}>
              <input
                {...fieldAria("c-sort", errors.sortOrder)}
                inputMode="numeric"
                value={v.sortOrder}
                onChange={(e) => setV((s) => ({ ...s, sortOrder: e.target.value.replace(/[^\d-]/g, "") }))}
                className={inputClass}
              />
            </FormField>
          </div>
          <FormField id="c-desc" label="Mô tả" error={errors.description}>
            <textarea
              {...fieldAria("c-desc", errors.description)}
              value={v.description}
              onChange={(e) => setV((s) => ({ ...s, description: e.target.value }))}
              rows={2}
              className={inputClass}
            />
          </FormField>
          <div>
            <p className="mb-1.5 text-sm font-medium">Ảnh đại diện</p>
            <ImageUpload value={v.image} onChange={(image) => setV((s) => ({ ...s, image }))} aspect="aspect-[4/3]" className="max-w-xs" />
          </div>
          <ToggleSwitch showLabel label="Hiển thị trên web" checked={v.isActive} onChange={(isActive) => setV((s) => ({ ...s, isActive }))} />
          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <Button variant="ghost" onClick={onClose} disabled={pending}>
              Hủy
            </Button>
            <Button type="submit" loading={pending}>
              {isNew ? "Tạo danh mục" : "Lưu"}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export function CategoryManager({ categories }: { categories: CategoryRow[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<CategoryRow | "new" | null>(null);

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={() => setEditing("new")}>
          <Plus className="size-4" aria-hidden /> Thêm danh mục
        </Button>
      </div>

      {categories.length === 0 ? (
        <EmptyState title="Chưa có danh mục" description="Tạo danh mục đầu tiên để phân loại sản phẩm." />
      ) : (
        <div className={tableCls.wrap}>
          <table className={tableCls.table}>
            <thead>
              <tr>
                <th className={tableCls.th}>Danh mục</th>
                <th className={`${tableCls.th} text-right`}>Sản phẩm</th>
                <th className={`${tableCls.th} text-right`}>Thứ tự</th>
                <th className={`${tableCls.th} text-center`}>Hiển thị</th>
                <th className={tableCls.th}>
                  <span className="sr-only">Thao tác</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className={tableCls.tr}>
                  <td className={tableCls.td}>
                    <div className="flex items-center gap-3">
                      <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-sand">
                        {c.image && <Image src={c.image} alt="" fill sizes="48px" className="object-cover" />}
                      </div>
                      <div className="min-w-0">
                        <button type="button" onClick={() => setEditing(c)} className="font-medium hover:text-leaf-700">
                          {c.name}
                        </button>
                        <p className="text-xs text-muted">/danh-muc/{c.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className={`${tableCls.td} text-right tabular-nums`}>{c.productCount}</td>
                  <td className={`${tableCls.td} text-right text-muted tabular-nums`}>{c.sortOrder}</td>
                  <td className={`${tableCls.td} text-center`}>
                    <ToggleSwitch size="sm" label={`Hiển thị ${c.name}`} checked={c.isActive} action={(val) => toggleCategoryActive(c.id, val)} />
                  </td>
                  <td className={tableCls.td}>
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => setEditing(c)}
                        className="flex size-8 items-center justify-center rounded-lg text-muted hover:bg-leaf-50 hover:text-leaf-700"
                        aria-label={`Sửa ${c.name}`}
                      >
                        <Pencil className="size-4" />
                      </button>
                      <ConfirmButton
                        title={`Xóa danh mục "${c.name}"?`}
                        description={
                          c.productCount > 0
                            ? `${c.productCount} sản phẩm trong danh mục sẽ chuyển thành "Chưa phân loại" (không bị xóa).`
                            : "Danh mục chưa có sản phẩm nào."
                        }
                        action={() => deleteCategory(c.id)}
                        onDone={() => router.refresh()}
                        ariaLabel={`Xóa ${c.name}`}
                        className="flex size-8 items-center justify-center rounded-lg text-muted hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="size-4" />
                      </ConfirmButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>{editing && <CategoryDialog key={editing === "new" ? "new" : editing.id} editing={editing} onClose={() => setEditing(null)} />}</AnimatePresence>
    </>
  );
}
