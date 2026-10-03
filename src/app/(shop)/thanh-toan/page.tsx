import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { CheckoutClient } from "@/components/checkout/checkout-client";

export const metadata: Metadata = {
  title: "Thanh toán",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const { shipping, bank } = await getSettings();
  return (
    <div className="container-page py-6 sm:py-10">
      <Breadcrumbs items={[{ label: "Thanh toán" }]} />
      <h1 className="mt-4 mb-8 text-3xl font-bold tracking-tight text-leaf-900 sm:text-4xl">Thanh toán</h1>
      <CheckoutClient shipping={shipping} bankAvailable={!!bank.accountNumber} />
    </div>
  );
}
