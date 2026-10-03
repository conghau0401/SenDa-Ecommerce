import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Banknote, Search } from "lucide-react";
import { getSettings } from "@/lib/settings";
import { getRecentOrderCodes } from "@/lib/recent-orders";
import { getOrderForCustomer } from "@/lib/orders";
import { formatVND } from "@/lib/format";
import { SuccessCheck } from "@/components/order/success-check";
import { OrderItemsSummary, OrderShippingInfo } from "@/components/order/order-details";
import { BankTransferInfo } from "@/components/order/bank-transfer-info";
import { CopyButton } from "@/components/ui/copy-button";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Đặt hàng thành công",
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ code: string }> };

export default async function OrderSuccessPage({ params }: Props) {
  const code = decodeURIComponent((await params).code).toUpperCase();

  // Chỉ trình duyệt vừa đặt đơn mới xem được chi tiết; người khác chuyển sang trang tra cứu (cần SĐT)
  const recent = await getRecentOrderCodes();
  if (!recent.includes(code)) redirect(`/tra-cuu-don-hang?ma=${encodeURIComponent(code)}`);

  const [order, { bank, store }] = await Promise.all([getOrderForCustomer({ code }), getSettings()]);
  if (!order) redirect("/tra-cuu-don-hang");

  return (
    <div className="container-page py-10 sm:py-14">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col items-center text-center">
          <SuccessCheck />
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-leaf-900 sm:text-4xl">Đặt hàng thành công!</h1>
          <p className="mt-2 max-w-lg text-muted">
            Cảm ơn <strong className="text-foreground">{order.customerName}</strong> đã tin chọn {store.name}. Shop sẽ gọi
            xác nhận đơn trong thời gian sớm nhất.
          </p>
          <div className="mt-6 inline-flex items-center gap-3 rounded-2xl border border-leaf-200 bg-surface px-5 py-3 shadow-soft">
            <span className="text-sm text-muted">Mã đơn hàng</span>
            <span className="text-xl font-bold tracking-wider text-leaf-800">{order.code}</span>
            <CopyButton value={order.code} label="mã đơn hàng" />
          </div>
        </div>

        <div className="mt-10 space-y-6">
          {order.paymentMethod === "BANK_TRANSFER" ? (
            <BankTransferInfo bank={bank} amount={order.total} code={order.code} />
          ) : (
            <div className="flex items-start gap-3 rounded-[1.5rem] bg-leaf-50 p-5">
              <Banknote className="mt-0.5 size-6 shrink-0 text-leaf-700" aria-hidden />
              <div>
                <p className="font-semibold text-leaf-900">Thanh toán khi nhận hàng (COD)</p>
                <p className="mt-0.5 text-sm text-muted">
                  Vui lòng chuẩn bị <strong className="text-foreground">{formatVND(order.total)}</strong> khi nhận hàng.
                </p>
              </div>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-5">
            <section className="rounded-[1.5rem] bg-surface p-5 shadow-soft ring-1 ring-border/60 sm:p-6 md:col-span-3">
              <h2 className="mb-2 font-bold text-leaf-900">Tóm tắt đơn hàng</h2>
              <OrderItemsSummary order={order} />
            </section>
            <section className="rounded-[1.5rem] bg-surface p-5 shadow-soft ring-1 ring-border/60 sm:p-6 md:col-span-2">
              <h2 className="mb-4 font-bold text-leaf-900">Thông tin giao hàng</h2>
              <OrderShippingInfo order={order} />
            </section>
          </div>

          <div className="flex items-start gap-3 rounded-[1.5rem] border border-dashed border-leaf-300 p-5">
            <Search className="mt-0.5 size-5 shrink-0 text-leaf-600" aria-hidden />
            <p className="text-sm text-foreground/85">
              <strong>Theo dõi đơn hàng:</strong> vào trang{" "}
              <Link href={`/tra-cuu-don-hang?ma=${order.code}`} className="font-semibold text-leaf-700 underline">
                Tra cứu đơn hàng
              </Link>
              , nhập số điện thoại <strong>{order.phone}</strong> và mã đơn <strong>{order.code}</strong> để xem trạng
              thái bất cứ lúc nào.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <ButtonLink href="/san-pham">Tiếp tục mua sắm</ButtonLink>
            <ButtonLink href={`/tra-cuu-don-hang?ma=${order.code}`} variant="outline">
              Tra cứu đơn hàng
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
