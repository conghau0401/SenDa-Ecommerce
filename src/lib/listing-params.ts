/**
 * Tham số URL của trang danh sách sản phẩm (dùng chung server + client).
 *   /san-pham?q=&danh-muc=&gia-tu=&gia-den=&sap-xep=&trang=
 */

export const SORT_KEYS = ["noi-bat", "moi-nhat", "gia-tang", "gia-giam"] as const;
export type SortParam = (typeof SORT_KEYS)[number];

export const SORT_LABELS: Record<SortParam, string> = {
  "noi-bat": "Nổi bật",
  "moi-nhat": "Mới nhất",
  "gia-tang": "Giá thấp → cao",
  "gia-giam": "Giá cao → thấp",
};

export const PRICE_PRESETS: { label: string; min?: number; max?: number }[] = [
  { label: "Dưới 50.000đ", max: 50000 },
  { label: "50.000đ – 100.000đ", min: 50000, max: 100000 },
  { label: "100.000đ – 200.000đ", min: 100000, max: 200000 },
  { label: "200.000đ – 500.000đ", min: 200000, max: 500000 },
  { label: "Trên 500.000đ", min: 500000 },
];

export type ListingParams = {
  q?: string;
  category?: string;
  min?: number;
  max?: number;
  sort?: SortParam;
  page?: number;
};

type RawParams = Record<string, string | string[] | undefined>;

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);

function toInt(v: string | undefined): number | undefined {
  if (!v) return undefined;
  const n = Number.parseInt(v.replace(/\D/g, ""), 10);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

export function parseListingParams(raw: RawParams): ListingParams {
  const sort = first(raw["sap-xep"]);
  const q = first(raw.q)?.trim().slice(0, 100);
  return {
    q: q || undefined,
    category: first(raw["danh-muc"]) || undefined,
    min: toInt(first(raw["gia-tu"])),
    max: toInt(first(raw["gia-den"])),
    sort: SORT_KEYS.includes(sort as SortParam) ? (sort as SortParam) : undefined,
    page: Math.max(1, toInt(first(raw.trang)) ?? 1),
  };
}

/** Tạo query string từ params (bỏ giá trị mặc định cho URL gọn) */
export function listingQuery(p: ListingParams): string {
  const sp = new URLSearchParams();
  if (p.q) sp.set("q", p.q);
  if (p.category) sp.set("danh-muc", p.category);
  if (p.min != null) sp.set("gia-tu", String(p.min));
  if (p.max != null) sp.set("gia-den", String(p.max));
  if (p.sort && p.sort !== "noi-bat") sp.set("sap-xep", p.sort);
  if (p.page && p.page > 1) sp.set("trang", String(p.page));
  const s = sp.toString();
  return s ? `?${s}` : "";
}
