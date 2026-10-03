"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import type { ActionResult } from "@/lib/validators/common";

export async function setContactHandled(id: number, handled: boolean): Promise<ActionResult> {
  await requireAdmin();
  try {
    await prisma.contact.update({ where: { id }, data: { isHandled: handled } });
  } catch {
    return { ok: false, message: "Không tìm thấy liên hệ" };
  }
  return { ok: true, message: handled ? "Đã đánh dấu đã xử lý" : "Đã chuyển về chưa xử lý" };
}

export async function deleteContact(id: number): Promise<ActionResult> {
  await requireAdmin();
  try {
    await prisma.contact.delete({ where: { id } });
  } catch {
    return { ok: false, message: "Không thể xóa" };
  }
  return { ok: true, message: "Đã xóa liên hệ" };
}
