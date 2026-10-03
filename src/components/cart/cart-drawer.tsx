"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ShoppingBag, Trash2, Truck, X } from "lucide-react";
import { selectCount, selectSubtotal, useCart } from "@/store/cart";
import { calcShippingFee, type Settings } from "@/lib/settings-schema";
import { formatVND } from "@/lib/format";
import { useDialog } from "@/hooks/use-dialog";
import { useCartSync } from "./use-cart-sync";
import { ButtonLink } from "../ui/button";
import { QuantityPicker } from "../ui/quantity-picker";

export function FreeShippingProgress({ subtotal, shipping }: { subtotal: number; shipping: Settings["shipping"] }) {
  if (shipping.freeThreshold <= 0 || subtotal <= 0) return null;
  const remaining = shipping.freeThreshold - subtotal;
  const pct = Math.min(100, (subtotal / shipping.freeThreshold) * 100);
  return (
    <div className="rounded-2xl bg-leaf-50 p-3.5">
      <p className="flex items-center gap-2 text-sm text-leaf-900">
        <Truck className="size-4 shrink-0 text-leaf-600" aria-hidden />
        {remaining > 0 ? (
          <span>
            Mua thêm <strong>{formatVND(remaining)}</strong> để được <strong>miễn phí giao hàng</strong>
          </span>
        ) : (
          <span className="font-semibold">Đơn hàng của bạn được miễn phí giao hàng 🎉</span>
        )}
      </p>
      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-leaf-200" aria-hidden>
        <motion.div className="h-full rounded-full bg-leaf-600" initial={false} animate={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function CartDrawer({ shipping }: { shipping: Settings["shipping"] }) {
  const isOpen = useCart((s) => s.isOpen);
  const close = useCart((s) => s.close);
  const items = useCart((s) => s.items);
  const count = useCart(selectCount);
  const subtotal = useCart(selectSubtotal);
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);
  const pathname = usePathname();
  const dialogRef = useDialog<HTMLDivElement>(isOpen, close);

  // Cập nhật giá/tồn kho mới nhất mỗi khi mở giỏ
  useCartSync(isOpen);

  // Đóng giỏ khi chuyển trang
  useEffect(() => {
    close();
  }, [pathname, close]);

  const shippingFee = calcShippingFee(subtotal, shipping);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          <motion.div
            className="absolute inset-0 cursor-pointer bg-leaf-900/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            aria-hidden
          />
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-background shadow-lift"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
          >
            <header className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5">
              <h2 id="cart-title" className="flex items-center gap-2 text-lg font-bold text-leaf-900">
                <ShoppingBag className="size-5" aria-hidden />
                Giỏ hàng
                {count > 0 && <span className="text-sm font-medium text-muted">({count})</span>}
              </h2>
              <button
                type="button"
                onClick={close}
                className="flex size-10 items-center justify-center rounded-full hover:bg-leaf-50"
                aria-label="Đóng giỏ hàng"
                data-autofocus
              >
                <X className="size-5" />
              </button>
            </header>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
                <div className="flex size-20 items-center justify-center rounded-full bg-leaf-50 text-leaf-600">
                  <ShoppingBag className="size-9" aria-hidden />
                </div>
                <p className="mt-5 text-lg font-semibold text-leaf-900">Giỏ hàng đang trống</p>
                <p className="mt-1 text-sm text-muted">Hãy chọn vài chậu sen đá xinh xắn cho góc nhỏ của bạn nhé!</p>
                <ButtonLink href="/san-pham" className="mt-6" onClick={close}>
                  Khám phá sản phẩm
                </ButtonLink>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  <FreeShippingProgress subtotal={subtotal} shipping={shipping} />
                  <ul className="mt-2 divide-y divide-border">
                    <AnimatePresence initial={false}>
                      {items.map((item) => (
                        <motion.li
                          key={item.productId}
                          layout
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }}
                          className="overflow-hidden"
                        >
                          <div className="flex gap-3.5 py-4">
                            <Link
                              href={`/san-pham/${item.slug}`}
                              className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-sand"
                              tabIndex={-1}
                              aria-hidden
                            >
                              {item.image && <Image src={item.image} alt="" fill sizes="80px" className="object-cover" />}
                            </Link>
                            <div className="flex min-w-0 flex-1 flex-col">
                              <div className="flex items-start justify-between gap-2">
                                <Link
                                  href={`/san-pham/${item.slug}`}
                                  className="line-clamp-2 text-sm leading-snug font-semibold hover:text-leaf-700"
                                >
                                  {item.name}
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => remove(item.productId)}
                                  className="-mt-1 -mr-1 flex size-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-red-50 hover:text-danger"
                                  aria-label={`Xóa ${item.name} khỏi giỏ`}
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              </div>
                              <p className="mt-0.5 text-sm text-muted">{formatVND(item.price)}</p>
                              <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                                <QuantityPicker
                                  size="sm"
                                  value={item.quantity}
                                  max={Math.min(item.stock, 99)}
                                  onChange={(v) => setQuantity(item.productId, v)}
                                  label={`Số lượng ${item.name}`}
                                />
                                <p className="font-bold text-leaf-800 tabular-nums">{formatVND(item.price * item.quantity)}</p>
                              </div>
                              {item.quantity >= item.stock && (
                                <p className="mt-1 text-xs text-warning">Đã đạt số lượng tồn kho</p>
                              )}
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                </div>

                <footer className="shrink-0 space-y-3 border-t border-border bg-surface px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                  <dl className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-muted">Tạm tính</dt>
                      <dd className="font-medium tabular-nums">{formatVND(subtotal)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-muted">Phí giao hàng</dt>
                      <dd className="font-medium tabular-nums">{shippingFee === 0 ? "Miễn phí" : formatVND(shippingFee)}</dd>
                    </div>
                    <div className="flex justify-between border-t border-dashed border-border pt-2 text-base">
                      <dt className="font-semibold">Tổng cộng</dt>
                      <dd className="text-lg font-bold text-leaf-800 tabular-nums">{formatVND(subtotal + shippingFee)}</dd>
                    </div>
                  </dl>
                  <ButtonLink href="/thanh-toan" size="lg" className="w-full" onClick={close}>
                    Thanh toán
                  </ButtonLink>
                  <button type="button" onClick={close} className="w-full py-1 text-sm font-medium text-leaf-700 hover:underline">
                    Tiếp tục mua sắm
                  </button>
                </footer>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
