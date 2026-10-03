/**
 * Tạo lại dữ liệu đơn hàng mẫu (90 ngày) + xuất thống kê cho báo cáo.
 * Chỉ thay bảng Order/OrderItem – giữ nguyên sản phẩm, cài đặt, logo, tài khoản...
 *
 *   npm run db:demo-orders
 *
 * Kết quả thống kê ghi vào docs/bao-cao-du-lieu-mua-hang.md (số liệu khớp với trang admin).
 */
import fs from "node:fs";
import { PrismaClient } from "@prisma/client";
import { generateDemoOrders } from "../prisma/seed-data/demo-orders";

const prisma = new PrismaClient();
const vnd = (n: number) => `${new Intl.NumberFormat("vi-VN").format(Math.round(n))}đ`;
const pct = (a: number, b: number) => (b ? `${((a / b) * 100).toFixed(1)}%` : "0%");
const STATUS: Record<string, string> = { NEW: "Mới", CONFIRMED: "Đã xác nhận", SHIPPING: "Đang giao", COMPLETED: "Hoàn thành", CANCELLED: "Đã hủy" };
const VN = 7 * 60 * 60 * 1000;
const vnDate = (d: Date) => new Date(d.getTime() + VN);
const fmtDate = (d: Date) => { const v = vnDate(d); return `${String(v.getUTCDate()).padStart(2, "0")}/${String(v.getUTCMonth() + 1).padStart(2, "0")}/${v.getUTCFullYear()}`; };

const shippingRow = await prisma.setting.findUnique({ where: { key: "shipping" } });
const shipping = shippingRow ? JSON.parse(shippingRow.value) : { fee: 30000, freeThreshold: 500000 };
console.log("⏳ Đang tạo dữ liệu đơn hàng mẫu...");
const s = await generateDemoOrders(prisma, { shippingFee: shipping.fee ?? 30000, freeThreshold: shipping.freeThreshold ?? 500000 });
console.log(`✓ ${s.orders} đơn hàng, ${s.customers} khách hàng (${s.repeatCustomers} khách mua lại)`);

// ---------------- Thống kê ----------------
const orders = await prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: "asc" } });
const done = orders.filter((o) => o.status === "COMPLETED");
const valid = orders.filter((o) => o.status !== "CANCELLED");
const revenue = done.reduce((t, o) => t + o.total, 0);

const byMonth = new Map<string, { orders: number; done: number; revenue: number }>();
for (const o of orders) {
  const v = vnDate(o.createdAt);
  const k = `${String(v.getUTCMonth() + 1).padStart(2, "0")}/${v.getUTCFullYear()}`;
  const m = byMonth.get(k) ?? { orders: 0, done: 0, revenue: 0 };
  m.orders++;
  if (o.status === "COMPLETED") { m.done++; m.revenue += o.total; }
  byMonth.set(k, m);
}

const prod = new Map<string, { qty: number; revenue: number; orders: number }>();
for (const o of valid) for (const it of o.items) {
  const p = prod.get(it.productName) ?? { qty: 0, revenue: 0, orders: 0 };
  p.qty += it.quantity; p.revenue += it.price * it.quantity; p.orders++;
  prod.set(it.productName, p);
}
const topProducts = [...prod.entries()].sort((a, b) => b[1].revenue - a[1].revenue).slice(0, 10);

const cust = new Map<string, { name: string; orders: number; spent: number }>();
for (const o of valid) {
  const c = cust.get(o.phone) ?? { name: o.customerName, orders: 0, spent: 0 };
  c.orders++; c.spent += o.total;
  cust.set(o.phone, c);
}
const topCustomers = [...cust.entries()].sort((a, b) => b[1].spent - a[1].spent).slice(0, 10);
const maskPhone = (p: string) => `${p.slice(0, 4)}***${p.slice(-3)}`;

const region = new Map<string, number>();
for (const o of valid) {
  const city = o.address.split(",").pop()!.trim();
  region.set(city, (region.get(city) ?? 0) + 1);
}

const pay = { COD: valid.filter((o) => o.paymentMethod === "COD").length, BANK: valid.filter((o) => o.paymentMethod === "BANK_TRANSFER").length };
const freeShip = valid.filter((o) => o.shippingFee === 0).length;
const items = valid.reduce((t, o) => t + o.items.reduce((x, i) => x + i.quantity, 0), 0);

