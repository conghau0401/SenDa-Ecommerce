"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { answerMessage } from "@/lib/chatbot/engine";
import { aiRewrite, isAiEnabled } from "@/lib/chatbot/ai";
import type { ChatContext, ChatMessageDTO, ChatPayload } from "@/lib/chatbot/types";

const sessionSchema = z.string().uuid();
const inputSchema = z.object({
  sessionId: sessionSchema,
  text: z.string().trim().min(1).max(500),
  pagePath: z.string().max(300).optional(),
});

function toDTO(m: { id: number; role: string; content: string; payload: string | null; createdAt: Date }): ChatMessageDTO {
  let payload: ChatPayload | null = null;
  try {
    payload = m.payload ? (JSON.parse(m.payload) as ChatPayload) : null;
  } catch {
    payload = null;
  }
  return { id: m.id, role: m.role === "user" ? "user" : "bot", content: m.content, payload, createdAt: m.createdAt.toISOString() };
}

async function clientIp() {
  return (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

/** Lịch sử chat của phiên (tối đa 60 tin gần nhất) */
export async function getChatHistory(sessionId: string): Promise<ChatMessageDTO[]> {
  if (!sessionSchema.safeParse(sessionId).success) return [];
  const conv = await prisma.chatConversation.findUnique({ where: { sessionId }, select: { id: true } });
  if (!conv) return [];
  const rows = await prisma.chatMessage.findMany({ where: { conversationId: conv.id }, orderBy: { id: "desc" }, take: 60 });
  return rows.reverse().map(toDTO);
}

export type SendChatResult = { ok: true; user: ChatMessageDTO; bot: ChatMessageDTO } | { ok: false; message: string };

export async function sendChatMessage(input: { sessionId: string; text: string; pagePath?: string }): Promise<SendChatResult> {
  const parsed = inputSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Tin nhắn không hợp lệ (tối đa 500 ký tự)" };
  const { sessionId, text, pagePath } = parsed.data;

  const ip = await clientIp();
  if (!checkRateLimit(`chat:${ip}`, 20, 60 * 1000).ok) {
    return { ok: false, message: "Bạn nhắn hơi nhanh, chờ một chút rồi gửi lại nhé 😊" };
  }

  const conv = await prisma.chatConversation.upsert({
    where: { sessionId },
    create: { sessionId, pagePath: pagePath ?? null },
    update: {},
  });
  let ctx: ChatContext = {};
  try {
    ctx = JSON.parse(conv.context) as ChatContext;
  } catch {
    ctx = {};
  }

  const userMsg = await prisma.chatMessage.create({ data: { conversationId: conv.id, role: "user", content: text } });

  let bot;
  try {
    const rule = await answerMessage(text, ctx, { ip });
    let content = rule.text;
    let source: string = rule.source;

    if (isAiEnabled()) {
      const history = await prisma.chatMessage.findMany({
        where: { conversationId: conv.id, id: { lt: userMsg.id } },
        orderBy: { id: "desc" },
        take: 10,
        select: { role: true, content: true },
      });
      const ai = await aiRewrite(
        history.reverse().map((h) => ({ role: h.role === "user" ? ("user" as const) : ("bot" as const), content: h.content })),
        text,
        rule,
      );
      if (ai) {
        content = ai;
        source = "ai";
      }
    }

    bot = await prisma.chatMessage.create({
      data: {
        conversationId: conv.id,
        role: "bot",
        content,
        intent: rule.intent,
        source,
        answered: rule.answered,
        payload: JSON.stringify(rule.payload),
      },
    });

    await prisma.chatConversation.update({
      where: { id: conv.id },
      data: {
        context: JSON.stringify(rule.context),
        messageCount: { increment: 2 },
        lastMessageAt: new Date(),
        ...(rule.answered ? {} : { unansweredCount: { increment: 1 }, isReviewed: false }),
      },
    });
  } catch (err) {
    console.error("sendChatMessage", err);
    bot = await prisma.chatMessage.create({
      data: {
        conversationId: conv.id,
        role: "bot",
        content: "Ôi, Bé Sen đang gặp chút trục trặc 😵 Bạn thử lại sau ít phút hoặc gọi hotline giúp mình nhé!",
        intent: "error",
        source: "rule",
        answered: false,
      },
    });
  }

  return { ok: true, user: toDTO(userMsg), bot: toDTO(bot) };
}
