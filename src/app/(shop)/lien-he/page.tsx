import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { getSettings } from "@/lib/settings";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { ContactForm } from "@/components/shop/contact-form";

export const metadata: Metadata = {
  title: "Liên hệ",
  description: "Liên hệ shop để được tư vấn chọn cây, chăm sóc sen đá hoặc đặt hàng số lượng lớn.",
  alternates: { canonical: "/lien-he" },
};

/** Chỉ cho phép nhúng bản đồ từ Google Maps */
function safeMapUrl(url: string): string | null {
  try {
    const u = new URL(url);
    return u.protocol === "https:" && /(^|\.)google\.[a-z.]+$/.test(u.hostname) ? u.toString() : null;
  } catch {
    return null;
  }
}

export default async function ContactPage() {
  const { store } = await getSettings();
  const mapUrl = safeMapUrl(store.mapEmbedUrl);

  const info = [
    store.address && { Icon: MapPin, label: "Địa chỉ", value: store.address },
    store.phone && { Icon: Phone, label: "Hotline", value: store.phone, href: `tel:${store.phone.replace(/\s/g, "")}` },
    store.email && { Icon: Mail, label: "Email", value: store.email, href: `mailto:${store.email}` },
    store.workingHours && { Icon: Clock, label: "Giờ mở cửa", value: store.workingHours },
  ].filter(Boolean) as { Icon: typeof MapPin; label: string; value: string; href?: string }[];

  return (
    <div className="container-page py-6 sm:py-10">
      <Breadcrumbs items={[{ label: "Liên hệ" }]} />
      <header className="mt-4 mb-10 max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-leaf-900 sm:text-4xl">Liên hệ với chúng tôi</h1>
        <p className="mt-2 text-muted">
          Cần tư vấn chọn cây, cách chăm sóc hay đặt quà số lượng lớn? Để lại lời nhắn, shop sẽ phản hồi trong vòng 24 giờ.
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="space-y-4 lg:col-span-2">
          <ul className="space-y-3">
            {info.map(({ Icon, label, value, href }) => (
              <li key={label} className="flex gap-4 rounded-2xl bg-surface p-4 shadow-soft ring-1 ring-border/60">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-leaf-50 text-leaf-700">
                  <Icon className="size-5" aria-hidden />
                </span>
                <div>
                  <p className="text-sm text-muted">{label}</p>
                  {href ? (
                    <a href={href} className="font-semibold text-leaf-900 hover:text-leaf-700">
                      {value}
                    </a>
                  ) : (
                    <p className="font-semibold text-leaf-900">{value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
          {mapUrl && (
            <div className="overflow-hidden rounded-2xl shadow-soft ring-1 ring-border/60">
              <iframe
                src={mapUrl}
                title={`Bản đồ đường đến ${store.name}`}
                className="aspect-[4/3] w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          )}
        </div>

        <div className="rounded-[1.5rem] bg-surface p-6 shadow-soft ring-1 ring-border/60 sm:p-8 lg:col-span-3">
          <h2 className="mb-6 text-xl font-bold text-leaf-900">Gửi lời nhắn</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
