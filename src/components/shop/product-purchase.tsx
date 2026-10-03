"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ShoppingBag, Zap } from "lucide-react";
import type { CartItem } from "@/store/cart";
import { useAddToCart } from "../cart/use-add-to-cart";
import { Button } from "../ui/button";
import { Price } from "../ui/price";
import { QuantityPicker } from "../ui/quantity-picker";

type Props = {
  product: Omit<CartItem, "quantity">;
  price: number;
  salePrice: number | null;
};

/** Chọn số lượng + Thêm vào giỏ + Mua ngay, kèm thanh sticky trên mobile */
export function ProductPurchase({ product, price, salePrice }: Props) {
  const router = useRouter();
  const addToCart = useAddToCart();
  const [qty, setQty] = useState(1);
  const actionsRef = useRef<HTMLDivElement>(null);
  const [actionsVisible, setActionsVisible] = useState(true);
  const outOfStock = product.stock <= 0;

  // Chỉ hiện thanh sticky khi cụm nút chính đã khuất khỏi màn hình
  useEffect(() => {
    const el = actionsRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setActionsVisible(entry.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const flySource = () => document.querySelector<HTMLElement>("[data-fly-image]");

  const handleAdd = () => addToCart(product, qty, flySource());

  const handleBuyNow = () => {
    addToCart(product, qty, null);
    router.push("/thanh-toan");
  };

  if (outOfStock) {
    return (
      <div className="rounded-2xl bg-sand p-4 text-center">
        <p className="font-semibold text-leaf-900">Sản phẩm tạm hết hàng</p>
        <p className="mt-1 text-sm text-muted">Liên hệ shop để được báo khi có hàng trở lại.</p>
      </div>
    );
  }

  return (
    <>
      <div ref={actionsRef} className="space-y-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-muted">Số lượng</span>
          <QuantityPicker value={qty} onChange={setQty} max={Math.min(product.stock, 99)} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Button size="lg" variant="outline" onClick={handleAdd}>
            <ShoppingBag className="size-5" aria-hidden />
            Thêm vào giỏ
          </Button>
          <Button size="lg" onClick={handleBuyNow}>
            <Zap className="size-5" aria-hidden />
            Mua ngay
          </Button>
        </div>
      </div>

      {/* Thanh sticky dưới cùng trên mobile */}
      <AnimatePresence>
        {!actionsVisible && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 320 }}
            className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgb(31_42_34/0.08)] backdrop-blur lg:hidden"
          >
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-muted">{product.name}</p>
                <Price price={price} salePrice={salePrice} size="sm" />
              </div>
              <Button onClick={handleAdd} className="shrink-0">
                <ShoppingBag className="size-4" aria-hidden />
                Thêm vào giỏ
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
