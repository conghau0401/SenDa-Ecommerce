import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  back,
  actions,
}: {
  title: string;
  description?: React.ReactNode;
  back?: { href: string; label: string };
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {back && (
          <Link href={back.href} className="mb-1 inline-flex items-center gap-1 text-sm text-muted hover:text-leaf-700">
            <ChevronLeft className="size-4" aria-hidden /> {back.label}
          </Link>
        )}
        <h1 className="text-2xl font-bold tracking-tight text-leaf-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({
  title,
  description,
  actions,
  className,
  bodyClassName,
  children,
}: {
  title?: React.ReactNode;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("rounded-2xl bg-surface shadow-soft ring-1 ring-border/70", className)}>
      {(title || actions) && (
        <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            {title && <h2 className="font-semibold text-leaf-900">{title}</h2>}
            {description && <p className="mt-0.5 text-xs text-muted">{description}</p>}
          </div>
          {actions}
        </div>
      )}
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

/** Class dùng chung cho bảng dữ liệu */
export const tableCls = {
  wrap: "overflow-x-auto rounded-2xl bg-surface shadow-soft ring-1 ring-border/70",
  table: "w-full min-w-[720px] text-sm",
  th: "bg-sand/60 px-4 py-3 text-left text-xs font-semibold tracking-wide text-muted uppercase",
  td: "border-t border-border px-4 py-3 align-middle",
  tr: "transition-colors hover:bg-leaf-50/40",
};

export const selectCls =
  "h-10 rounded-xl border border-border bg-surface px-3 text-sm outline-none focus:border-leaf-500 focus:ring-2 focus:ring-leaf-200";
