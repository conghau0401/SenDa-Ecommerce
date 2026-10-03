import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDateTime, formatVND } from "@/lib/format";
import { LOW_STOCK_THRESHOLD, ORDER_STATUSES, ORDER_STATUS_LABEL } from "@/lib/constants";
import { Card, PageHeader } from "@/components/admin/ui";
import { RevenueChart, type DailyPoint } from "@/components/admin/revenue-chart";
import { OrderStatusBadge } from "@/components/order/order-status";

export const metadata: Metadata = { title: "Tổng quan" };

const DAY = 24 * 60 * 60 * 1000;
const VN_OFFSET = 7 * 60 * 60 * 1000;
const WEEKDAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

/** Đầu ngày theo giờ Việt Nam (trả về mốc UTC) */
function vnStartOfDay(d: Date) {
  const vn = new Date(d.getTime() + VN_OFFSET);
  return new Date(Date.UTC(vn.getUTCFullYear(), vn.getUTCMonth(), vn.getUTCDate()) - VN_OFFSET);
}
function vnStartOfMonth(d: Date, offsetMonths = 0) {
  const vn = new Date(d.getTime() + VN_OFFSET);
  return new Date(Date.UTC(vn.getUTCFullYear(), vn.getUTCMonth() + offsetMonths, 1) - VN_OFFSET);
}

function StatTile({ label, value, hint, href }: { label: string; value: string; hint?: React.ReactNode; href?: string }) {
  const body = (
    <>
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1.5 text-2xl font-bold tracking-tight text-leaf-900 sm:text-[28px]">{value}</p>
      {hint && <div className="mt-1 text-xs text-muted">{hint}</div>}
    </>
  );
  const cls = "block rounded-2xl bg-surface p-5 shadow-soft ring-1 ring-border/70";
  return href ? (
    <Link href={href} className={`${cls} transition-shadow hover:shadow-lift`}>
      {body}
    </Link>
  ) : (
    <div className={cls}>{body}</div>
  );
}

