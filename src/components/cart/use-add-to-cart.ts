"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { useCart, type CartItem } from "@/store/cart";
import { flyToCart, resolveFlyImage } from "./fly-to-cart";

/**
 * Thêm vào giỏ kèm hiệu ứng fly-to-cart:
 * kiểm tra tồn kho ngay -> ảnh bay về icon giỏ -> cập nhật giỏ (badge + icon nảy) -> toast.
 * Trả về false nếu không thể thêm (đã đạt giới hạn tồn kho).
 */
export function useAddToCart() {
  const add = useCart((s) => s.add);
  const open = useCart((s) => s.open);

  return useCallback(
    (product: Omit<CartItem, "quantity">, quantity = 1, source?: HTMLElement | null, origin?: HTMLElement | null) => {
      const current = useCart.getState().items.find((i) => i.productId === product.productId)?.quantity ?? 0;
      if (current >= Math.min(product.stock, 99)) {
        toast.warning(`Giỏ hàng đã có tối đa ${current} "${product.name}" (giới hạn tồn kho)`);
        return false;
      }

      const commit = () => {
        const { added, capped } = add(product, quantity);
        if (added === 0) return;
        const action = { label: "Xem giỏ", onClick: open };
        if (capped) toast.info(`Chỉ thêm được ${added} sản phẩm do giới hạn tồn kho`, { action });
        else toast.success(`Đã thêm "${product.name}" vào giỏ`, { action });
      };

      const img = resolveFlyImage(source);
      if (img) void flyToCart(img, origin).then(commit);
      else commit();
      return true;
    },
    [add, open],
  );
}