const md = `# Báo cáo dữ liệu mua hàng (dữ liệu mẫu)

> **Đồ án môn học** – Website bán sen đá "Sen Đá Xinh"
> Sinh viên: **Trần Thị Thanh Hương** · MSSV: **25210281** · Email: 25210281@ms.uit.edu.vn
> Trường Đại học Công nghệ Thông tin – ĐHQG TP. Hồ Chí Minh (UIT)
>
> Dữ liệu được sinh tự động bằng \`npm run db:demo-orders\` (bộ sinh số có hạt giống cố định – chạy lại ra cùng kết quả).
> **Toàn bộ khách hàng là hư cấu**, chỉ phục vụ minh họa. Số liệu tính tại thời điểm tạo: ${fmtDate(s.to)}.

## 1. Tổng quan (${fmtDate(s.from)} – ${fmtDate(s.to)}, 90 ngày)

| Chỉ số | Giá trị |
|---|---|
| Tổng số đơn hàng | **${orders.length}** |
| Đơn hoàn thành | ${done.length} (${pct(done.length, orders.length)}) |
| Đơn bị hủy | ${orders.length - valid.length} (${pct(orders.length - valid.length, orders.length)}) |
| **Doanh thu** (đơn hoàn thành) | **${vnd(revenue)}** |
| Giá trị trung bình / đơn hoàn thành | ${vnd(done.length ? revenue / done.length : 0)} |
| Số sản phẩm đã bán (đơn không hủy) | ${items} |
| Số khách hàng | ${cust.size} – trong đó **${[...cust.values()].filter((c) => c.orders > 1).length}** khách mua từ 2 lần trở lên |
| Đơn được miễn phí ship (≥ ${vnd(shipping.freeThreshold ?? 500000)}) | ${freeShip} (${pct(freeShip, valid.length)}) |

## 2. Đơn hàng theo trạng thái

| Trạng thái | Số đơn | Tỉ lệ |
|---|---|---|
${["NEW", "CONFIRMED", "SHIPPING", "COMPLETED", "CANCELLED"].map((k) => `| ${STATUS[k]} | ${s.byStatus[k] ?? 0} | ${pct(s.byStatus[k] ?? 0, orders.length)} |`).join("\n")}

## 3. Doanh thu theo tháng

| Tháng | Số đơn | Đơn hoàn thành | Doanh thu |
|---|---|---|---|
${[...byMonth.entries()].map(([k, m]) => `| ${k} | ${m.orders} | ${m.done} | ${vnd(m.revenue)} |`).join("\n")}

*Tháng đầu và tháng cuối không đủ ngày. Đơn của vài ngày gần nhất phần lớn chưa hoàn thành nên chưa tính vào doanh thu.*

## 4. Top 10 sản phẩm theo doanh số (đơn không hủy)

| # | Sản phẩm | Số lượng bán | Số đơn | Doanh số |
|---|---|---|---|---|
${topProducts.map(([name, p], i) => `| ${i + 1} | ${name} | ${p.qty} | ${p.orders} | ${vnd(p.revenue)} |`).join("\n")}

## 5. Top 10 khách hàng (đơn không hủy)

| # | Khách hàng | SĐT | Số đơn | Tổng chi tiêu |
|---|---|---|---|---|
${topCustomers.map(([phone, c], i) => `| ${i + 1} | ${c.name} | ${maskPhone(phone)} | ${c.orders} | ${vnd(c.spent)} |`).join("\n")}

## 6. Khu vực giao hàng

| Tỉnh / thành | Số đơn | Tỉ lệ |
|---|---|---|
${[...region.entries()].sort((a, b) => b[1] - a[1]).map(([k, n]) => `| ${k} | ${n} | ${pct(n, valid.length)} |`).join("\n")}

## 7. Phương thức thanh toán

| Phương thức | Số đơn | Tỉ lệ |
|---|---|---|
| Thanh toán khi nhận hàng (COD) | ${pay.COD} | ${pct(pay.COD, valid.length)} |
| Chuyển khoản ngân hàng | ${pay.BANK} | ${pct(pay.BANK, valid.length)} |

## 8. Gợi ý kịch bản quay video demo

1. **Khách hàng:** trang chủ → lọc sản phẩm → chi tiết → *Thêm vào giỏ* (hiệu ứng bay vào giỏ) → *Thanh toán* → đặt hàng → trang cảm ơn (mã đơn, QR chuyển khoản).
2. **Tra cứu đơn:** vào *Tra cứu đơn*, nhập SĐT + mã đơn vừa đặt.
3. **Chatbot Bé Sen:** hỏi "phí ship bao nhiêu", "tư vấn cây dễ chăm dưới 100k", tra cứu đơn qua chat.
4. **Quản trị** (\`/admin\`): *Tổng quan* (doanh thu, biểu đồ 14 ngày, đơn theo trạng thái) → *Đơn hàng* (lọc theo trạng thái/ngày, đổi trạng thái đơn vừa đặt, **Xuất CSV**) → *Sản phẩm* (bật/tắt nhanh) → *Chatbot* (thống kê, câu chưa hiểu).
5. Mở file CSV vừa xuất bằng Excel để minh họa phần báo cáo dữ liệu.
`;
fs.mkdirSync("docs", { recursive: true });
fs.writeFileSync("docs/bao-cao-du-lieu-mua-hang.md", md);
console.log(`✓ Doanh thu (đơn hoàn thành): ${vnd(revenue)} · Ghi thống kê vào docs/bao-cao-du-lieu-mua-hang.md`);
await prisma.$disconnect();