export default async function DashboardPage() {
  const now = new Date();
  const today = vnStartOfDay(now);
  const chartFrom = new Date(today.getTime() - 13 * DAY);
  const monthStart = vnStartOfMonth(now);
  const prevMonthStart = vnStartOfMonth(now, -1);

  const [revenueMonth, revenuePrev, statusGroups, todayOrders, processing, recentDaily, lowStock, recentOrders, openContacts] =
    await Promise.all([
      prisma.order.aggregate({ _sum: { total: true }, where: { status: "COMPLETED", createdAt: { gte: monthStart } } }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: "COMPLETED", createdAt: { gte: prevMonthStart, lt: monthStart } },
      }),
      prisma.order.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.order.count({ where: { createdAt: { gte: today } } }),
      prisma.order.aggregate({ _sum: { total: true }, _count: { _all: true }, where: { status: { in: ["CONFIRMED", "SHIPPING"] } } }),
      prisma.order.findMany({
        where: { createdAt: { gte: chartFrom }, status: { not: "CANCELLED" } },
        select: { createdAt: true, total: true },
      }),
      prisma.product.findMany({
        where: { stock: { lte: LOW_STOCK_THRESHOLD } },
        orderBy: [{ stock: "asc" }, { name: "asc" }],
        take: 8,
        select: { id: true, name: true, stock: true, isActive: true, images: { take: 1, orderBy: { sortOrder: "asc" }, select: { url: true } } },
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
        select: { id: true, code: true, customerName: true, total: true, status: true, createdAt: true },
      }),
      prisma.contact.count({ where: { isHandled: false } }),
    ]);

  // Gom doanh số theo ngày (giờ VN)
  const daily: DailyPoint[] = Array.from({ length: 14 }, (_, i) => {
    const start = new Date(chartFrom.getTime() + i * DAY);
    const vn = new Date(start.getTime() + VN_OFFSET);
    return {
      key: start.toISOString(),
      label: `${String(vn.getUTCDate()).padStart(2, "0")}/${String(vn.getUTCMonth() + 1).padStart(2, "0")}`,
      weekday: WEEKDAYS[vn.getUTCDay()],
      value: 0,
      orders: 0,
    };
  });
  for (const o of recentDaily) {
    const idx = Math.floor((o.createdAt.getTime() - chartFrom.getTime()) / DAY);
    if (idx >= 0 && idx < 14) {
      daily[idx].value += o.total;
      daily[idx].orders += 1;
    }
  }
  const total14 = daily.reduce((s, d) => s + d.value, 0);

  const countByStatus = Object.fromEntries(statusGroups.map((g) => [g.status, g._count._all])) as Record<string, number>;
  const maxStatus = Math.max(1, ...Object.values(countByStatus));
  const monthRev = revenueMonth._sum.total ?? 0;
  const prevRev = revenuePrev._sum.total ?? 0;
  const delta = prevRev > 0 ? Math.round(((monthRev - prevRev) / prevRev) * 100) : null;

  return (
    <>
      <PageHeader title="Tổng quan" description={`Cập nhật lúc ${formatDateTime(now)}`} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile
          label="Doanh thu tháng này"
          value={formatVND(monthRev)}
          hint={
            delta === null ? (
              "Tính trên đơn hoàn thành"
            ) : (
              <span className={delta >= 0 ? "font-medium text-leaf-700" : "font-medium text-red-700"}>
                {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)}% so với tháng trước
              </span>
            )
          }
        />
        <StatTile
          label="Đơn mới chờ xử lý"
          value={String(countByStatus.NEW ?? 0)}
          hint="Cần xác nhận"
          href="/admin/don-hang?trang-thai=NEW"
        />
        <StatTile label="Đơn hôm nay" value={String(todayOrders)} hint={`${openContacts} liên hệ chưa xử lý`} />
        <StatTile
          label="Đang xử lý & giao"
          value={formatVND(processing._sum.total ?? 0)}
          hint={`${processing._count._all} đơn`}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card
          title="Doanh số 14 ngày qua"
          description={`Tổng giá trị đơn không bị hủy, theo ngày đặt · Tổng ${formatVND(total14)}`}
          className="xl:col-span-2"
        >
          <RevenueChart data={daily} />
        </Card>

        <Card title="Đơn hàng theo trạng thái">
          <ul className="space-y-3.5">
            {ORDER_STATUSES.map((s) => {
              const n = countByStatus[s] ?? 0;
              return (
                <li key={s}>
                  <Link href={`/admin/don-hang?trang-thai=${s}`} className="group block">
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="group-hover:text-leaf-700">{ORDER_STATUS_LABEL[s]}</span>
                      <span className="font-semibold tabular-nums">{n}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-leaf-50" aria-hidden>
                      <div className="h-full rounded-full bg-leaf-600" style={{ width: `${(n / maxStatus) * 100}%` }} />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card
          title="Đơn hàng gần đây"
          actions={
            <Link href="/admin/don-hang" className="inline-flex items-center gap-1 text-sm font-medium text-leaf-700 hover:underline">
              Tất cả <ArrowRight className="size-4" aria-hidden />
            </Link>
          }
          bodyClassName="p-0"
        >
          <ul className="divide-y divide-border">
            {recentOrders.map((o) => (
              <li key={o.id}>
                <Link href={`/admin/don-hang/${o.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-leaf-50/50">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{o.code}</p>
                    <p className="truncate text-xs text-muted">
                      {o.customerName} · {formatDateTime(o.createdAt)}
                    </p>
                  </div>
                  <OrderStatusBadge status={o.status} />
                  <p className="w-24 text-right text-sm font-semibold tabular-nums">{formatVND(o.total)}</p>
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <Card
          title={
            <span className="flex items-center gap-2">
              <AlertTriangle className="size-4 text-warning" aria-hidden /> Sản phẩm sắp hết hàng
            </span>
          }
          description={`Tồn kho ≤ ${LOW_STOCK_THRESHOLD}`}
          bodyClassName="p-0"
        >
          {lowStock.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-muted">Tất cả sản phẩm đều đủ hàng 🎉</p>
          ) : (
            <ul className="divide-y divide-border">
              {lowStock.map((p) => (
                <li key={p.id}>
                  <Link href={`/admin/san-pham/${p.id}`} className="flex items-center gap-3 px-5 py-2.5 hover:bg-leaf-50/50">
                    <div className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-sand">
                      {p.images[0] && <Image src={p.images[0].url} alt="" fill sizes="40px" className="object-cover" />}
                    </div>
                    <p className="min-w-0 flex-1 truncate text-sm font-medium">
                      {p.name}
                      {!p.isActive && <span className="ml-1.5 text-xs font-normal text-muted">(đang ẩn)</span>}
                    </p>
                    <span
                      className={
                        p.stock === 0
                          ? "rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700"
                          : "rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800"
                      }
                    >
                      {p.stock === 0 ? "Hết hàng" : `Còn ${p.stock}`}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}
