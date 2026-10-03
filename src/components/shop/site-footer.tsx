import Link from "next/link";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { getSettings } from "@/lib/settings";
import { getActiveCategories } from "@/lib/queries";
import { Logo } from "./logo";
import { FacebookIcon, InstagramIcon, TiktokIcon, YoutubeIcon, ZaloIcon } from "../ui/social-icons";

export async function SiteFooter() {
  const [{ store, social }, categories] = await Promise.all([getSettings(), getActiveCategories()]);

  const socials = [
    { href: social.facebook, label: "Facebook", Icon: FacebookIcon },
    { href: social.instagram, label: "Instagram", Icon: InstagramIcon },
    { href: social.tiktok, label: "TikTok", Icon: TiktokIcon },
    { href: social.youtube, label: "YouTube", Icon: YoutubeIcon },
    { href: social.zalo, label: "Zalo", Icon: ZaloIcon },
  ].filter((s) => s.href);

  return (
    <footer className="mt-20 bg-leaf-900 text-leaf-100">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="inline-flex rounded-2xl bg-background px-3 py-2">
            <Logo name={store.name} logo={store.logo} />
          </div>
          {store.slogan && <p className="mt-4 max-w-sm leading-relaxed text-leaf-100/80">{store.slogan}</p>}
          {socials.length > 0 && (
            <ul className="mt-6 flex gap-2" aria-label="Mạng xã hội">
              {socials.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex size-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-leaf-500 hover:text-white"
                  >
                    <Icon className="size-5" />
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="lg:col-span-2">
          <h2 className="mb-4 font-semibold text-white">Mua sắm</h2>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/san-pham" className="hover:text-white hover:underline">Tất cả sản phẩm</Link></li>
            <li><Link href="/san-pham?sap-xep=moi-nhat" className="hover:text-white hover:underline">Hàng mới về</Link></li>
            <li><Link href="/tra-cuu-don-hang" className="hover:text-white hover:underline">Tra cứu đơn hàng</Link></li>
            <li><Link href="/tin-tuc" className="hover:text-white hover:underline">Kiến thức chăm cây</Link></li>
            <li><Link href="/lien-he" className="hover:text-white hover:underline">Liên hệ</Link></li>
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h2 className="mb-4 font-semibold text-white">Danh mục</h2>
          <ul className="space-y-2.5 text-sm">
            {categories.slice(0, 6).map((c) => (
              <li key={c.slug}>
                <Link href={`/danh-muc/${c.slug}`} className="hover:text-white hover:underline">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-4">
          <h2 className="mb-4 font-semibold text-white">Liên hệ</h2>
          <ul className="space-y-3 text-sm">
            {store.address && (
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-leaf-300" aria-hidden />
                <span>{store.address}</span>
              </li>
            )}
            {store.phone && (
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-leaf-300" aria-hidden />
                <a href={`tel:${store.phone.replace(/\s/g, "")}`} className="hover:text-white">
                  {store.phone}
                </a>
              </li>
            )}
            {store.email && (
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-leaf-300" aria-hidden />
                <a href={`mailto:${store.email}`} className="hover:text-white">
                  {store.email}
                </a>
              </li>
            )}
            {store.workingHours && (
              <li className="flex gap-3">
                <Clock className="mt-0.5 size-4 shrink-0 text-leaf-300" aria-hidden />
                <span>{store.workingHours}</span>
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-leaf-100/70 sm:flex-row">
          <p>© {new Date().getFullYear()} {store.name}. Mọi quyền được bảo lưu.</p>
          <p>Thiết kế với 💚 cho những người yêu cây.</p>
        </div>
      </div>
    </footer>
  );
}
