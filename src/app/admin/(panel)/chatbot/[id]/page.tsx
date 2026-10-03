import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDateTime, formatVND } from "@/lib/format";
import { INTENT_LABEL, type IntentId } from "@/lib/chatbot/knowledge";
import type { ChatPayload } from "@/lib/chatbot/types";
import { PageHeader } from "@/components/admin/ui";
import { ChatRichText } from "@/components/chat/rich-text";
import { Mascot } from "@/components/chat/mascot";
import { Badge } from "@/components/ui/badge";
import { DeleteConversationButton } from "@/components/admin/chatbot-actions";

export const metadata: Metadata = { title: "Chi tiết hội thoại" };

type Props = { params: Promise<{ id: string }> };

const SOURCE_LABEL: Record<string, string> = { rule: "Luật", faq: "Kiến thức", ai: "AI" };

export default async function ConversationPage({ params }: Props) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const conv = await prisma.chatConversation.findUnique({
    where: { id },
    include: { messages: { orderBy: { id: "asc" } } },
  });
  if (!conv) notFound();

  // Admin đã mở xem -> bỏ đánh dấu "cần xem"
  if (!conv.isReviewed) await prisma.chatConversation.update({ where: { id }, data: { isReviewed: true } });

  return (
    <>
      <PageHeader
        title="Chi tiết hội thoại"
        description={`Bắt đầu ${formatDateTime(conv.createdAt)} tại ${conv.pagePath ?? "?"} · ${conv.messageCount} tin nhắn · ${conv.unansweredCount} câu chưa hiểu`}
        back={{ href: "/admin/chatbot", label: "Chatbot" }}
        actions={<DeleteConversationButton id={conv.id} />}
      />

      <div className="chat-bg mx-auto max-w-3xl space-y-4 rounded-2xl p-4 ring-1 ring-border/70 sm:p-6">
        {conv.messages.map((m, i) => {
          if (m.role === "user") {
            const nextBot = conv.messages[i + 1];
            const unanswered = nextBot?.role === "bot" && !nextBot.answered;
            return (
              <div key={m.id} className="flex flex-col items-end gap-1">
                <p className="max-w-[80%] rounded-2xl rounded-br-md bg-leaf-700 px-4 py-2.5 text-sm whitespace-pre-line text-white shadow-soft">
                  {m.content}
                </p>
                <div className="flex items-center gap-2 text-[11px] text-muted">
                  {formatDateTime(m.createdAt)}
                  {unanswered && (
                    <Link
                      href={`/admin/chatbot/kien-thuc?q=${encodeURIComponent(m.content)}`}
                      className="inline-flex items-center gap-1 rounded-full bg-leaf-100 px-2 py-0.5 font-semibold text-leaf-800 hover:bg-leaf-200"
                    >
                      <Plus className="size-3" aria-hidden /> Thêm vào kiến thức
                    </Link>
                  )}
                </div>
              </div>
            );
          }
          let payload: ChatPayload | null = null;
          try {
            payload = m.payload ? JSON.parse(m.payload) : null;
          } catch {}
          return (
            <div key={m.id} className="flex items-start gap-2">
              <Mascot className="size-8 shrink-0" />
              <div className="max-w-[85%] space-y-1">
                <div className={`rounded-2xl rounded-tl-md bg-white px-4 py-2.5 text-sm shadow-soft ${!m.answered ? "ring-2 ring-red-200" : ""}`}>
                  <ChatRichText text={m.content} />
                  {payload?.products && payload.products.length > 0 && (
                    <p className="mt-2 border-t border-border pt-2 text-xs text-muted">
                      Gợi ý: {payload.products.map((p) => `${p.name} (${formatVND(p.salePrice ?? p.price)})`).join(", ")}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted">
                  {formatDateTime(m.createdAt)}
                  {m.intent && <Badge tone="gray">{INTENT_LABEL[m.intent as IntentId] ?? m.intent}</Badge>}
                  {m.source && <Badge tone={m.source === "ai" ? "blue" : "green"}>{SOURCE_LABEL[m.source] ?? m.source}</Badge>}
                  {!m.answered && <Badge tone="danger">Chưa hiểu</Badge>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
