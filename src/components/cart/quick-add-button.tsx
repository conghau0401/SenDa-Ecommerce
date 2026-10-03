"use client";

import { useRef } from "react";
import { Plus } from "lucide-react";
import type { CartItem } from "@/store/cart";
import { useAddToCart } from "./use-add-to-cart";

/** Nút "+" nhỏ trên thẻ sản phẩm */
export function QuickAddButton({ product }: { product: Omit<CartItem, "quantity"> }) {
  const ref = useRef<HTMLButtonElement>(null);
  const addToCart = useAddToCart();

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => addToCart(product, 1, ref.current)}
      className="relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full bg-leaf-100 text-leaf-800 transition-all hover:scale-110 hover:bg-primary hover:text-white active:scale-95"
      aria-label={`Thêm ${product.name} vào giỏ`}
    >
      <Plus className="size-5" />
    </button>
  );
}
