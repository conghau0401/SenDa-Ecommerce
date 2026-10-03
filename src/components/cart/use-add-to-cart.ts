"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { useCart, type CartItem } from "@/store/cart";

/**
 * Thêm vào giỏ + thông báo.
 * `source` là phần tử bắt đầu hiệu ứng fly-to-cart (bổ sung ở giai đoạn 3).
 */
export function useAddToCart() {
  const add = useCart((s) => s.add);

  return useCallback(
    (product: Omit<CartItem, "quantity">, quantity = 1, _source?: HTMLElement | null) => {
      void _source;
      const { added, capped } = add(product, quantity);
      if (added === 0) {
        toast.warning(`Bạn đã có tối đa ${product.stock} "${product.name}" trong giỏ`);
        return false;
      }
      if (capped) toast.info(`Chỉ thêm được ${added} sản phẩm do giới hạn tồn kho`);
      else toast.success(`Đã thêm "${product.name}" vào giỏ`);
      return true;
    },
    [add],
  );
}
