import type { Prisma } from "@prisma/client";
import { getCurrentAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ORDER_STATUSES, ORDER_STATUS_LABEL, PAYMENT_METHOD_LABEL, type OrderStatus, type PaymentMethod } from "@/lib/constants";
import { normalizePhone } from "@/lib/validators/common";

export const runtime = "nodejs";

const VN_OFFSET = 7 * 60 * 60 * 1000;

function vnDate(value: string | null, endOfDay = false): Date | undefined {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const t = Date.parse(`${value}T00:00:00Z`) - VN_OFFSET + (endOfDay ? 24 * 60 * 60 * 1000 : 0);
  return Number.isNaN(t) ? undefined : new Date(t);
}

/** "dd/mm/yyyy hh:mm" theo giờ Việt Nam */
function fmt(d: Date) {
  const v = new Date(d.getTime() + VN_OFFSET);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(v.getUTCDate())}/${p(v.getUTCMonth() + 1)}/${v.getUTCFullYear()} ${p(v.getUTCHours())}:${p(v.getUTCMinutes())}`;
}

/** Ô CSV an toàn: bọc ngoặc kép, chống công thức Excel (=, +, -, @) */
function cell(v: string | number | null | undefined): string {
  let s = v == null ? "" : String(v);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

/** GET /admin/don-hang/export?trang-thai=&q=&tu=&den= – xuất đơn hàng (theo bộ lọc) ra CSV cho Excel */
export async function GET(req: Request) {
  if (!(await getCurrentAdmin())) return new Response("Chưa đăng nhập", { status: 401 });

  const sp = new URL(req.url).searchParams;
  const status = ORDER_STATUSES.includes(sp.get("trang-thai") as OrderStatus) ? (sp.get("trang-thai") as OrderStatus) : null;
  const q = sp.get("q")?.trim() ?? "";
  const from = vnDate(sp.get("tu"));
  const to = vnDate(sp.get("den"), true);

  const and: Prisma.OrderWhereInput[] = [];
  if (status) and.push({ status });
  if (q) and.push({ OR: [{ code: { contains: q.toUpperCase() } }, { phone: { contains: normalizePhone(q) } }, { customerName: { contains: q } }] });
  if (from || to) and.push({ createdAt: { ...(from ? { gte: from } : {}), ...(to ? { lt: to } : {}) } });

  const orders = await prisma.order.findMany({
    where: { AND: and },
    orderBy: { createdAt: "desc" },
    include: { items: { select: { productName: true, quantity: true, price: true } } },
  });

  const header = [
    "Mã đơn", "Ngày đặt", "Trạng thái", "Khách hàng", "Số điện thoại", "Địa chỉ",
    "Sản phẩm", "Số lượng SP", "Tạm tính", "Phí ship", "Tổng tiền", "Thanh toán", "Ghi chú khách", "Ghi chú nội bộ",
  ];
  const rows = orders.map((o) => [
    o.code,
    fmt(o.createdAt),
    ORDER_STATUS_LABEL[o.status as OrderStatus] ?? o.status,
    o.customerName,
    o.phone,
    o.address,
    o.items.map((i) => `${i.productName} x${i.quantity}`).join("; "),
    o.items.reduce((t, i) => t + i.quantity, 0),
    o.subtotal,
    o.shippingFee,
    o.total,
    PAYMENT_METHOD_LABEL[o.paymentMethod as PaymentMethod] ?? o.paymentMethod,
    o.note ?? "",
    o.internalNote ?? "",
  ]);

  // BOM UTF-8 để Excel hiển thị đúng tiếng Việt; CRLF cho Windows
  const csv = "﻿" + [header, ...rows].map((r) => r.map(cell).join(",")).join("\r\n");
  const today = new Date(Date.now() + VN_OFFSET).toISOString().slice(0, 10);
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="don-hang-${status?.toLowerCase() ?? "tat-ca"}-${today}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
