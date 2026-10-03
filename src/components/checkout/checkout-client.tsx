"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AlertTriangle, Banknote, Landmark, Lock, ShoppingBag } from "lucide-react";
import { placeOrder } from "@/actions/order";
import { selectSubtotal, useCart } from "@/store/cart";
import { calcShippingFee, type Settings } from "@/lib/settings-schema";
import { formatVND } from "@/lib/format";
import { customerSchema } from "@/lib/validators/order";
import { fieldErrors } from "@/lib/validators/common";
import type { PaymentMethod } from "@/lib/constants";
import { useMounted } from "@/hooks/use-mounted";
import { cn } from "@/lib/utils";
import { useCartSync } from "../cart/use-cart-sync";
import { FreeShippingProgress } from "../cart/cart-drawer";
import { Button, ButtonLink } from "../ui/button";
import { EmptyState } from "../ui/empty-state";
import { FormField, fieldAria, inputClass } from "../ui/form-field";
import { Skeleton } from "../ui/skeleton";

const CUSTOMER_KEY = "senda-customer";

type Values = { customerName: string; phone: string; address: string; note: string };
type StockIssue = { productId: number; name: string; available: number };

export function CheckoutClient({ shipping, bankAvailable }: { shipping: Settings["shipping"]; bankAvailable: boolean }) {
  const router = useRouter();
  const mounted = useMounted();
  const items = useCart((s) => s.items);
  const subtotal = useCart(selectSubtotal);
  const [values, setValues] = useState<Values>({ customerName: "", phone: "", address: "", note: "" });
  const [payment, setPayment] = useState<PaymentMethod>("COD");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [stockIssues, setStockIssues] = useState<StockIssue[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  // Lấy giá/tồn kho mới nhất khi vào trang
  const syncing = useCartSync(mounted);

  // Điền sẵn thông tin khách đã đặt trước đó trên máy này
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(CUSTOMER_KEY) ?? "null");
      if (saved) setValues((v) => ({ ...v, customerName: saved.customerName ?? "", phone: saved.phone ?? "", address: saved.address ?? "" }));
    } catch {
      /* bỏ qua dữ liệu hỏng */
    }
  }, []);

  const set = (key: keyof Values) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (errors[key]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const focusFirstError = (errs: Record<string, string>) => {
    const first = (["customerName", "phone", "address", "note"] as const).find((k) => errs[k]);
    if (first) formRef.current?.querySelector<HTMLElement>(`#checkout-${first}`)?.focus();
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setStockIssues([]);

    const local = customerSchema.safeParse(values);
    if (!local.success) {
      const errs = fieldErrors(local.error);
      setErrors(errs);
      focusFirstError(errs);
      return;
    }

    setSubmitting(true);
    try {
      const result = await placeOrder({
        ...values,
        paymentMethod: payment,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      });

      if (result.ok) {
        setRedirecting(true);
        localStorage.setItem(
          CUSTOMER_KEY,
          JSON.stringify({ customerName: values.customerName, phone: values.phone, address: values.address }),
        );
        router.replace(`/dat-hang-thanh-cong/${result.code}`);
        useCart.getState().clear();
        return;
      }

      if (result.errors) {
        setErrors(result.errors);
        focusFirstError(result.errors);
      }
      if (result.stockIssues?.length) {
        setStockIssues(result.stockIssues);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      toast.error(result.message);
    } catch {
      toast.error("Mất kết nối, vui lòng thử lại");
    } finally {
      setSubmitting(false);
    }
  };

  /** Điều chỉnh giỏ theo tồn kho thực tế sau khi server báo thiếu hàng */
  const applyStockIssues = () => {
    const cart = useCart.getState();
    for (const issue of stockIssues) {
      if (issue.available <= 0) cart.remove(issue.productId);
      else cart.setQuantity(issue.productId, issue.available);
    }
    setStockIssues([]);
    toast.success("Đã cập nhật giỏ hàng theo tồn kho");
  };

  if (!mounted) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_420px]">
        <Skeleton className="h-[520px] rounded-[1.5rem]" />
        <Skeleton className="h-[420px] rounded-[1.5rem]" />
      </div>
    );
  }

  if (redirecting) {
    return (
      <div className="flex flex-col items-center py-20 text-center" role="status">
        <span className="size-10 animate-spin rounded-full border-4 border-leaf-200 border-t-leaf-600" aria-hidden />
        <p className="mt-4 font-medium text-leaf-900">Đang hoàn tất đơn hàng...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="Giỏ hàng của bạn đang trống"
        description="Thêm vài chậu sen đá vào giỏ rồi quay lại thanh toán nhé."
        action={<ButtonLink href="/san-pham">Mua sắm ngay</ButtonLink>}
      />
    );
  }

  const shippingFee = calcShippingFee(subtotal, shipping);
  const total = subtotal + shippingFee;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="grid items-start gap-8 lg:grid-cols-[1fr_420px]">
      <div className="space-y-6">
        {stockIssues.length > 0 && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5" role="alert">
            <p className="flex items-center gap-2 font-semibold text-amber-900">
              <AlertTriangle className="size-5" aria-hidden /> Một số sản phẩm không đủ số lượng
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-7 text-sm text-amber-900">
              {stockIssues.map((s) => (
                <li key={s.productId}>
                  {s.name}: {s.available > 0 ? `chỉ còn ${s.available}` : "đã hết hàng"}
                </li>
              ))}
            </ul>
            <Button variant="secondary" size="sm" className="mt-3" onClick={applyStockIssues}>
              Cập nhật giỏ hàng
            </Button>
          </div>
        )}

        <section className="rounded-[1.5rem] bg-surface p-5 shadow-soft ring-1 ring-border/60 sm:p-7">
          <h2 className="mb-5 text-lg font-bold text-leaf-900">Thông tin nhận hàng</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField id="checkout-customerName" label="Họ và tên" required error={errors.customerName}>
              <input
                {...fieldAria("checkout-customerName", errors.customerName)}
                value={values.customerName}
                onChange={set("customerName")}
                autoComplete="name"
                className={inputClass}
                placeholder="Nguyễn Văn A"
              />
            </FormField>
            <FormField id="checkout-phone" label="Số điện thoại" required error={errors.phone}>
              <input
                {...fieldAria("checkout-phone", errors.phone)}
                value={values.phone}
                onChange={set("phone")}
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                className={inputClass}
                placeholder="0901 234 567"
              />
            </FormField>
            <FormField
              id="checkout-address"
              label="Địa chỉ nhận hàng"
              required
              error={errors.address}
              hint="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
              className="sm:col-span-2"
            >
              <textarea
                {...fieldAria("checkout-address", errors.address)}
                value={values.address}
                onChange={set("address")}
                rows={3}
                autoComplete="street-address"
                className={inputClass}
                placeholder="VD: 12 Nguyễn Huệ, P. Bến Nghé, Q.1, TP. Hồ Chí Minh"
              />
            </FormField>
            <FormField id="checkout-note" label="Ghi chú (không bắt buộc)" error={errors.note} className="sm:col-span-2">
              <textarea
                {...fieldAria("checkout-note", errors.note)}
                value={values.note}
                onChange={set("note")}
                rows={2}
                className={inputClass}
                placeholder="VD: Giao giờ hành chính, gọi trước khi giao..."
              />
            </FormField>
          </div>
        </section>

        <section className="rounded-[1.5rem] bg-surface p-5 shadow-soft ring-1 ring-border/60 sm:p-7">
          <fieldset>
            <legend className="mb-4 text-lg font-bold text-leaf-900">Phương thức thanh toán</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  value: "COD" as const,
                  title: "Thanh toán khi nhận hàng",
                  desc: "Trả tiền mặt cho shipper (COD)",
                  Icon: Banknote,
                },
                ...(bankAvailable
                  ? [
                      {
                        value: "BANK_TRANSFER" as const,
                        title: "Chuyển khoản ngân hàng",
                        desc: "Hiện STK & mã QR sau khi đặt",
                        Icon: Landmark,
                      },
                    ]
                  : []),
              ].map((opt) => (
                <label
                  key={opt.value}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition-all has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-leaf-300",
                    payment === opt.value ? "border-leaf-600 bg-leaf-50" : "border-border hover:border-leaf-300",
                  )}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={opt.value}
                    checked={payment === opt.value}
                    onChange={() => setPayment(opt.value)}
                    className="sr-only"
                  />
                  <span
                    className={cn(
                      "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2",
                      payment === opt.value ? "border-leaf-600" : "border-border",
                    )}
                    aria-hidden
                  >
                    {payment === opt.value && <span className="size-2.5 rounded-full bg-leaf-600" />}
                  </span>
                  <span className="flex-1">
                    <span className="flex items-center gap-2 font-semibold">
                      <opt.Icon className="size-4 text-leaf-700" aria-hidden />
                      {opt.title}
                    </span>
                    <span className="mt-0.5 block text-sm text-muted">{opt.desc}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </section>
      </div>

      <aside className="rounded-[1.5rem] bg-surface p-5 shadow-soft ring-1 ring-border/60 sm:p-7 lg:sticky lg:top-24">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-leaf-900">
          <ShoppingBag className="size-5" aria-hidden />
          Đơn hàng ({items.reduce((n, i) => n + i.quantity, 0)} sản phẩm)
        </h2>
        <ul className={cn("max-h-72 divide-y divide-border overflow-y-auto pr-1", syncing && "opacity-60")}>
          {items.map((it) => (
            <li key={it.productId} className="flex items-center gap-3 py-3">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-sand">
                {it.image && <Image src={it.image} alt="" fill sizes="56px" className="object-cover" />}
                <span className="absolute top-0 right-0 flex size-5 items-center justify-center rounded-bl-lg bg-leaf-800 text-[11px] font-bold text-white">
                  {it.quantity}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-sm font-medium">{it.name}</p>
                <p className="text-xs text-muted">{formatVND(it.price)}</p>
              </div>
              <p className="text-sm font-semibold tabular-nums">{formatVND(it.price * it.quantity)}</p>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => useCart.getState().open()}
          className="mt-1 text-sm font-medium text-leaf-700 hover:underline"
        >
          Chỉnh sửa giỏ hàng
        </button>

        <div className="mt-4">
          <FreeShippingProgress subtotal={subtotal} shipping={shipping} />
        </div>

        <dl className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Tạm tính</dt>
            <dd className="tabular-nums">{formatVND(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Phí giao hàng</dt>
            <dd className="tabular-nums">{shippingFee === 0 ? "Miễn phí" : formatVND(shippingFee)}</dd>
          </div>
          <div className="flex items-baseline justify-between border-t border-dashed border-border pt-3">
            <dt className="text-base font-semibold">Tổng cộng</dt>
            <dd className="text-2xl font-bold text-leaf-800 tabular-nums">{formatVND(total)}</dd>
          </div>
        </dl>

        <Button type="submit" size="lg" className="mt-5 w-full" loading={submitting} disabled={syncing}>
          {submitting ? "Đang đặt hàng..." : `Đặt hàng • ${formatVND(total)}`}
        </Button>
        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted">
          <Lock className="size-3.5" aria-hidden /> Thông tin của bạn chỉ dùng để giao hàng
        </p>
      </aside>
    </form>
  );
}
