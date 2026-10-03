"use server";

import { prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validators/contact";
import { fieldErrors, type ActionResult } from "@/lib/validators/common";

export async function submitContact(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  // Honeypot chống spam: bot thường điền mọi ô, người thật không thấy ô này
  if (formData.get("website")) return { ok: true, message: "Cảm ơn bạn đã liên hệ!" };

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    contact: formData.get("contact"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return { ok: false, message: "Vui lòng kiểm tra lại thông tin", errors: fieldErrors(parsed.error) };
  }

  try {
    await prisma.contact.create({ data: parsed.data });
  } catch (err) {
    console.error("submitContact", err);
    return { ok: false, message: "Có lỗi xảy ra, vui lòng thử lại sau" };
  }
  return { ok: true, message: "Cảm ơn bạn! Shop sẽ phản hồi trong thời gian sớm nhất." };
}
