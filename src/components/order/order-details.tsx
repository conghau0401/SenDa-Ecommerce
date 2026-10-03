import Image from "next/image";
import Link from "next/link";
import { MapPin, NotebookPen, Phone, User, Wallet } from "lucide-react";
import type { CustomerOrder } from "@/lib/orders";
import { PAYMENT_METHOD_LABEL, type PaymentMethod } from "@/lib/constants";
import { formatDateTime, formatVND } from "@/lib/format";

export function OrderItemsSummary({ order }: { order: Pick<CustomerOrder, "items" | "subtotal" | "shippingFee" | "total"> }) {
  return (
    <div>
      <ul className="divide-y divide-border">
        {order.items.map((it, i) => (
          <li key={i} className="flex items-center gap-3 py-3">
            <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-sand">
              {it.productImage && <Image src={it.productImage} alt="" fill sizes="56px" className="object-cover" />}
              <span className="absolute -top-0 -right-0 flex size-5 items-center justify-center rounded-bl-lg bg-leaf-800 text-[11px] font-bold text-white">
                {it.quantity}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              {it.product?.slug ? (
                <Link href={`/san-pham/${it.product.slug}`} className="line-clamp-1 text-sm font-medium hover:text-leaf-700">
                  {it.productName}
                </Link>
              ) : (
                <p className="line-clamp-1 text-sm font-medium">{it.productName}</p>
              )}
              <p className="text-xs text-muted">
                {formatVND(it.price)} × {it.quantity}
              </p>
            </div>
            <p className="text-sm font-semibold tabular-nums">{formatVND(it.price * it.quantity)}</p>
          </li>
        ))}
      </ul>
      <dl className="mt-2 space-y-1.5 border-t border-border pt-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">Tạm tính</dt>
          <dd className="tabular-nums">{formatVND(order.subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Phí giao hàng</dt>
          <dd className="tabular-nums">{order.shippingFee === 0 ? "Miễn phí" : formatVND(order.shippingFee)}</dd>
        </div>
        <div className="flex justify-between pt-1 text-base">
          <dt className="font-semibold">Tổng cộng</dt>
          <dd className="text-lg font-bold text-leaf-800 tabular-nums">{formatVND(order.total)}</dd>
        </div>
      </dl>
    </div>
  );
}

export function OrderShippingInfo({ order }: { order: CustomerOrder }) {
  const rows = [
    { Icon: User, label: "Người nhận", value: order.customerName },
    { Icon: Phone, label: "Số điện thoại", value: order.phone },
    { Icon: MapPin, label: "Địa chỉ", value: order.address },
    { Icon: Wallet, label: "Thanh toán", value: PAYMENT_METHOD_LABEL[order.paymentMethod as PaymentMethod] ?? order.paymentMethod },
    ...(order.note ? [{ Icon: NotebookPen, label: "Ghi chú", value: order.note }] : []),
  ];
  return (
    <dl className="space-y-3 text-sm">
      {rows.map(({ Icon, label, value }) => (
        <div key={label} className="flex gap-3">
          <Icon className="mt-0.5 size-4 shrink-0 text-leaf-600" aria-hidden />
          <div>
            <dt className="text-xs text-muted">{label}</dt>
            <dd className="font-medium break-words whitespace-pre-line">{value}</dd>
          </div>
        </div>
      ))}
      <p className="pt-1 text-xs text-muted">Đặt lúc {formatDateTime(order.createdAt)}</p>
    </dl>
  );
}
