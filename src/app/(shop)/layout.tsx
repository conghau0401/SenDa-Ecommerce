import { Toaster } from "sonner";
import { getSettings } from "@/lib/settings";
import { SiteHeader } from "@/components/shop/site-header";
import { SiteFooter } from "@/components/shop/site-footer";
import { CartDrawer } from "@/components/cart/cart-drawer";

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const { shipping } = await getSettings();
  return (
    <>
      <SiteHeader />
      <main id="main" className="min-h-[60vh]">
        {children}
      </main>
      <SiteFooter />
      <CartDrawer shipping={shipping} />
      <Toaster
        position="top-center"
        richColors
        closeButton
        toastOptions={{ className: "font-sans", duration: 2500 }}
      />
    </>
  );
}
