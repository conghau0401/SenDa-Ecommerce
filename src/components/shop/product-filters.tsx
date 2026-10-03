"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { Check, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatVND } from "@/lib/format";
import { PRICE_PRESETS, SORT_KEYS, SORT_LABELS, listingQuery, type ListingParams, type SortParam } from "@/lib/listing-params";
import { Button } from "../ui/button";

type Category = { name: string; slug: string; count: number };

/** URL cho danh mục: dùng /danh-muc/[slug] (canonical) và giữ nguyên bộ lọc khác */
function categoryHref(slug: string | undefined, p: ListingParams) {
  const rest = { ...p, category: undefined, page: undefined };
  return slug ? `/danh-muc/${slug}${listingQuery(rest)}` : `/san-pham${listingQuery(rest)}`;
}

function FilterPanel({
  categories,
  params,
  basePath,
  onNavigate,
}: {
  categories: Category[];
  params: ListingParams;
  basePath: string;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const [min, setMin] = useState(params.min?.toString() ?? "");
  const [max, setMax] = useState(params.max?.toString() ?? "");

  useEffect(() => {
    setMin(params.min?.toString() ?? "");
    setMax(params.max?.toString() ?? "");
  }, [params.min, params.max]);

  // Trang /danh-muc/[slug] đã có danh mục trong path
  const queryParams = basePath.startsWith("/danh-muc/") ? { ...params, category: undefined } : params;
  const priceHref = (pmin?: number, pmax?: number) =>
    `${basePath}${listingQuery({ ...queryParams, min: pmin, max: pmax, page: undefined })}`;

  const applyCustomPrice = (e: React.FormEvent) => {
    e.preventDefault();
    let a = min ? Number(min) : undefined;
    let b = max ? Number(max) : undefined;
    if (a != null && b != null && a > b) [a, b] = [b, a];
    router.push(priceHref(a, b), { scroll: false });
    onNavigate?.();
  };

  const linkCls = (active: boolean) =>
    cn(
      "flex items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors",
      active ? "bg-leaf-100 font-semibold text-leaf-800" : "hover:bg-leaf-50",
    );

  return (
    <div className="space-y-7">
      <div>
        <h3 className="mb-2 px-3 text-sm font-semibold tracking-wide text-leaf-900 uppercase">Danh mục</h3>
        <ul className="space-y-0.5">
          <li>
            <Link href={categoryHref(undefined, params)} onClick={onNavigate} className={linkCls(!params.category)} scroll={false}>
              Tất cả sản phẩm
              {!params.category && <Check className="size-4" aria-hidden />}
            </Link>
          </li>
          {categories.map((c) => (
            <li key={c.slug}>
              <Link
                href={categoryHref(c.slug, params)}
                onClick={onNavigate}
                className={linkCls(params.category === c.slug)}
                aria-current={params.category === c.slug ? "page" : undefined}
                scroll={false}
              >
                <span>{c.name}</span>
                <span className="text-xs text-muted">{c.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="mb-2 px-3 text-sm font-semibold tracking-wide text-leaf-900 uppercase">Khoảng giá</h3>
        <ul className="space-y-0.5">
          {PRICE_PRESETS.map((p) => {
            const active = params.min === p.min && params.max === p.max;
            return (
              <li key={p.label}>
                <Link
                  href={active ? priceHref() : priceHref(p.min, p.max)}
                  onClick={onNavigate}
                  className={linkCls(active)}
                  scroll={false}
                >
                  {p.label}
                  {active && <X className="size-4" aria-label="Bỏ chọn" />}
                </Link>
              </li>
            );
          })}
        </ul>
        <form onSubmit={applyCustomPrice} className="mt-3 px-3">
          <div className="flex items-center gap-2">
            <label className="sr-only" htmlFor="price-min">Giá từ</label>
            <input
              id="price-min"
              inputMode="numeric"
              placeholder="Từ"
              value={min}
              onChange={(e) => setMin(e.target.value.replace(/\D/g, ""))}
              className="h-9 w-full min-w-0 rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-leaf-500 focus:ring-2 focus:ring-leaf-200"
            />
            <span className="text-muted">–</span>
            <label className="sr-only" htmlFor="price-max">Giá đến</label>
            <input
              id="price-max"
              inputMode="numeric"
              placeholder="Đến"
              value={max}
              onChange={(e) => setMax(e.target.value.replace(/\D/g, ""))}
              className="h-9 w-full min-w-0 rounded-lg border border-border bg-surface px-3 text-sm outline-none focus:border-leaf-500 focus:ring-2 focus:ring-leaf-200"
            />
          </div>
          <Button type="submit" variant="secondary" size="sm" className="mt-2 w-full">
            Áp dụng
          </Button>
        </form>
      </div>
    </div>
  );
}

export function SortSelect({ params, basePath }: { params: ListingParams; basePath: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="hidden text-muted sm:inline">Sắp xếp:</span>
      <select
        value={params.sort ?? "noi-bat"}
        onChange={(e) =>
          startTransition(() =>
            router.push(`${basePath}${listingQuery({ ...params, sort: e.target.value as SortParam, page: undefined })}`, {
              scroll: false,
            }),
          )
        }
        className={cn(
          "h-10 cursor-pointer rounded-full border border-border bg-surface pr-8 pl-4 text-sm font-medium outline-none focus:border-leaf-500 focus:ring-2 focus:ring-leaf-200",
          pending && "opacity-60",
        )}
        aria-label="Sắp xếp sản phẩm"
      >
        {SORT_KEYS.map((k) => (
          <option key={k} value={k}>
            {SORT_LABELS[k]}
          </option>
        ))}
      </select>
    </label>
  );
}

/** Sidebar trên desktop, bottom sheet trên mobile */
export function ProductFilters(props: { categories: Category[]; params: ListingParams; basePath: string }) {
  const [open, setOpen] = useState(false);
  const activeCount = (props.params.category ? 1 : 0) + (props.params.min != null || props.params.max != null ? 1 : 0);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <aside className="hidden lg:block" aria-label="Bộ lọc sản phẩm">
        <div className="sticky top-24 rounded-card bg-surface p-4 shadow-soft ring-1 ring-border/60">
          <FilterPanel {...props} />
        </div>
      </aside>

      <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setOpen(true)} aria-expanded={open}>
        <SlidersHorizontal className="size-4" aria-hidden />
        Bộ lọc
        {activeCount > 0 && (
          <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[11px] text-white">
            {activeCount}
          </span>
        )}
      </Button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Bộ lọc">
            <motion.div
              className="absolute inset-0 cursor-pointer bg-leaf-900/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-[1.75rem] bg-background p-5 pb-8 shadow-lift"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 320 }}
            >
              <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-border" aria-hidden />
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-leaf-900">Bộ lọc</h2>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex size-9 items-center justify-center rounded-full hover:bg-leaf-50"
                  aria-label="Đóng bộ lọc"
                  autoFocus
                >
                  <X className="size-5" />
                </button>
              </div>
              <FilterPanel {...props} onNavigate={() => setOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export function ActiveFilterChips({ params, basePath }: { params: ListingParams; basePath: string }) {
  const chips: { label: string; href: string }[] = [];
  if (params.q) chips.push({ label: `"${params.q}"`, href: `${basePath}${listingQuery({ ...params, q: undefined, page: undefined })}` });
  if (params.min != null || params.max != null) {
    const label =
      params.min != null && params.max != null
        ? `${formatVND(params.min)} – ${formatVND(params.max)}`
        : params.min != null
          ? `Từ ${formatVND(params.min)}`
          : `Đến ${formatVND(params.max!)}`;
    chips.push({ label, href: `${basePath}${listingQuery({ ...params, min: undefined, max: undefined, page: undefined })}` });
  }
  if (chips.length === 0) return null;
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Bộ lọc đang áp dụng">
      {chips.map((c) => (
        <li key={c.label}>
          <Link
            href={c.href}
            scroll={false}
            className="inline-flex items-center gap-1.5 rounded-full bg-leaf-100 py-1 pr-2 pl-3 text-sm font-medium text-leaf-800 hover:bg-leaf-200"
          >
            {c.label}
            <X className="size-3.5" aria-label="Bỏ lọc" />
          </Link>
        </li>
      ))}
    </ul>
  );
}
