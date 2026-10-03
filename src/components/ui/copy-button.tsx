"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

export function CopyButton({ value, label, className }: { value: string; label?: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* trình duyệt không cho phép – bỏ qua */
        }
      }}
      className={cn(
        "flex size-7 items-center justify-center rounded-lg text-leaf-700 transition-colors hover:bg-leaf-100",
        className,
      )}
      aria-label={copied ? "Đã sao chép" : `Sao chép ${label ?? ""}`.trim()}
    >
      {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
    </button>
  );
}
