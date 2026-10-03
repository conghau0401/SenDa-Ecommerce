"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  Bot,
  ExternalLink,
  FileText,
  FolderTree,
  LayoutDashboard,
  Leaf,
  LogOut,
  Mail,
  Menu,
  Package,
  Settings,
  ShoppingCart,
  X,
} from "lucide-react";
import { logout } from "@/actions/auth";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "Tổng quan", Icon: LayoutDashboard, exact: true },
  { href: "/admin/don-hang", label: "Đơn hàng", Icon: ShoppingCart, badge: "orders" as const },
  { href: "/admin/san-pham", label: "Sản phẩm", Icon: Package },
  { href: "/admin/danh-muc", label: "Danh mục", Icon: FolderTree },
  { href: "/admin/tin-tuc", label: "Tin tức", Icon: FileText },
  { href: "/admin/lien-he", label: "Liên hệ", Icon: Mail, badge: "contacts" as const },
  { href: "/admin/chatbot", label: "Chatbot", Icon: Bot, badge: "chatbot" as const },
  { href: "/admin/cai-dat", label: "Cài đặt", Icon: Settings },
];

type Props = {
  storeName: string;
  admin: { name: string; email: string };
  badges: { orders: number; contacts: number; chatbot: number };
  children: React.ReactNode;
};

function NavLinks({ badges, onNavigate }: { badges: Props["badges"]; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <ul className="space-y-1">
      {NAV.map(({ href, label, Icon, exact, badge }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        const count = badge ? badges[badge] : 0;
        return (
          <li key={href}>
            <Link
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-white/15 text-white" : "text-leaf-100/80 hover:bg-white/10 hover:text-white",
              )}
            >
              <Icon className="size-[18px] shrink-0" aria-hidden />
              <span className="flex-1">{label}</span>
              {count > 0 && (
                <span className="min-w-5 rounded-full bg-sale px-1.5 text-center text-[11px] leading-5 font-bold text-white">
                  {count > 99 ? "99+" : count}
                  <span className="sr-only"> mục mới</span>
                </span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function SidebarContent({ storeName, admin, badges, onNavigate }: Omit<Props, "children"> & { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      <Link href="/admin" className="flex items-center gap-2.5 px-5 py-5" onClick={onNavigate}>
        <span className="flex size-9 items-center justify-center rounded-xl bg-leaf-500 text-white">
          <Leaf className="size-5" aria-hidden />
        </span>
        <span>
          <span className="block text-[15px] leading-tight font-bold text-white">{storeName}</span>
          <span className="text-xs text-leaf-200/80">Quản trị cửa hàng</span>
        </span>
      </Link>
      <nav className="flex-1 overflow-y-auto px-3 py-2" aria-label="Menu quản trị">
        <NavLinks badges={badges} onNavigate={onNavigate} />
      </nav>
      <div className="space-y-1 border-t border-white/10 p-3">
        <a
          href="/"
          target="_blank"
          rel="noopener"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-leaf-100/80 hover:bg-white/10 hover:text-white"
        >
          <ExternalLink className="size-[18px]" aria-hidden /> Xem cửa hàng
        </a>
        <div className="flex items-center gap-3 rounded-xl px-3 py-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-leaf-600 text-sm font-bold text-white">
            {admin.name.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{admin.name}</p>
            <p className="truncate text-xs text-leaf-200/70">{admin.email}</p>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="flex size-8 items-center justify-center rounded-lg text-leaf-100/80 hover:bg-white/10 hover:text-white"
              aria-label="Đăng xuất"
              title="Đăng xuất"
            >
              <LogOut className="size-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export function AdminShell({ children, ...props }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);

  return (
    <div className="min-h-dvh bg-[#f6f5f0]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 bg-leaf-900 lg:block">
        <SidebarContent {...props} />
      </aside>

      <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-surface/90 px-4 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex size-10 items-center justify-center rounded-full hover:bg-leaf-50"
          aria-label="Mở menu"
        >
          <Menu className="size-5" />
        </button>
        <span className="font-bold text-leaf-900">{props.storeName}</span>
      </header>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu quản trị">
            <motion.div
              className="absolute inset-0 cursor-pointer bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="absolute inset-y-0 left-0 w-72 bg-leaf-900"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="absolute top-5 right-3 flex size-9 items-center justify-center rounded-full text-white hover:bg-white/10"
                aria-label="Đóng menu"
              >
                <X className="size-5" />
              </button>
              <SidebarContent {...props} onNavigate={() => setOpen(false)} />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      <main id="main" className="lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</div>
      </main>
    </div>
  );
}
