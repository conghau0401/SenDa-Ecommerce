"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ExternalLink, Save } from "lucide-react";
import { saveProduct } from "@/actions/admin/products";
import { slugify } from "@/lib/slug";
import { formatVND, discountPercent } from "@/lib/format";
import { Button } from "../ui/button";
import { FormField, fieldAria, inputClass } from "../ui/form-field";
import { Card, selectCls } from "./ui";
import { ToggleSwitch } from "./toggle-switch";
import { ImagesManager, type ManagedImage } from "./images-manager";
import { RichTextEditor } from "./rich-text-editor";

export type ProductFormValues = {
  name: string;
  slug: string;
  sku: string;
  categoryId: string;
  price: string;
  salePrice: string;
  stock: string;
  sortOrder: string;
  shortDesc: string;
  description: string;
  careGuide: string;
  images: ManagedImage[];
  isActive: boolean;
  showOnHome: boolean;
  isFeatured: boolean;
  isNew: boolean;
  metaTitle: string;
  metaDescription: string;
};

const digits = (v: string) => v.replace(/\D/g, "");

export function ProductForm({
  id,
  initial,
  categories,
}: {
  id: number | null;
  initial: ProductFormValues;
  categories: { id: number; name: string }[];
}) {
  const router = useRouter();
  const [v, setV] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [slugTouched, setSlugTouched] = useState(!!initial.slug);
  const [pending, startTransition] = useTransition();

  const set = <K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) => {
    setV((prev) => ({ ...prev, [key]: value }));
    if (errors[key as string]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  const price = Number(v.price) || 0;
  const sale = v.salePrice ? Number(v.salePrice) : null;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await saveProduct(id, {
        name: v.name,
        slug: v.slug,
        sku: v.sku,
        categoryId: v.categoryId ? Number(v.categoryId) : null,
        price: v.price === "" ? Number.NaN : Number(v.price),
        salePrice: v.salePrice === "" ? null : Number(v.salePrice),
        stock: v.stock === "" ? Number.NaN : Number(v.stock),
        sortOrder: Number(v.sortOrder) || 0,
        shortDesc: v.shortDesc,
        description: v.description,
        careGuide: v.careGuide,
        images: v.images.map((i) => ({ url: i.url, alt: i.alt })),
        isActive: v.isActive,
        showOnHome: v.showOnHome,
        isFeatured: v.isFeatured,
        isNew: v.isNew,
        metaTitle: v.metaTitle,
        metaDescription: v.metaDescription,
      }).catch(() => ({ ok: false as const, message: "Mất kết nối" }));

      if (res.ok) {
        toast.success(res.message ?? "Đã lưu");
        setErrors({});
        if (!id && res.data) router.replace(`/admin/san-pham/${res.data.id}`);
        else router.refresh();
      } else {
        toast.error(res.message);
        if ("errors" in res && res.errors) {
          setErrors(res.errors);
          const first = Object.keys(res.errors)[0];
          document.getElementById(`p-${first}`)?.focus();
        }
      }
    });
  };

  return (
    <form onSubmit={submit} noValidate className="grid items-start gap-6 lg:grid-cols-[1fr_340px]">
      <div className="min-w-0 space-y-6">
        <Card title="Thông tin cơ bản">
          <div className="space-y-5">
            <FormField id="p-name" label="Tên sản phẩm" required error={errors.name}>
              <input
                {...fieldAria("p-name", errors.name)}
                value={v.name}
                onChange={(e) => {
                  set("name", e.target.value);
                  if (!slugTouched) set("slug", slugify(e.target.value));
                }}
                className={inputClass}
                placeholder="VD: Sen đá Phật Bà"
              />
            </FormField>
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField id="p-slug" label="Đường dẫn (slug)" error={errors.slug} hint={`/san-pham/${v.slug || "..."}`}>
                <input
                  {...fieldAria("p-slug", errors.slug)}
                  value={v.slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    set("slug", slugify(e.target.value));
                  }}
                  className={inputClass}
                />
              </FormField>
              <FormField id="p-sku" label="Mã SKU" error={errors.sku}>
                <input {...fieldAria("p-sku", errors.sku)} value={v.sku} onChange={(e) => set("sku", e.target.value)} className={inputClass} />
              </FormField>
            </div>
            <FormField id="p-shortDesc" label="Mô tả ngắn" error={errors.shortDesc} hint="Hiển thị dưới giá ở trang chi tiết (tối đa 300 ký tự)">
              <textarea
                {...fieldAria("p-shortDesc", errors.shortDesc)}
                value={v.shortDesc}
                onChange={(e) => set("shortDesc", e.target.value)}
                rows={2}
                maxLength={300}
                className={inputClass}
              />
            </FormField>
          </div>
        </Card>

        <Card title="Hình ảnh" description="Ảnh đầu tiên là ảnh chính hiển thị ở danh sách sản phẩm">
          <ImagesManager images={v.images} onChange={(imgs) => set("images", imgs)} />
          {errors.images && <p className="mt-2 text-sm text-danger">{errors.images}</p>}
        </Card>

        <Card title="Mô tả chi tiết" bodyClassName="p-0">
          <RichTextEditor value={v.description} onChange={(html) => set("description", html)} placeholder="Giới thiệu sản phẩm..." />
        </Card>

        <Card title="Hướng dẫn chăm sóc" bodyClassName="p-0">
          <RichTextEditor
            value={v.careGuide}
            onChange={(html) => set("careGuide", html)}
            placeholder="Ánh sáng, tưới nước, đất trồng..."
            minHeight={160}
          />
        </Card>

        <Card title="SEO" description="Để trống để dùng tên và mô tả ngắn của sản phẩm">
          <div className="space-y-5">
            <FormField id="p-metaTitle" label="Meta title" error={errors.metaTitle} hint={`${v.metaTitle.length}/120`}>
              <input
                {...fieldAria("p-metaTitle", errors.metaTitle)}
                value={v.metaTitle}
                onChange={(e) => set("metaTitle", e.target.value)}
                maxLength={120}
                className={inputClass}
              />
            </FormField>
            <FormField id="p-metaDescription" label="Meta description" error={errors.metaDescription} hint={`${v.metaDescription.length}/300`}>
              <textarea
                {...fieldAria("p-metaDescription", errors.metaDescription)}
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
        <Card title="Hiển thị">
          <div className="space-y-3.5">
            <ToggleSwitch showLabel label="Hiển thị trên web" checked={v.isActive} onChange={(x) => set("isActive", x)} />
            <ToggleSwitch showLabel label="Hiện ở trang chủ" checked={v.showOnHome} onChange={(x) => set("showOnHome", x)} />
            <ToggleSwitch showLabel label="Sản phẩm nổi bật" checked={v.isFeatured} onChange={(x) => set("isFeatured", x)} />
            <ToggleSwitch showLabel label='Gắn nhãn "Mới"' checked={v.isNew} onChange={(x) => set("isNew", x)} />
          </div>
        </Card>

        <Card title="Giá & kho">
          <div className="space-y-4">
            <FormField id="p-price" label="Giá bán (đ)" required error={errors.price} hint={price ? formatVND(price) : undefined}>
              <input
                {...fieldAria("p-price", errors.price)}
                inputMode="numeric"
                value={v.price}
                onChange={(e) => set("price", digits(e.target.value))}
                className={inputClass}
              />
            </FormField>
            <FormField
              id="p-salePrice"
              label="Giá khuyến mãi (đ)"
              error={errors.salePrice}
              hint={sale != null && price > sale ? `${formatVND(sale)} · giảm ${discountPercent(price, sale)}%` : "Để trống nếu không giảm giá"}
            >
              <input
                {...fieldAria("p-salePrice", errors.salePrice)}
                inputMode="numeric"
                value={v.salePrice}
                onChange={(e) => set("salePrice", digits(e.target.value))}
                className={inputClass}
              />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField id="p-stock" label="Tồn kho" required error={errors.stock}>
                <input
                  {...fieldAria("p-stock", errors.stock)}
                  inputMode="numeric"
                  value={v.stock}
                  onChange={(e) => set("stock", digits(e.target.value))}
                  className={inputClass}
                />
              </FormField>
              <FormField id="p-sortOrder" label="Thứ tự" error={errors.sortOrder} hint="Nhỏ hơn đứng trước">
                <input
                  {...fieldAria("p-sortOrder", errors.sortOrder)}
                  inputMode="numeric"
                  value={v.sortOrder}
                  onChange={(e) => set("sortOrder", e.target.value.replace(/[^\d-]/g, ""))}
                  className={inputClass}
                />
              </FormField>
            </div>
          </div>
        </Card>

        <Card title="Danh mục">
          <label htmlFor="p-categoryId" className="sr-only">
            Danh mục
          </label>
          <select
            id="p-categoryId"
            value={v.categoryId}
            onChange={(e) => set("categoryId", e.target.value)}
            className={`${selectCls} w-full`}
          >
            <option value="">— Chưa phân loại —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <p className="mt-1.5 text-sm text-danger">{errors.categoryId}</p>}
        </Card>

        <div className="flex flex-col gap-2">
          <Button type="submit" size="lg" loading={pending}>
            {!pending && <Save className="size-4" aria-hidden />}
            {id ? "Lưu thay đổi" : "Tạo sản phẩm"}
          </Button>
          {id && initial.slug && (
            <Link
              href={`/san-pham/${initial.slug}`}
              target="_blank"
              className="inline-flex items-center justify-center gap-1.5 py-2 text-sm text-leaf-700 hover:underline"
            >
              Xem trên web <ExternalLink className="size-3.5" aria-hidden />
            </Link>
          )}
        </div>
      </div>
    </form>
  );
}
