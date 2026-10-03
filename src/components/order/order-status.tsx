import { Check, CircleX } from "lucide-react";
import { ORDER_STATUS_LABEL, type OrderStatus } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Badge, type BadgeTone } from "../ui/badge";

const STATUS_TONE: Record<OrderStatus, BadgeTone> = {
  NEW: "blue",
  CONFIRMED: "mint",
  SHIPPING: "warning",
  COMPLETED: "green",
  CANCELLED: "danger",
};

export function OrderStatusBadge({ status, className }: { status: string; className?: string }) {
  const s = (status in ORDER_STATUS_LABEL ? status : "NEW") as OrderStatus;
  return (
    <Badge tone={STATUS_TONE[s]} className={className}>
      {ORDER_STATUS_LABEL[s]}
    </Badge>
  );
}

const STEPS: { key: OrderStatus; label: string; hint: string }[] = [
  { key: "NEW", label: "Đặt hàng", hint: "Shop đã nhận đơn" },
  { key: "CONFIRMED", label: "Xác nhận", hint: "Đang chuẩn bị cây" },
  { key: "SHIPPING", label: "Đang giao", hint: "Đơn đang trên đường" },
  { key: "COMPLETED", label: "Hoàn thành", hint: "Đã giao thành công" },
];

/** Các bước xử lý đơn hàng (ngang trên desktop, dọc trên mobile) */
export function OrderTimeline({ status }: { status: string }) {
  if (status === "CANCELLED") {
    return (
      <div className="flex items-center gap-3 rounded-2xl bg-red-50 p-4 text-red-800">
        <CircleX className="size-6 shrink-0" aria-hidden />
        <div>
          <p className="font-semibold">Đơn hàng đã bị hủy</p>
          <p className="text-sm text-red-700/80">Liên hệ shop nếu bạn cần hỗ trợ thêm.</p>
        </div>
      </div>
    );
  }
  const current = Math.max(0, STEPS.findIndex((s) => s.key === status));
  return (
    <ol className="grid gap-4 sm:grid-cols-4 sm:gap-0" aria-label="Tiến trình đơn hàng">
      {STEPS.map((step, i) => {
        const done = i <= current;
        return (
          <li key={step.key} className="relative flex gap-3 sm:flex-col sm:items-center sm:text-center" aria-current={i === current ? "step" : undefined}>
            {/* đường nối */}
            {i < STEPS.length - 1 && (
              <span
                aria-hidden
                className={cn(
                  "absolute top-8 left-4 h-[calc(100%-1rem)] w-0.5 -translate-x-1/2 sm:top-4 sm:left-1/2 sm:h-0.5 sm:w-full sm:translate-x-0",
                  i < current ? "bg-leaf-500" : "bg-border",
                )}
              />
            )}
            <span
              className={cn(
                "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold",
                done ? "border-leaf-600 bg-leaf-600 text-white" : "border-border bg-surface text-muted",
                i === current && "ring-4 ring-leaf-100",
              )}
            >
              {done ? <Check className="size-4" aria-hidden /> : i + 1}
            </span>
            <div className="sm:mt-2">
              <p className={cn("text-sm font-semibold", done ? "text-leaf-900" : "text-muted")}>{step.label}</p>
              <p className="text-xs text-muted">{step.hint}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
