"use client";

import { useState, useTransition } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { useDialog } from "@/hooks/use-dialog";
import { Button } from "../ui/button";

/** Nút có hộp thoại xác nhận (dùng cho xóa, hủy đơn...) */
export function ConfirmButton({
  children,
  title,
  description,
  confirmText = "Xóa",
  action,
  onDone,
  className,
  ariaLabel,
  variant = "danger",
}: {
  children: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  confirmText?: string;
  action: () => Promise<{ ok: boolean; message?: string }>;
  onDone?: () => void;
  className?: string;
  ariaLabel?: string;
  variant?: "danger" | "primary";
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const ref = useDialog<HTMLDivElement>(open, () => !pending && setOpen(false));

  const confirm = () =>
    startTransition(async () => {
      const res = await action().catch(() => ({ ok: false, message: "Mất kết nối" }));
      if (res.ok) {
        if (res.message) toast.success(res.message);
        setOpen(false);
        onDone?.();
      } else toast.error(res.message ?? "Thao tác thất bại");
    });

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={className} aria-label={ariaLabel}>
        {children}
      </button>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="absolute inset-0 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !pending && setOpen(false)}
            />
            <motion.div
              ref={ref}
              role="alertdialog"
              aria-modal="true"
              aria-labelledby="confirm-title"
              className="relative w-full max-w-md rounded-2xl bg-surface p-6 shadow-lift"
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="flex gap-4">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <AlertTriangle className="size-5" aria-hidden />
                </span>
                <div>
                  <h2 id="confirm-title" className="font-semibold text-leaf-900">
                    {title}
                  </h2>
                  {description && <div className="mt-1 text-sm text-muted">{description}</div>}
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setOpen(false)} disabled={pending} data-autofocus>
                  Hủy bỏ
                </Button>
                <Button variant={variant} onClick={confirm} loading={pending}>
                  {confirmText}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
