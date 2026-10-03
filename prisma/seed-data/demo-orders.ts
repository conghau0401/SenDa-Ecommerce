/**
 * Dữ liệu mua hàng mẫu cho báo cáo / video demo đồ án.
 *
 * - 90 ngày gần nhất, số đơn tăng dần theo thời gian, cuối tuần đông hơn.
 * - ~45 khách hàng (họ tên, SĐT, địa chỉ khắp các tỉnh/thành), có khách mua lặp lại.
 * - Trạng thái theo tuổi đơn: đơn cũ phần lớn "Hoàn thành", vài đơn "Đã hủy";
 *   đơn vài ngày gần đây "Đang giao" / "Đã xác nhận"; đơn hôm nay–hôm qua "Mới".
 * - Dùng bộ sinh số ngẫu nhiên có hạt giống cố định (SEED) -> chạy lại luôn ra cùng một bộ dữ liệu,
 *   số liệu trong báo cáo khớp với web. Đổi SEED để có bộ dữ liệu khác.
 *
 * Toàn bộ khách hàng là HƯ CẤU (tên, SĐT, địa chỉ), chỉ dùng cho mục đích demo.
 */
import type { PrismaClient } from "@prisma/client";

const SEED = 25210281;
const DAYS = 90;
const DAY = 24 * 60 * 60 * 1000;
const VN_OFFSET = 7 * 60 * 60 * 1000;

/** PRNG mulberry32 – tái lập được */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const HO = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý"];
const DEM_NU = ["Thị", "Ngọc", "Thu", "Thanh", "Minh", "Phương", "Bảo", "Khánh", "Mỹ", "Hoài"];
const TEN_NU = ["Anh", "Hà", "Linh", "Trang", "Vy", "Ngân", "Thảo", "My", "Quỳnh", "Hương", "Lan", "Mai", "Nhi", "Tâm", "Yến", "Giang"];
const DEM_NAM = ["Văn", "Minh", "Quốc", "Đức", "Hoàng", "Gia", "Thành", "Tuấn", "Hữu", "Nhật"];
const TEN_NAM = ["Khoa", "Huy", "Nam", "Bảo", "Long", "Phúc", "Tài", "Khang", "Duy", "Hiếu", "Đạt", "Trung"];

const DIA_CHI: [string, number][] = [
  // [địa chỉ, trọng số] – khách tập trung ở TP.HCM (gần shop), rải các tỉnh khác
  ["Đường Võ Văn Ngân, P. Linh Chiểu, TP. Thủ Đức, TP. Hồ Chí Minh", 4],
  ["KTX Khu A ĐHQG, P. Linh Trung, TP. Thủ Đức, TP. Hồ Chí Minh", 3],
  ["Đường Nguyễn Văn Bá, P. Trường Thọ, TP. Thủ Đức, TP. Hồ Chí Minh", 2],
  ["Đường Lê Văn Việt, P. Hiệp Phú, TP. Thủ Đức, TP. Hồ Chí Minh", 3],
  ["Đường Nguyễn Thị Minh Khai, P. Đa Kao, Quận 1, TP. Hồ Chí Minh", 3],
  ["Đường Cách Mạng Tháng 8, P. 7, Quận 3, TP. Hồ Chí Minh", 3],
  ["Đường Phan Xích Long, P. 2, Q. Phú Nhuận, TP. Hồ Chí Minh", 2],
  ["Đường Quang Trung, P. 10, Q. Gò Vấp, TP. Hồ Chí Minh", 3],
  ["Đường Cộng Hòa, P. 13, Q. Tân Bình, TP. Hồ Chí Minh", 3],
  ["Đường Nguyễn Thị Thập, P. Tân Phú, Quận 7, TP. Hồ Chí Minh", 2],
  ["Đường Xô Viết Nghệ Tĩnh, P. 25, Q. Bình Thạnh, TP. Hồ Chí Minh", 2],
  ["Đường Lê Hồng Phong, P. Phú Hòa, TP. Thủ Dầu Một, Bình Dương", 2],
  ["Đường Đồng Khởi, P. Tân Hiệp, TP. Biên Hòa, Đồng Nai", 2],
  ["Đường Trần Phú, P. Hải Châu 1, Q. Hải Châu, Đà Nẵng", 2],
  ["Đường Cầu Giấy, P. Quan Hoa, Q. Cầu Giấy, Hà Nội", 2],
  ["Phố Tôn Đức Thắng, P. Hàng Bột, Q. Đống Đa, Hà Nội", 1],
  ["Đường 30/4, P. Hưng Lợi, Q. Ninh Kiều, Cần Thơ", 1],
  ["Đường Trần Hưng Đạo, P. 1, TP. Đà Lạt, Lâm Đồng", 1],
  ["Đường Lê Lợi, P. Vĩnh Ninh, TP. Huế, Thừa Thiên Huế", 1],
  ["Đường Nguyễn Huệ, P. 1, TP. Vũng Tàu, Bà Rịa – Vũng Tàu", 1],
  ["Đường 2/4, P. Vĩnh Phước, TP. Nha Trang, Khánh Hòa", 1],
];

