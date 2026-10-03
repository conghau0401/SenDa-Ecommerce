"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Menu, Phone, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { CartButton } from "../cart/cart-button";

type Category = { name: string; slug: string };

export const NAV_ITEMS = [
  { href: "/", label: "Trang chủ" },
  { href: "/san-pham", label: "Sản phẩm" },
  { href: "/tin-tuc", label: "Tin tức" },
  { href: "/lien-he", label: "Liên hệ" },
  { href: "/tra-cuu-don-hang", label: "Tra cứu đơn" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/san-pham") return pathname.startsWith("/san-pham") || pathname.startsWith("/danh-muc");
  return pathname.startsWith(href);
}

function SearchForm({ autoFocus, onDone, className }: { autoFocus?: boolean; onDone?: () => void; className?: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  return (
    <form
      role="search"
      className={cn("relative", className)}
      onSubmit={(e) => {
        e.preventDefault();
        const value = q.trim();
        router.push(value ? `/san-pham?q=${encodeURIComponent(value)}` : "/san-pham");
        onDone?.();
      }}
    >
      <label htmlFor="site-search" className="sr-only">
        Tìm sản phẩm
      </label>
      <input
        id="site-search"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        autoFocus={autoFocus}
        placeholder="Tìm sen đá, xương rồng..."
        className="h-10 w-full rounded-full border border-border bg-surface pr-11 pl-4 text-sm transition-colors outline-none placeholder:text-muted/70 focus:border-leaf-500 focus:ring-2 focus:ring-leaf-200"
      />
      <button
        type="submit"
        className="absolute top-1 right-1 flex size-8 items-center justify-center rounded-full text-leaf-700 hover:bg-leaf-50"
        aria-label="Tìm kiếm"
      >
        <Search className="size-4" />
      </button>
    </form>
  );
}

export function HeaderClient({
  storeName,
  logo,
  phone,
  announcement,
  categories,
}: {
  storeName: string;
  logo: string;
  phone: string;
  announcement: string;
  categories: Category[];
}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Đóng menu/tìm kiếm khi chuyển trang
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Khóa cuộn + Esc để đóng menu mobile
  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <>
      <a
        href="#main"
        className="sr-only z-[60] rounded-full bg-primary px-4 py-2 text-white focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Bỏ qua đến nội dung chính
      </a>

      <div className="bg-leaf-800 text-leaf-50">
        <div className="container-page flex h-9 items-center justify-center gap-6 text-xs sm:justify-between sm:text-[13px]">
          <p className="truncate">{announcement}</p>
          {phone && (
            <a href={`tel:${phone.replace(/\s/g, "")}`} className="hidden items-center gap-1.5 hover:text-white sm:flex">
              <Phone className="size-3.5" aria-hidden /> Hotline: <span className="font-semibold">{phone}</span>
            </a>
          )}
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-40 border-b transition-all duration-300",
          scrolled ? "border-border/80 bg-background/85 shadow-soft backdrop-blur-md" : "border-transparent bg-background",
        )}
      >
        <div className="container-page flex h-16 items-center gap-3 lg:h-[72px] lg:gap-8">
          <button
            ref={menuButtonRef}
            type="button"
            className="-ml-2 flex size-10 items-center justify-center rounded-full hover:bg-leaf-50 lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Mở menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <Menu className="size-6" />
          </button>

          <Logo name={storeName} logo={logo} className="max-lg:mr-auto" />

          <nav aria-label="Menu chính" className="hidden flex-1 items-center gap-1 lg:flex">
            {NAV_ITEMS.map((item) =>
              item.href === "/san-pham" && categories.length > 0 ? (
                <div key={item.href} className="group relative">
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1 rounded-full px-4 py-2 text-[15px] font-medium transition-colors hover:bg-leaf-50 hover:text-leaf-800",
                      isActive(pathname, item.href) && "text-leaf-700",
                    )}
                    aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  >
                    {item.label}
                    <ChevronDown className="size-4 transition-transform group-focus-within:rotate-180 group-hover:rotate-180" aria-hidden />
                  </Link>
                  <div className="invisible absolute top-full left-0 z-10 pt-2 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    <ul className="w-60 translate-y-1 rounded-2xl border border-border bg-surface p-2 shadow-lift transition-transform group-hover:translate-y-0">
                      {categories.map((c) => (
                        <li key={c.slug}>
                          <Link
                            href={`/danh-muc/${c.slug}`}
                            className="block rounded-xl px-3 py-2 text-sm hover:bg-leaf-50 hover:text-leaf-800"
                          >
                            {c.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full px-4 py-2 text-[15px] font-medium transition-colors hover:bg-leaf-50 hover:text-leaf-800",
                    isActive(pathname, item.href) && "text-leaf-700",
                  )}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <Suspense fallback={<div className="hidden h-10 w-64 xl:block" />}>
            <SearchForm className="hidden w-64 xl:block" />
          </Suspense>

          <div className="flex items-center gap-1">
            <button
              type="button"
              className="flex size-10 items-center justify-center rounded-full hover:bg-leaf-50 xl:hidden"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label={searchOpen ? "Đóng tìm kiếm" : "Tìm kiếm"}
              aria-expanded={searchOpen}
            >
              {searchOpen ? <X className="size-5" /> : <Search className="size-5" />}
            </button>
            <CartButton />
          </div>
        </div>

        <AnimatePresence initial={false}>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden xl:hidden"
            >
              <div className="container-page pb-3">
                <Suspense fallback={<div className="h-10" />}>
                  <SearchForm autoFocus onDone={() => setSearchOpen(false)} />
                </Suspense>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Menu mobile */}
      <AnimatePresence>
        {menuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden" id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu">
            <motion.div
              className="absolute inset-0 bg-leaf-900/40 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              className="absolute inset-y-0 left-0 flex w-[84%] max-w-sm flex-col bg-background shadow-lift"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="flex h-16 items-center justify-between border-b border-border px-4">
                <Logo name={storeName} logo={logo} />
                <button
                  type="button"
                  className="flex size-10 items-center justify-center rounded-full hover:bg-leaf-50"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Đóng menu"
                  autoFocus
                >
                  <X className="size-5" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto p-4" aria-label="Menu di động">
                <ul className="space-y-1">
                  {NAV_ITEMS.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "block rounded-xl px-4 py-3 font-medium hover:bg-leaf-50",
                          isActive(pathname, item.href) && "bg-leaf-50 text-leaf-800",
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                {categories.length > 0 && (
                  <>
                    <p className="mt-6 mb-2 px-4 text-xs font-semibold tracking-wider text-muted uppercase">Danh mục</p>
                    <ul className="grid grid-cols-2 gap-1">
                      {categories.map((c) => (
                        <li key={c.slug}>
                          <Link href={`/danh-muc/${c.slug}`} className="block rounded-xl px-4 py-2 text-sm hover:bg-leaf-50">
                            {c.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </nav>
              {phone && (
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="m-4 flex items-center justify-center gap-2 rounded-full bg-leaf-50 py-3 font-semibold text-leaf-800"
                >
                  <Phone className="size-4" aria-hidden /> {phone}
                </a>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
