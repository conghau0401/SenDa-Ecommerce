"use client";

import { useId, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function ProductTabs({ tabs }: { tabs: { key: string; label: string; html: string }[] }) {
  const id = useId();
  const visible = tabs.filter((t) => t.html.trim());
  const [active, setActive] = useState(visible[0]?.key);
  if (visible.length === 0) return null;

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const next = visible[(i + (e.key === "ArrowRight" ? 1 : -1) + visible.length) % visible.length];
    setActive(next.key);
    document.getElementById(`${id}-tab-${next.key}`)?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label="Thông tin sản phẩm" className="flex gap-1 border-b border-border">
        {visible.map((t, i) => (
          <button
            key={t.key}
            id={`${id}-tab-${t.key}`}
            role="tab"
            type="button"
            aria-selected={active === t.key}
            aria-controls={`${id}-panel-${t.key}`}
            tabIndex={active === t.key ? 0 : -1}
            onClick={() => setActive(t.key)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              "relative px-4 py-3 text-[15px] font-semibold transition-colors sm:px-6",
              active === t.key ? "text-leaf-800" : "text-muted hover:text-foreground",
            )}
          >
            {t.label}
            {active === t.key && (
              <motion.span layoutId={`${id}-underline`} className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-leaf-600" />
            )}
          </button>
        ))}
      </div>
      {visible.map((t) => (
        <div
          key={t.key}
          id={`${id}-panel-${t.key}`}
          role="tabpanel"
          aria-labelledby={`${id}-tab-${t.key}`}
          hidden={active !== t.key}
          className="prose-content max-w-3xl pt-6"
          dangerouslySetInnerHTML={{ __html: t.html }}
        />
      ))}
    </div>
  );
}
