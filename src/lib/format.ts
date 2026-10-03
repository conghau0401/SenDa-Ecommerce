const vndFormatter = new Intl.NumberFormat("vi-VN");

/** 1250000 -> "1.250.000đ" */
export function formatVND(amount: number): string {
  return `${vndFormatter.format(Math.round(amount))}đ`;
}

const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: "Asia/Ho_Chi_Minh",
});
const dateTimeFormatter = new Intl.DateTimeFormat("vi-VN", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Ho_Chi_Minh",
});

export function formatDate(date: Date | string): string {
  return dateFormatter.format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
  return dateTimeFormatter.format(new Date(date));
}

/** Phần trăm giảm giá, làm tròn */
export function discountPercent(price: number, salePrice?: number | null): number {
  if (!salePrice || salePrice >= price) return 0;
  return Math.round(((price - salePrice) / price) * 100);
}

/** Giá thực tế khách phải trả */
export function effectivePrice(p: { price: number; salePrice?: number | null }): number {
  return p.salePrice && p.salePrice < p.price ? p.salePrice : p.price;
}
