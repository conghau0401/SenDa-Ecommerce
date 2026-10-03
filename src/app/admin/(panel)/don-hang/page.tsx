import type { Metadata } from "next";
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { Search } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDateTime, formatVND } from "@/lib/format";
import { normalizePhone } from "@/lib/validators/common";
import { ORDER_STATUSES, ORDER_STATUS_LABEL, PAYMENT_METHOD_LABEL, type OrderStatus, type PaymentMethod } from "@/lib/constants";
import { PageHeader, tableCls } from "@/components/admin/ui";
import { OrderStatusBadge } from "@/components/order/order-status";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Đơn hàng" };

const PER_PAGE = 20;
const VN_OFFSET = 7 * 60 * 60 * 1000;

/** "2026-10-03" (ngày theo giờ VN) -> mốc UTC đầu ngày */
function vnDate(value: string | undefined, endOfDay = false): Date | undefined {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const t = Date.parse(`${value}T00:00:00Z`) - VN_OFFSET + (endOfDay ? 24 * 60 * 60 * 1000 : 0);
  return Number.isNaN(t) ? undefined : new Date(t);
}

type Props = { searchParams: Promise<Record<string, string | undefined>> };

export default async function AdminOrdersPage({ searchParams }: Props) {
  const sp = await searchParams;
  const status = ORDER_STATUSES.includes(sp["trang-thai"] as OrderStatus) ? (sp["trang-thai"] as OrderStatus) : "";
  const q = sp.q?.trim() ?? "";
  const from = sp.tu ?? "";
  const to = sp.den ?? "";
  const page = Math.max(1, Number(sp.trang) || 1);

  // Bộ lọc chung (trừ trạng thái) – để đếm số đơn mỗi tab
  const base: Prisma.OrderWhereInput[] = [];
  if (q) {
    const phone = normalizePhone(q);
    base.push({ OR: [{ code: { contains: q.toUpperCase() } }, { phone: { contains: phone } }, { customerName: { contains: q } }] });
  }
  const fromDate = vnDate(from);
  const toDate = vnDate(to, true);
  if (fromDate || toDate) base.push({ createdAt: { ...(fromDate ? { gte: fromDate } : {}), ...(toDate ? { lt: toDate } : {}) } });

  const where: Prisma.OrderWhereInput = { AND: [...base, ...(status ? [{ status }] : [])] };

  const [groups, total, orders] = await Promise.all([
    prisma.order.groupBy({ by: ["status"], where: { AND: base }, _count: { _all: true } }),
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
      include: { _count: { select: { items: true } } },
    }),
  ]);
  const counts = Object.fromEntries(groups.map((g) => [g.status, g._count._all])) as Record<string, number>;
  const allCount = Object.values(counts).reduce((a, b) => a + b, 0);

  const href = (over: Record<string, string>) => {
    const params = new URLSearchParams();
    const merged = { "trang-thai": status, q, tu: from, den: to, ...over };
    for (const [k, v] of Object.entries(merged)) if (v) params.set(k, v);
    const s = params.toString();
    return `/admin/don-hang${s ? `?${s}` : ""}`;
  };

  const tabs = [{ key: "", label: "Tất cả", count: allCount }, ...ORDER_STATUSES.map((s) => ({ key: s, label: ORDER_STATUS_LABEL[s], count: counts[s] ?? 0 }))];

  return (
    <>
      <PageHeader title="Đơn hàng" description={`${total} đơn phù hợp`} />

      <nav className="mb-4 flex gap-1 overflow-x-auto border-b border-border" aria-label="Lọc theo trạng thái">
        {tabs.map((t) => (
          <Link
            key={t.key || "all"}
            href={href({ "trang-thai": t.key, trang: "" })}
            aria-current={status === t.key ? "page" : undefined}
            className={cn(
              "-mb-px flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors",
              status === t.key ? "border-leaf-600 text-leaf-800" : "border-transparent text-muted hover:text-foreground",
            )}
          >
            {t.label}
            <span className={cn("rounded-full px-1.5 text-xs", status === t.key ? "bg-leaf-100" : "bg-sand")}>{t.count}</span>
          </Link>
        ))}
      </nav>

      <form method="get" className="mb-4 flex flex-wrap items-end gap-2" role="search">
        {status && <input type="hidden" name="trang-thai" value={status} />}
        <div className="relative min-w-60 flex-1 sm:max-w-xs">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <input
            name="q"
            defaultValue={q}
            placeholder="Mã đơn, SĐT, tên khách..."
            aria-label="Tìm đơn hàng"
            className="h-10 w-full rounded-xl border border-border bg-surface pr-3 pl-9 text-sm outline-none focus:border-leaf-500 focus:ring-2 focus:ring-leaf-200"
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-muted">
          Từ
          <input type="date" name="tu" defaultValue={from} className="h-10 rounded-xl border border-border bg-surface px-3 text-sm text-foreground" />
        </label>
        <label className="flex items-center gap-2 text-sm text-muted">
          Đến
          <input type="date" name="den" defaultValue={to} className="h-10 rounded-xl border border-border bg-surface px-3 text-sm text-foreground" />
        </label>
        <button type="submit" className="h-10 rounded-xl bg-leaf-100 px-4 text-sm font-medium text-leaf-800 hover:bg-leaf-200">
          Lọc
        </button>
        {(q || from || to) && (
          <Link href={href({ q: "", tu: "", den: "", trang: "" })} className="px-2 py-2 text-sm text-muted hover:text-leaf-700 hover:underline">
            Xóa lọc
          </Link>
        )}
      </form>

      {orders.length === 0 ? (
        <EmptyState title="Không có đơn hàng nào" description="Thử đổi bộ lọc hoặc khoảng thời gian." />
      ) : (
        <div className={tableCls.wrap}>
          <table className={tableCls.table}>
            <thead>
              <tr>
                <th className={tableCls.th}>Mã đơn</th>
                <th className={tableCls.th}>Khách hàng</th>
                <th className={tableCls.th}>Thời gian</th>
                <th className={tableCls.th}>Thanh toán</th>
                <th className={`${tableCls.th} text-right`}>Tổng tiền</th>
                <th className={tableCls.th}>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className={cn(tableCls.tr, "relative")}>
                  <td className={tableCls.td}>
                    <Link href={`/admin/don-hang/${o.id}`} className="font-semibold text-leaf-800 after:absolute after:inset-0 hover:underline">
                      {o.code}
                    </Link>
                    <p className="text-xs text-muted">{o._count.items} sản phẩm</p>
                  </td>
                  <td className={tableCls.td}>
                    <p className="font-medium">{o.customerName}</p>
                    <p className="text-xs text-muted">{o.phone}</p>
                  </td>
                  <td className={`${tableCls.td} whitespace-nowrap text-muted`}>{formatDateTime(o.createdAt)}</td>
                  <td className={`${tableCls.td} text-xs`}>{o.paymentMethod === "COD" ? "COD" : PAYMENT_METHOD_LABEL[o.paymentMethod as PaymentMethod]}</td>
                  <td className={`${tableCls.td} text-right font-semibold whitespace-nowrap tabular-nums`}>{formatVND(o.total)}</td>
                  <td className={tableCls.td}>
                    <OrderStatusBadge status={o.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} totalPages={Math.max(1, Math.ceil(total / PER_PAGE))} makeHref={(p) => href({ trang: p > 1 ? String(p) : "" })} />
    </>
  );
}
