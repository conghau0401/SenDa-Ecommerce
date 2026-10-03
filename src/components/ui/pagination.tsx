import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Danh sách số trang có dấu "…" */
function pageList(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const sorted = [...new Set([1, total, current, current - 1, current + 1])]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push("…");
    out.push(p);
  });
  return out;
}

const itemCls = "flex size-10 items-center justify-center rounded-full text-sm font-medium transition-colors";

export function Pagination({
  page,
  totalPages,
  makeHref,
}: {
  page: number;
  totalPages: number;
  makeHref: (page: number) => string;
}) {
  if (totalPages <= 1) return null;
  return (
    <nav aria-label="Phân trang" className="mt-10 flex items-center justify-center gap-1.5">
      {page > 1 ? (
        <Link href={makeHref(page - 1)} className={cn(itemCls, "hover:bg-leaf-50")} aria-label="Trang trước">
          <ChevronLeft className="size-4" />
        </Link>
      ) : (
        <span className={cn(itemCls, "opacity-40")} aria-hidden>
          <ChevronLeft className="size-4" />
        </span>
      )}
      {pageList(page, totalPages).map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className={cn(itemCls, "text-muted")}>
            …
          </span>
        ) : (
          <Link
            key={p}
            href={makeHref(p)}
            aria-current={p === page ? "page" : undefined}
            aria-label={`Trang ${p}`}
            className={cn(itemCls, p === page ? "bg-primary text-white shadow-soft" : "hover:bg-leaf-50")}
          >
            {p}
          </Link>
        ),
      )}
      {page < totalPages ? (
        <Link href={makeHref(page + 1)} className={cn(itemCls, "hover:bg-leaf-50")} aria-label="Trang sau">
          <ChevronRight className="size-4" />
        </Link>
      ) : (
        <span className={cn(itemCls, "opacity-40")} aria-hidden>
          <ChevronRight className="size-4" />
        </span>
      )}
    </nav>
  );
}
