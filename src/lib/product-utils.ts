import { slugify } from "./slug";

/** Chuẩn hóa chuỗi để tìm kiếm: bỏ dấu, chữ thường, gộp khoảng trắng */
export function normalizeSearch(input: string): string {
  return slugify(input).replace(/-/g, " ").trim();
}

/** Các trường dẫn xuất phải cập nhật mỗi khi lưu sản phẩm */
export function productDerivedFields(p: { name: string; sku?: string | null; price: number; salePrice?: number | null }) {
  const finalPrice = p.salePrice != null && p.salePrice < p.price ? p.salePrice : p.price;
  return {
    finalPrice,
    searchText: normalizeSearch([p.name, p.sku].filter(Boolean).join(" ")),
  };
}