const GHI_CHU = [
  "Giao giờ hành chính giúp mình",
  "Gọi trước khi giao nhé shop",
  "Gói quà giúp mình, viết thiệp: Chúc mừng sinh nhật!",
  "Giao sau 17h",
  "Shop chọn cây đẹp giúp em nha",
  "Mua tặng bạn, không ghi giá trong hộp",
  "Để ở phòng bảo vệ nếu không có người nhận",
];
const GHI_CHU_NOI_BO = ["Khách quen, tặng kèm sỏi trang trí", "Đã gọi xác nhận", "Khách hẹn đổi giờ giao", "Đóng gói 2 lớp chống sốc"];
const LY_DO_HUY = ["Khách đổi ý, đã gọi xác nhận hủy", "Không liên lạc được khách 3 lần", "Khách đặt trùng đơn"];

type Customer = { name: string; phone: string; address: string; loyalty: number };
type ProductLite = { id: number; name: string; price: number; salePrice: number | null; isFeatured: boolean; showOnHome: boolean; image: string | null };

export type DemoOrderSummary = {
  orders: number;
  customers: number;
  repeatCustomers: number;
  revenueCompleted: number;
  byStatus: Record<string, number>;
  from: Date;
  to: Date;
};

/**
 * Xóa đơn hàng cũ và tạo bộ đơn hàng mẫu.
 * Không thay đổi tồn kho, sản phẩm, cài đặt hay dữ liệu khác.
 */
