"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { revalidateStore } from "@/lib/revalidate";
import { ORDER_STATUSES, ORDER_STATUS_FLOW, ORDER_STATUS_LABEL, type OrderStatus } from "@/lib/constants";
import type { ActionResult } from "@/lib/validators/common";

class FlowError extends Error {}

export async function updateOrderStatus(id: number, next: string): Promise<ActionResult> {
  await requireAdmin();
  if (!ORDER_STATUSES.includes(next as OrderStatus)) return { ok: false, message: "Trạng thái không hợp lệ" };
  const target = next as OrderStatus;

  try {
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ where: { id }, include: { items: true } });
      if (!order) throw new FlowError("Không tìm thấy đơn hàng");
      const current = order.status as OrderStatus;
      if (!ORDER_STATUS_FLOW[current]?.includes(target)) {
        throw new FlowError(`Không thể chuyển từ "${ORDER_STATUS_LABEL[current]}" sang "${ORDER_STATUS_LABEL[target]}"`);
      }
      // Cập nhật có điều kiện theo trạng thái cũ – tránh 2 admin thao tác chồng nhau
      const res = await tx.order.updateMany({ where: { id, status: current }, data: { status: target } });
      if (res.count === 0) throw new FlowError("Đơn hàng vừa được cập nhật bởi người khác, vui lòng tải lại");

      // Hủy đơn -> hoàn lại tồn kho
      if (target === "CANCELLED") {
        for (const it of order.items) {
          if (it.productId) {
            await tx.product.updateMany({ where: { id: it.productId }, data: { stock: { increment: it.quantity } } });
          }
        }
      }
    });
  } catch (err) {
    if (err instanceof FlowError) return { ok: false, message: err.message };
    console.error("updateOrderStatus", err);
    return { ok: false, message: "Không thể cập nhật trạng thái" };
  }

  if (target === "CANCELLED") revalidateStore(); // tồn kho thay đổi
  return { ok: true, message: `Đã chuyển sang "${ORDER_STATUS_LABEL[target]}"` };
}

export async function updateOrderNote(id: number, note: string): Promise<ActionResult> {
  await requireAdmin();
  const value = note.trim().slice(0, 2000);
  try {
    await prisma.order.update({ where: { id }, data: { internalNote: value || null } });
  } catch {
    return { ok: false, message: "Không tìm thấy đơn hàng" };
  }
  return { ok: true, message: "Đã lưu ghi chú" };
}
