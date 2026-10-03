"use client";

import { useOptimistic, useTransition } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/** Công tắc bật/tắt. Nếu có `action`, gọi server action với cập nhật lạc quan + hoàn tác khi lỗi */
export function ToggleSwitch({
  checked,
  onChange,
  action,
  label,
  showLabel = false,
  disabled,
  size = "md",
}: {
  checked: boolean;
  onChange?: (v: boolean) => void;
  action?: (v: boolean) => Promise<{ ok: boolean; message?: string }>;
  label: string;
  showLabel?: boolean;
  disabled?: boolean;
  size?: "sm" | "md";
}) {
  const [pending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useOptimistic(checked);
  const value = action ? optimistic : checked;

  const toggle = () => {
    const next = !value;
    if (!action) return onChange?.(next);
    startTransition(async () => {
      setOptimistic(next);
      const res = await action(next).catch(() => ({ ok: false, message: "Mất kết nối" }));
      if (!res.ok) toast.error(res.message ?? "Không thể cập nhật");
    });
  };

  return (
    <label className={cn("inline-flex items-center gap-2.5", disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer")}>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        aria-label={showLabel ? undefined : label}
        disabled={disabled}
        onClick={toggle}
        className={cn(
          "relative inline-flex shrink-0 items-center rounded-full transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf-500",
          size === "sm" ? "h-5 w-9" : "h-6 w-11",
          value ? "bg-leaf-600" : "bg-stone-300",
          pending && "opacity-70",
        )}
      >
        <span
          className={cn(
            "inline-block rounded-full bg-white shadow transition-transform duration-200",
            size === "sm" ? "size-4" : "size-5",
            value ? (size === "sm" ? "translate-x-[18px]" : "translate-x-[22px]") : "translate-x-0.5",
          )}
        />
      </button>
      {showLabel && <span className="text-sm">{label}</span>}
    </label>
  );
}
