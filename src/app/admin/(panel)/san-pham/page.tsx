import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { Pencil, Plus, Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatVND } from "@/lib/format";
import { normalizeSearch } from "@/lib/product-utils";
import { LOW_STOCK_THRESHOLD } from "@/lib/constants";
import { PageHeader, tableCls } from "@/components/admin/ui";
import { AutoSubmitSelect } from "@/components/admin/filter-controls";
import { DeleteProductButton, ProductFlagToggle } from "@/components/admin/product-row-actions";
import { ButtonLink } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = { title: "Sản phẩm" };

const PER_PAGE = 20;

type Props = { searchParams: Promise<Record<string, string | undefined>> };

export default async function AdminProductsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const cat = sp["danh-muc"] ?? "";
  const status = sp["trang-thai"] ?? "";
  const page = Math.max(1, Number(sp.trang) || 1);

  const and: Prisma.ProductWhereInput[] = [];
  const nq = normalizeSearch(q);
  if (nq) for (const w of nq.split(" ")) and.push({ searchText: { contains: w } });
  if (cat === "none") and.push({ categoryId: null });
  else if (cat) and.push({ categoryId: Number(cat) || -1 });
  if (status === "active") and.push({ isActive: true });
  if (status === "hidden") and.push({ isActive: false });
  if (status === "low") and.push({ stock: { lte: LOW_STOCK_THRESHOLD } });
  if (status === "home") and.push({ showOnHome: true });
  const where: Prisma.ProductWhereInput = { AND: and };

  const [categories, total, products] = await Promise.all([
    prisma.category.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true } }),
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { id: "desc" }],
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
      include: {
        category: { select: { name: true } },
        images: { take: 1, orderBy: { sortOrder: "asc" }, select: { url: true } },
      },
    }),
  ]);

  const qs = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (cat) params.set("danh-muc", cat);
    if (status) params.set("trang-thai", status);
    if (p > 1) params.set("trang", String(p));
    const s = params.toString();
    return `/admin/san-pham${s ? `?${s}` : ""}`;
  };

  return (
    <>
      <PageHeader
        title="Sản phẩm"
        description={`${total} sản phẩm`}
        actions={
          <ButtonLink href="/admin/san-pham/moi">
            <Plus className="size-4" aria-hidden /> Thêm sản phẩm
          </ButtonLink>
        }
      />

      <form method="get" className="mb-4 flex flex-wrap items-center gap-2" role="search">
        <div className="relative min-w-60 flex-1 sm:max-w-sm">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <input
            name="q"
            defaultValue={q}
            placeholder="Tìm theo tên hoặc SKU..."
            aria-label="Tìm sản phẩm"
            className="h-10 w-full rounded-xl border border-border bg-surface pr-3 pl-9 text-sm outline-none focus:border-leaf-500 focus:ring-2 focus:ring-leaf-200"
          />
        </div>
        <AutoSubmitSelect
          name="danh-muc"
          label="Lọc theo danh mục"
          defaultValue={cat}
          options={[
            { value: "", label: "Tất cả danh mục" },
            ...categories.map((c) => ({ value: String(c.id), label: c.name })),
            { value: "none", label: "Chưa phân loại" },
          ]}
        />
        <AutoSubmitSelect
          name="trang-thai"
          label="Lọc theo trạng thái"
          defaultValue={status}
          options={[
            { value: "", label: "Mọi trạng thái" },
            { value: "active", label: "Đang hiển thị" },
            { value: "hidden", label: "Đang ẩn" },
            { value: "home", label: "Hiện ở trang chủ" },
            { value: "low", label: `Sắp hết (≤ ${LOW_STOCK_THRESHOLD})` },
          ]}
        />
        <button type="submit" className="h-10 rounded-xl bg-leaf-100 px-4 text-sm font-medium text-leaf-800 hover:bg-leaf-200">
          Lọc
        </button>
        {(q || cat || status) && (
          <Link href="/admin/san-pham" className="px-2 text-sm text-muted hover:text-leaf-700 hover:underline">
            Xóa lọc
          </Link>
        )}
      </form>

      {products.length === 0 ? (
        <EmptyState title="Không có sản phẩm nào" description="Thử đổi bộ lọc hoặc thêm sản phẩm mới." />
      ) : (
        <div className={tableCls.wrap}>
          <table className={tableCls.table}>
            <thead>
              <tr>
                <th className={tableCls.th}>Sản phẩm</th>
                <th className={`${tableCls.th} text-right`}>Giá</th>
                <th className={`${tableCls.th} text-right`}>Tồn kho</th>
                <th className={`${tableCls.th} text-center`}>Hiển thị</th>
                <th className={`${tableCls.th} text-center`}>Trang chủ</th>
                <th className={`${tableCls.th} text-center`}>Nổi bật</th>
                <th className={`${tableCls.th} text-center`}>Mới</th>
                <th className={`${tableCls.th} text-right`}>Thứ tự</th>
                <th className={tableCls.th}>
                  <span className="sr-only">Thao tác</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className={tableCls.tr}>
                  <td className={tableCls.td}>
                    <div className="flex items-center gap-3">
                      <div className="relative size-11 shrink-0 overflow-hidden rounded-lg bg-sand">
                        {p.images[0] && <Image src={p.images[0].url} alt="" fill sizes="44px" className="object-cover" />}
                      </div>
                      <div className="min-w-0">
                        <Link href={`/admin/san-pham/${p.id}`} className="line-clamp-1 font-medium hover:text-leaf-700">
                          {p.name}
                        </Link>
                        <p className="text-xs text-muted">
                          {p.category?.name ?? "Chưa phân loại"}
                          {p.sku && ` · ${p.sku}`}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className={`${tableCls.td} text-right whitespace-nowrap tabular-nums`}>
                    {p.salePrice != null ? (
                      <>
                        <span className="font-semibold text-sale">{formatVND(p.salePrice)}</span>
                        <br />
                        <span className="text-xs text-muted line-through">{formatVND(p.price)}</span>
                      </>
                    ) : (
                      <span className="font-semibold">{formatVND(p.price)}</span>
                    )}
                  </td>
                  <td className={`${tableCls.td} text-right tabular-nums`}>
                    <span
                      className={
                        p.stock === 0
                          ? "font-semibold text-red-600"
                          : p.stock <= LOW_STOCK_THRESHOLD
                            ? "font-semibold text-warning"
                            : undefined
                      }
                    >
                      {p.stock}
                    </span>
                  </td>
                  <td className={`${tableCls.td} text-center`}>
                    <ProductFlagToggle id={p.id} flag="isActive" checked={p.isActive} label={`Hiển thị ${p.name}`} />
                  </td>
                  <td className={`${tableCls.td} text-center`}>
                    <ProductFlagToggle id={p.id} flag="showOnHome" checked={p.showOnHome} label={`Hiện ${p.name} ở trang chủ`} />
                  </td>
                  <td className={`${tableCls.td} text-center`}>
                    <ProductFlagToggle id={p.id} flag="isFeatured" checked={p.isFeatured} label={`${p.name} nổi bật`} />
                  </td>
                  <td className={`${tableCls.td} text-center`}>
                    <ProductFlagToggle id={p.id} flag="isNew" checked={p.isNew} label={`Gắn nhãn Mới cho ${p.name}`} />
                  </td>
                  <td className={`${tableCls.td} text-right text-muted tabular-nums`}>{p.sortOrder}</td>
                  <td className={tableCls.td}>
                    <div className="flex justify-end gap-1">
                      <Link
                        href={`/admin/san-pham/${p.id}`}
                        className="flex size-8 items-center justify-center rounded-lg text-muted hover:bg-leaf-50 hover:text-leaf-700"
                        aria-label={`Sửa ${p.name}`}
                      >
                        <Pencil className="size-4" />
                      </Link>
                      <DeleteProductButton id={p.id} name={p.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} totalPages={Math.max(1, Math.ceil(total / PER_PAGE))} makeHref={qs} />
    </>
  );
}
