import Link from "next/link";
import { cn } from "@/lib/utils";

export function ChatbotTabs({ active }: { active: "conversations" | "knowledge" }) {
  const tabs = [
    { key: "conversations", href: "/admin/chatbot", label: "Hội thoại & thống kê" },
    { key: "knowledge", href: "/admin/chatbot/kien-thuc", label: "Kiến thức (hỏi – đáp)" },
  ] as const;
  return (
    <nav className="mb-6 flex gap-1 border-b border-border" aria-label="Chatbot">
      {tabs.map((t) => (
        <Link
          key={t.key}
          href={t.href}
          aria-current={active === t.key ? "page" : undefined}
          className={cn(
            "-mb-px border-b-2 px-3 py-2.5 text-sm font-medium",
            active === t.key ? "border-leaf-600 text-leaf-800" : "border-transparent text-muted hover:text-foreground",
          )}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
