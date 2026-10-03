"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { answerMessage } from "@/lib/chatbot/engine";
import { INTENT_LABEL } from "@/lib/chatbot/knowledge";
import type { ChatPayload } from "@/lib/chatbot/types";
import { fieldErrors, type ActionResult } from "@/lib/validators/common";

const faqSchema = z.object({
  question: z.string().trim().min(3, "Nhập câu hỏi mẫu").max(200),
  keywords: z
    .string()
    .trim()
    .min(2, "Nhập ít nhất 1 từ khóa")
    .max(2000)
    .transform((v) =>
      [...new Set(v.split(/[,\n]/).map((k) => k.trim().toLowerCase()).filter(Boolean))].join(", "),
    ),
  answer: z.string().trim().min(5, "Nhập câu trả lời").max(3000),
  category: z.string().trim().min(1).max(50).default("chung"),
  isActive: z.boolean(),
  sortOrder: z.coerce.number().int().min(-10000).max(10000).default(0),
});

export type FaqInput = z.input<typeof faqSchema>;

export async function saveFaq(id: number | null, input: FaqInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = faqSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Vui lòng kiểm tra lại", errors: fieldErrors(parsed.error) };
  try {
    if (id) await prisma.chatFaq.update({ where: { id }, data: parsed.data });
    else await prisma.chatFaq.create({ data: parsed.data });
  } catch {
    return { ok: false, message: "Không thể lưu" };
  }
  return { ok: true, message: id ? "Đã lưu câu trả lời" : "Đã thêm kiến thức mới" };
}

export async function toggleFaq(id: number, value: boolean): Promise<ActionResult> {
  await requireAdmin();
  try {
    await prisma.chatFaq.update({ where: { id }, data: { isActive: value } });
  } catch {
    return { ok: false, message: "Không tìm thấy" };
  }
  return { ok: true };
}

export async function deleteFaq(id: number): Promise<ActionResult> {
  await requireAdmin();
  try {
    await prisma.chatFaq.delete({ where: { id } });
  } catch {
    return { ok: false, message: "Không thể xóa" };
  }
  return { ok: true, message: "Đã xóa" };
}

export async function deleteConversation(id: number): Promise<ActionResult> {
  await requireAdmin();
  try {
    await prisma.chatConversation.delete({ where: { id } });
  } catch {
    return { ok: false, message: "Không thể xóa" };
  }
  return { ok: true, message: "Đã xóa hội thoại" };
}

export type ChatTestResult = {
  intent: string;
  intentLabel: string;
  source: string;
  answered: boolean;
  text: string;
  payload: ChatPayload;
  faqQuestion?: string;
};

/** Thử 1 câu hỏi với chatbot (không lưu, không tính thống kê) */
export async function testChatbot(text: string): Promise<ChatTestResult | null> {
  await requireAdmin();
  const q = text.trim().slice(0, 500);
  if (!q) return null;
  const r = await answerMessage(q, {}, { ip: "admin-test", dryRun: true });
  const faq = r.faqId ? await prisma.chatFaq.findUnique({ where: { id: r.faqId }, select: { question: true } }) : null;
  return {
    intent: r.intent,
    intentLabel: INTENT_LABEL[r.intent],
    source: r.source,
    answered: r.answered,
    text: r.text,
    payload: r.payload,
    faqQuestion: faq?.question,
  };
}
