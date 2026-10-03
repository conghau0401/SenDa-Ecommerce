"use client";

import { startTransition, useActionState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Search, SearchX } from "lucide-react";
import { lookupOrder } from "@/actions/order";
import type { Settings } from "@/lib/settings-schema";
import { formatDateTime } from "@/lib/format";
import { Button } from "../ui/button";
import { FormField, fieldAria, inputClass } from "../ui/form-field";
import { OrderStatusBadge, OrderTimeline } from "./order-status";
import { OrderItemsSummary, OrderShippingInfo } from "./order-details";
import { BankTransferInfo } from "./bank-transfer-info";

export function OrderLookup({ defaultCode, bank }: { defaultCode: string; bank: Settings["bank"] }) {
  const [state, action, pending] = useActionState(lookupOrder, null);
  const resultRef = useRef<HTMLDivElement>(null);
  const errors = state && !state.ok ? state.errors : undefined;
  const order = state?.ok ? state.data : undefined;

  useEffect(() => {
    if (order) resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [order]);

  return (
    <div className="space-y-8">
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          startTransition(() => action(data));
        }}
        className="rounded-[1.5rem] bg-surface p-5 shadow-soft ring-1 ring-border/60 sm:p-7"
      >
        <div className="grid gap-5 sm:grid-cols-[1fr_1fr_auto] sm:items-start">
          <FormField id="lookup-phone" label="Số điện thoại" required error={errors?.phone}>
            <input
              {...fieldAria("lookup-phone", errors?.phone)}
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              className={inputClass}
              placeholder="0901 234 567"
            />
          </FormField>
          <FormField id="lookup-code" label="Mã đơn hàng" required error={errors?.code}>
            <input
              {...fieldAria("lookup-code", errors?.code)}
              name="code"
              defaultValue={defaultCode}
              autoCapitalize="characters"
              className={`${inputClass} uppercase`}
              placeholder="SD261003-7K2F"
            />
          </FormField>
          <Button type="submit" size="lg" loading={pending} className="sm:mt-7">
            {!pending && <Search className="size-4" aria-hidden />}
            Tra cứu
          </Button>
        </div>
      </form>

      <div ref={resultRef} className="scroll-mt-24" aria-live="polite">
        <AnimatePresence mode="wait">
          {state && !state.ok && !state.errors && (
            <motion.div
              key="not-found"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center rounded-[1.5rem] bg-surface px-6 py-12 text-center shadow-soft ring-1 ring-border/60"
            >
              <SearchX className="size-10 text-muted" aria-hidden />
              <p className="mt-3 font-semibold text-leaf-900">{state.message}</p>
            </motion.div>
          )}
          {order && (
            <motion.div
              key={order.code}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <section className="rounded-[1.5rem] bg-surface p-5 shadow-soft ring-1 ring-border/60 sm:p-7">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-muted">Đơn hàng</p>
                    <p className="text-xl font-bold tracking-wider text-leaf-800">{order.code}</p>
                  </div>
                  <div className="text-right">
                    <OrderStatusBadge status={order.status} className="text-sm" />
                    <p className="mt-1 text-xs text-muted">Cập nhật {formatDateTime(order.updatedAt)}</p>
                  </div>
                </div>
                <OrderTimeline status={order.status} />
              </section>

              {order.paymentMethod === "BANK_TRANSFER" && order.status === "NEW" && (
                <BankTransferInfo bank={bank} amount={order.total} code={order.code} />
              )}

              <div className="grid gap-6 md:grid-cols-5">
                <section className="rounded-[1.5rem] bg-surface p-5 shadow-soft ring-1 ring-border/60 sm:p-6 md:col-span-3">
                  <h2 className="mb-2 font-bold text-leaf-900">Sản phẩm</h2>
                  <OrderItemsSummary order={order} />
                </section>
                <section className="rounded-[1.5rem] bg-surface p-5 shadow-soft ring-1 ring-border/60 sm:p-6 md:col-span-2">
                  <h2 className="mb-4 font-bold text-leaf-900">Giao hàng</h2>
                  <OrderShippingInfo order={order} />
                </section>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
