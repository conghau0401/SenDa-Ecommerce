"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartItem = {
  productId: number;
  slug: string;
  name: string;
  image: string | null;
  /** Giá thực bán tại thời điểm thêm (server sẽ tính lại khi đặt hàng) */
  price: number;
  /** Tồn kho đã biết – giới hạn số lượng ở client */
  stock: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  /** Tăng mỗi lần thêm vào giỏ – để icon giỏ hàng chạy hiệu ứng nảy */
  bumpKey: number;
  add: (item: Omit<CartItem, "quantity">, quantity?: number) => { added: number; capped: boolean };
  setQuantity: (productId: number, quantity: number) => void;
  remove: (productId: number) => void;
  clear: () => void;
  /** Cập nhật giá/tồn kho mới nhất từ server */
  sync: (latest: { productId: number; price: number; stock: number; name: string; image: string | null }[]) => void;
  open: () => void;
  close: () => void;
};

const clampQty = (qty: number, stock: number) => Math.max(1, Math.min(Math.floor(qty) || 1, Math.max(stock, 1), 99));

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      bumpKey: 0,

      add: (item, quantity = 1) => {
        const existing = get().items.find((i) => i.productId === item.productId);
        const current = existing?.quantity ?? 0;
        const target = Math.min(current + quantity, item.stock, 99);
        const added = Math.max(0, target - current);
        if (added > 0) {
          set((s) => ({
            bumpKey: s.bumpKey + 1,
            items: existing
              ? s.items.map((i) => (i.productId === item.productId ? { ...i, ...item, quantity: target } : i))
              : [...s.items, { ...item, quantity: target }],
          }));
        }
        return { added, capped: current + quantity > target };
      },

      setQuantity: (productId, quantity) =>
        set((s) => ({
          items: s.items.map((i) => (i.productId === productId ? { ...i, quantity: clampQty(quantity, i.stock) } : i)),
        })),

      remove: (productId) => set((s) => ({ items: s.items.filter((i) => i.productId !== productId) })),

      clear: () => set({ items: [] }),

      sync: (latest) =>
        set((s) => {
          const map = new Map(latest.map((l) => [l.productId, l]));
          return {
            items: s.items
              .filter((i) => map.has(i.productId)) // sản phẩm đã bị ẩn/xóa
              .map((i) => {
                const l = map.get(i.productId)!;
                return { ...i, price: l.price, stock: l.stock, name: l.name, image: l.image, quantity: Math.min(i.quantity, Math.max(l.stock, 0)) };
              })
              .filter((i) => i.quantity > 0),
          };
        }),

      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    {
      name: "senda-cart",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ items: s.items }),
    },
  ),
);

// Đồng bộ giữa các tab: khi tab khác thay đổi giỏ, nạp lại để tab này không ghi đè bằng dữ liệu cũ
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === "senda-cart") void useCart.persist.rehydrate();
  });
}

export const selectCount =(s: CartState) => s.items.reduce((n, i) => n + i.quantity, 0);
export const selectSubtotal = (s: CartState) => s.items.reduce((n, i) => n + i.price * i.quantity, 0);
