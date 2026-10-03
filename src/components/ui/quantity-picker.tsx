"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuantityPicker({
  value,
  onChange,
  max,
  min = 1,
  size = "md",
  label = "Số lượng",
  className,
}: {
  value: number;
  onChange: (v: number) => void;
  max: number;
  min?: number;
  size?: "sm" | "md";
  label?: string;
  className?: string;
}) {
  const clamp = (v: number) => Math.max(min, Math.min(max, v));
  const btn = cn(
    "flex items-center justify-center rounded-full text-leaf-800 transition-colors hover:bg-leaf-100 disabled:opacity-35 disabled:hover:bg-transparent",
    size === "sm" ? "size-7" : "size-9",
  );
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-surface p-1",
        className,
      )}
    >
      <button type="button" className={btn} onClick={() => onChange(clamp(value - 1))} disabled={value <= min} aria-label="Giảm số lượng">
        <Minus className={size === "sm" ? "size-3.5" : "size-4"} />
      </button>
      <input
        type="text"
        inputMode="numeric"
        value={value}
        onChange={(e) => {
          const n = Number.parseInt(e.target.value.replace(/\D/g, ""), 10);
          onChange(Number.isFinite(n) ? clamp(n) : min);
        }}
        onFocus={(e) => e.target.select()}
        className={cn(
          "bg-transparent text-center font-semibold tabular-nums outline-none",
          size === "sm" ? "w-8 text-sm" : "w-10",
        )}
        aria-label={label}
      />
      <button type="button" className={btn} onClick={() => onChange(clamp(value + 1))} disabled={value >= max} aria-label="Tăng số lượng">
        <Plus className={size === "sm" ? "size-3.5" : "size-4"} />
      </button>
    </div>
  );
}
