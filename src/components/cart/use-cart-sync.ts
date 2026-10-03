"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getCartSnapshot } from "@/actions/order";
import { useCart } from "@/store/cart";

/**
 * Đồng bộ giỏ với server (giá, tồn kho, sản phẩm bị ẩn) khi `enabled` chuyển sang true.
 * Báo cho khách nếu có thay đổi.
 */
export function useCartSync(enabled: boolean) {
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const before = useCart.getState().items;
    if (before.length === 0) return;
    let cancelled = false;
    setSyncing(true);

    getCartSnapshot(before.map((i) => i.productId))
      .then((latest) => {
        if (cancelled) return;
        useCart.getState().sync(latest);
        const after = useCart.getState().items;
        const removed = before.filter((b) => !after.some((a) => a.productId === b.productId));
        const priceChanged = after.some((a) => before.find((b) => b.productId === a.productId)?.price !== a.price);
        const qtyReduced = after.some((a) => (before.find((b) => b.productId === a.productId)?.quantity ?? 0) > a.quantity);
        if (removed.length) toast.warning(`Đã bỏ ${removed.length} sản phẩm hết hàng hoặc ngừng bán khỏi giỏ`);
        if (priceChanged) toast.info("Giá một số sản phẩm đã được cập nhật");
        if (qtyReduced) toast.info("Số lượng một số sản phẩm đã được điều chỉnh theo tồn kho");
      })
      .catch(() => {
        /* Lỗi mạng: giữ nguyên giỏ, server vẫn kiểm tra lại khi đặt hàng */
      })
      .finally(() => !cancelled && setSyncing(false));

    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return syncing;
}
