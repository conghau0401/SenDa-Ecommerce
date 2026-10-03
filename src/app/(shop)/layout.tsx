import { Toaster } from "sonner";
import { SiteHeader } from "@/components/shop/site-header";
import { SiteFooter } from "@/components/shop/site-footer";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="main" className="min-h-[60vh]">
        {children}
      </main>
      <SiteFooter />
      <Toaster
        position="top-center"
        richColors
        closeButton
        toastOptions={{ className: "font-sans", duration: 2500 }}
      />
    </>
  );
}
