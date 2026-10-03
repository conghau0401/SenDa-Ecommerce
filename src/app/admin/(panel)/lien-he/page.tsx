import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/ui";
import { ContactItem } from "@/components/admin/contact-item";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Liên hệ" };

const PER_PAGE = 20;
const FILTERS = [
  { key: "", label: "Chưa xử lý", where: { isHandled: false } },
  { key: "da-xu-ly", label: "Đã xử lý", where: { isHandled: true } },
  { key: "tat-ca", label: "Tất cả", where: {} },
] as const;

type Props = { searchParams: Promise<{ loc?: string; trang?: string }> };

export default async function AdminContactsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const filter = FILTERS.find((f) => f.key === (sp.loc ?? "")) ?? FILTERS[0];
  const page = Math.max(1, Number(sp.trang) || 1);

  const [counts, total, contacts] = await Promise.all([
    Promise.all(FILTERS.map((f) => prisma.contact.count({ where: f.where }))),
    prisma.contact.count({ where: filter.where }),
    prisma.contact.findMany({
      where: filter.where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
  ]);

  const href = (key: string, p = 1) => {
    const params = new URLSearchParams();
    if (key) params.set("loc", key);
    if (p > 1) params.set("trang", String(p));
    const s = params.toString();
    return `/admin/lien-he${s ? `?${s}` : ""}`;
  };

  return (
    <>
      <PageHeader title="Liên hệ" description="Tin nhắn khách gửi từ trang Liên hệ" />
      <nav className="mb-5 flex gap-1 border-b border-border" aria-label="Lọc liên hệ">
        {FILTERS.map((f, i) => (
          <Link
            key={f.key || "open"}
            href={href(f.key)}
            aria-current={filter.key === f.key ? "page" : undefined}
            className={cn(
              "-mb-px flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium",
              filter.key === f.key ? "border-leaf-600 text-leaf-800" : "border-transparent text-muted hover:text-foreground",
            )}
          >
            {f.label}
            <span className="rounded-full bg-sand px-1.5 text-xs">{counts[i]}</span>
          </Link>
        ))}
      </nav>
      {contacts.length === 0 ? (
        <EmptyState title={filter.key === "" ? "Không còn liên hệ nào cần xử lý 🎉" : "Chưa có liên hệ"} />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {contacts.map((c) => (
            <ContactItem key={c.id} c={c} />
          ))}
        </div>
      )}
      <Pagination page={page} totalPages={Math.max(1, Math.ceil(total / PER_PAGE))} makeHref={(p) => href(filter.key, p)} />
    </>
  );
}
