"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Ban, CheckCircle2, PackageCheck, Truck } from "lucide-react";
import { updateOrderNote, updateOrderStatus } from "@/actions/admin/orders";
import { ORDER_STATUS_FLOW, type OrderStatus } from "@/lib/constants";
import { Button } from "../ui/button";
import { inputClass } from "../ui/form-field";
import { ConfirmButton } from "./confirm-button";
import { buttonClass } from "../ui/button";

const ACTION: Record<Exclude<OrderStatus, "NEW">, { label: string; Icon: typeof Truck }> = {
  CONFIRMED: { label: "Xác nhận đơn", Icon: CheckCircle2 },
  SHIPPING: { label: "Bắt đầu giao", Icon: Truck },
  COMPLETED: { label: "Đã giao thành công", Icon: PackageCheck },
  CANCELLED: { label: "Hủy đơn", Icon: Ban },
};

export function OrderStatusActions({ id, status }: { id: number; status: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const nextSteps = (ORDER_STATUS_FLOW[status as OrderStatus] ?? []).filter((s) => s !== "NEW") as Exclude<OrderStatus, "NEW">[];

  if (nextSteps.length === 0) {
    return <p className="text-sm text-muted">Đơn hàng đã kết thúc, không thể đổi trạng thái.</p>;
  }

  const run = (s: OrderStatus) =>
    startTransition(async () => {
      const res = await updateOrderStatus(id, s).catch(() => ({ ok: false, message: "Mất kết nối" }));
      if (res.ok) {
        toast.success(res.message);
        router.refresh();
      } else toast.error(res.message);
    });

  return (
    <div className="flex flex-wrap gap-2">
      {nextSteps
        .filter((s) => s !== "CANCELLED")
        .map((s) => {
          const { label, Icon } = ACTION[s];
          return (
            <Button key={s} onClick={() => run(s)} loading={pending}>
              {!pending && <Icon className="size-4" aria-hidden />}
              {label}
            </Button>
          );
        })}
      {nextSteps.includes("CANCELLED") && (
        <ConfirmButton
          title="Hủy đơn hàng này?"
          description="Tồn kho của các sản phẩm trong đơn sẽ được hoàn lại. Không thể khôi phục đơn sau khi hủy."
          confirmText="Hủy đơn"
          action={() => updateOrderStatus(id, "CANCELLED")}
          onDone={() => router.refresh()}
          className={buttonClass({ variant: "outline", className: "border-red-200 text-red-600 hover:border-red-400 hover:bg-red-50" })}
        >
          <Ban className="size-4" aria-hidden /> Hủy đơn
        </ConfirmButton>
      )}
    </div>
  );
}

export function OrderNoteForm({ id, initial }: { id: number; initial: string }) {
  const [note, setNote] = useState(initial);
  const [pending, startTransition] = useTransition();
  const dirty = note !== initial;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(async () => {
          const res = await updateOrderNote(id, note).catch(() => ({ ok: false, message: "Mất kết nối" }));
          if (res.ok) toast.success(res.message);
          else toast.error(res.message);
        });
      }}
      className="space-y-2"
    >
      <label htmlFor="internal-note" className="sr-only">
        Ghi chú nội bộ
      </label>
      <textarea
        id="internal-note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={4}
        maxLength={2000}
        placeholder="Chỉ admin thấy. VD: Khách hẹn giao sau 17h, đã gọi xác nhận..."
        className={inputClass}
      />
      <div className="flex justify-end">
        <Button type="submit" variant="secondary" size="sm" loading={pending} disabled={!dirty}>
          Lưu ghi chú
        </Button>
      </div>
    </form>
  );
}
