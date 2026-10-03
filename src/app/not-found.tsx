import type { Metadata } from "next";
import { SiteHeader } from "@/components/shop/site-header";
import { SiteFooter } from "@/components/shop/site-footer";
import { NotFoundContent } from "@/components/shop/not-found-content";

export const metadata: Metadata = { title: "Không tìm thấy trang" };

// 404 cho URL không khớp route nào (render ngoài layout (shop) nên tự thêm header/footer)
export default function GlobalNotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <NotFoundContent />
      </main>
      <SiteFooter />
    </>
  );
}