export async function generateDemoOrders(
  prisma: PrismaClient,
  opts: { shippingFee: number; freeThreshold: number; now?: Date },
): Promise<DemoOrderSummary> {
  const rand = rng(SEED);
  const pick = <T>(arr: readonly T[]) => arr[Math.floor(rand() * arr.length)];
  /** Mã đơn giống src/lib/order-code.ts nhưng dùng PRNG có hạt giống -> mã đơn cũng cố định */
  const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
  const makeCode = (date: Date) => {
    const vn = new Date(date.getTime() + VN_OFFSET);
    const ymd = `${String(vn.getUTCFullYear()).slice(2)}${String(vn.getUTCMonth() + 1).padStart(2, "0")}${String(vn.getUTCDate()).padStart(2, "0")}`;
    let r = "";
    for (let i = 0; i < 4; i++) r += ALPHABET[Math.floor(rand() * ALPHABET.length)];
    return `SD${ymd}-${r}`;
  };
  const weighted = <T>(items: [T, number][]) => {
    const total = items.reduce((s, [, w]) => s + w, 0);
    let r = rand() * total;
    for (const [v, w] of items) if ((r -= w) <= 0) return v;
    return items[items.length - 1][0];
  };

  const products: ProductLite[] = (
    await prisma.product.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        price: true,
        salePrice: true,
        isFeatured: true,
        showOnHome: true,
        images: { select: { url: true }, orderBy: { sortOrder: "asc" }, take: 1 },
      },
    })
  ).map((p) => ({ ...p, image: p.images[0]?.url ?? null }));
  if (products.length === 0) throw new Error("Chưa có sản phẩm – hãy chạy seed trước");

  // Sản phẩm nổi bật / giá mềm bán chạy hơn
  const productWeights: [ProductLite, number][] = products.map((p) => {
    const price = p.salePrice ?? p.price;
    return [p, (p.isFeatured ? 3 : 1) + (p.showOnHome ? 1.5 : 0) + (price <= 100_000 ? 1.5 : 0) + (p.salePrice ? 1 : 0)];
  });

  // Khách hàng hư cấu
  const usedPhones = new Set<string>();
  const customers: Customer[] = Array.from({ length: 45 }, () => {
    const female = rand() < 0.68; // khách mua cây cảnh/quà đa phần là nữ
    const name = female
      ? `${pick(HO)} ${pick(DEM_NU)} ${pick(TEN_NU)}`
      : `${pick(HO)} ${pick(DEM_NAM)} ${pick(TEN_NAM)}`;
    let phone = "";
    do {
      phone = `0${pick(["3", "5", "7", "8", "9"])}${String(Math.floor(rand() * 1e8)).padStart(8, "0")}`;
    } while (usedPhones.has(phone));
    usedPhones.add(phone);
    const so = 1 + Math.floor(rand() * 250);
    return { name, phone, address: `${so} ${weighted(DIA_CHI)}`, loyalty: rand() < 0.25 ? 4 : rand() < 0.5 ? 2 : 1 };
  });
  const customerWeights: [Customer, number][] = customers.map((c) => [c, c.loyalty]);

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();

  const now = opts.now ?? new Date();
  const todayVn = new Date(Math.floor((now.getTime() + VN_OFFSET) / DAY) * DAY - VN_OFFSET); // 0h hôm nay (giờ VN)
  const usedCodes = new Set<string>();
  const byStatus: Record<string, number> = {};
  let revenueCompleted = 0;
  let count = 0;
  const buyers = new Map<string, number>();

  for (let d = DAYS - 1; d >= 0; d--) {
    const dayStart = new Date(todayVn.getTime() - d * DAY);
    const weekday = new Date(dayStart.getTime() + VN_OFFSET).getUTCDay();
    // Xu hướng tăng: ~0.6 đơn/ngày đầu kỳ -> ~2.2 đơn/ngày cuối kỳ, cuối tuần x1.5
    const trend = 0.6 + 1.6 * ((DAYS - 1 - d) / (DAYS - 1));
    const expected = trend * (weekday === 0 || weekday === 6 ? 1.5 : 1);
    let n = Math.floor(expected) + (rand() < expected % 1 ? 1 : 0);
    if (d === 0) n = Math.max(n, 2); // hôm nay luôn có đơn mới để demo

    for (let k = 0; k < n; k++) {
      // Giờ đặt 8h–22h, tối đông hơn
      const hour = weighted([[8, 1], [9, 1], [10, 1.5], [11, 1.5], [12, 2], [13, 1], [14, 1], [15, 1], [16, 1], [17, 1.5], [18, 2], [19, 2.5], [20, 2.5], [21, 2]] as [number, number][]);
      let createdAt = new Date(dayStart.getTime() + (hour * 60 + Math.floor(rand() * 60)) * 60_000);
      if (createdAt > now) createdAt = new Date(now.getTime() - Math.floor(rand() * 90) * 60_000);

      const customer = weighted(customerWeights);

      // 1–4 sản phẩm khác nhau, mỗi loại 1–3 cái
      const lines = weighted([[1, 5], [2, 4], [3, 2], [4, 1]] as [number, number][]);
      const chosen = new Map<number, { p: ProductLite; qty: number }>();
      for (let i = 0; i < lines; i++) {
        const p = weighted(productWeights);
        const qty = weighted([[1, 6], [2, 3], [3, 1]] as [number, number][]);
        chosen.set(p.id, { p, qty: (chosen.get(p.id)?.qty ?? 0) + qty });
      }
      const items = [...chosen.values()].map(({ p, qty }) => ({
        productId: p.id,
        productName: p.name,
        productImage: p.image,
        price: p.salePrice != null && p.salePrice < p.price ? p.salePrice : p.price,
        quantity: qty,
      }));
      const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
      const shippingFee = opts.freeThreshold > 0 && subtotal >= opts.freeThreshold ? 0 : opts.shippingFee;

      // Trạng thái theo tuổi đơn
      const ageDays = (now.getTime() - createdAt.getTime()) / DAY;
      let status: string;
      if (ageDays < 1) status = weighted([["NEW", 7], ["CONFIRMED", 3]] as [string, number][]);
      else if (ageDays < 2) status = weighted([["NEW", 2], ["CONFIRMED", 5], ["SHIPPING", 3]] as [string, number][]);
      else if (ageDays < 5) status = weighted([["CONFIRMED", 1], ["SHIPPING", 5], ["COMPLETED", 4], ["CANCELLED", 0.5]] as [string, number][]);
      else status = weighted([["COMPLETED", 92], ["CANCELLED", 8]] as [string, number][]);

      const paymentMethod = rand() < 0.62 ? "COD" : "BANK_TRANSFER";
      let code = makeCode(createdAt);
      while (usedCodes.has(code)) code = makeCode(createdAt);
      usedCodes.add(code);

      const updatedAt = new Date(
        Math.min(
          now.getTime(),
          createdAt.getTime() + (status === "COMPLETED" ? 2 + rand() * 2 : status === "NEW" ? 0 : 0.2 + rand()) * DAY,
        ),
      );

      await prisma.order.create({
        data: {
          code,
          customerName: customer.name,
          phone: customer.phone,
          address: customer.address,
          note: rand() < 0.3 ? pick(GHI_CHU) : null,
          paymentMethod,
          status,
          subtotal,
          shippingFee,
          total: subtotal + shippingFee,
          internalNote: status === "CANCELLED" ? pick(LY_DO_HUY) : rand() < 0.12 ? pick(GHI_CHU_NOI_BO) : null,
          createdAt,
          updatedAt,
          items: { create: items },
        },
      });

      count++;
      byStatus[status] = (byStatus[status] ?? 0) + 1;
      // Thống kê khách: chỉ tính đơn không bị hủy (khớp với file báo cáo)
      if (status !== "CANCELLED") buyers.set(customer.phone, (buyers.get(customer.phone) ?? 0) + 1);
      if (status === "COMPLETED") revenueCompleted += subtotal + shippingFee;
    }
  }

  return {
    orders: count,
    customers: buyers.size,
    repeatCustomers: [...buyers.values()].filter((n) => n > 1).length,
    revenueCompleted,
    byStatus,
    from: new Date(todayVn.getTime() - (DAYS - 1) * DAY),
    to: now,
  };
}
