import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { OrderLookup } from "@/components/order/order-lookup";

export const metadata: Metadata = {
  title: "Tra cứu đơn hàng",
  description: "Nhập số điện thoại và mã đơn để xem trạng thái đơn hàng của bạn.",
  alternates: { canonical: "/tra-cuu-don-hang" },
};

type Props = { searchParams: Promise<{ ma?: string }> };

export default async function OrderLookupPage({ searchParams }: Props) {
  const [{ ma }, { bank }] = await Promise.all([searchParams, getSettings()]);
  return (
    <div className="container-page py-6 sm:py-10">
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs items={[{ label: "Tra cứu đơn hàng" }]} />
        <header className="mt-4 mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-leaf-900 sm:text-4xl">Tra cứu đơn hàng</h1>
          <p className="mt-2 text-muted">Nhập số điện thoại đặt hàng và mã đơn (VD: SD261003-7K2F) để xem trạng thái.</p>
        </header>
        <OrderLookup defaultCode={ma?.slice(0, 30) ?? ""} bank={bank} />
      </div>
    </div>
  );
}
