"use client";

import { ShoppingBag } from "lucide-react";
import { selectCount, useCart } from "@/store/cart";
import { useMounted } from "@/hooks/use-mounted";

/** Icon giỏ hàng trên header – cũng là đích của hiệu ứng fly-to-cart (data-cart-target) */
export function CartButton() {
  const mounted = useMounted();
  const count = useCart(selectCount);
  const bumpKey = useCart((s) => s.bumpKey);
  const open = useCart((s) => s.open);
  const shown = mounted ? count : 0;

  return (
    <button
      type="button"
      onClick={open}
      data-cart-target
      className="relative flex size-10 items-center justify-center rounded-full text-leaf-900 hover:bg-leaf-50"
      aria-label={`Giỏ hàng, ${shown} sản phẩm`}
    >
      <span key={bumpKey} className={bumpKey > 0 ? "animate-cart-bump" : undefined}>
        <ShoppingBag className="size-[22px]" />
      </span>
      {shown > 0 && (
        <span
          key={`badge-${bumpKey}`}
          className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 animate-cart-bump items-center justify-center rounded-full bg-sale px-1 text-[11px] font-bold text-white ring-2 ring-background"
          aria-hidden
        >
          {shown > 99 ? "99+" : shown}
        </span>
      )}
    </button>
  );
}
