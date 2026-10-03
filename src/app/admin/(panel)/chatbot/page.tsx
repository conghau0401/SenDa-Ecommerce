import type { Metadata } from "next";
import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/format";
import { INTENT_LABEL, type IntentId } from "@/lib/chatbot/knowledge";
import { isAiEnabled } from "@/lib/chatbot/ai";
import { Card, PageHeader, tableCls } from "@/components/admin/ui";
import { ChatbotTabs } from "@/components/admin/chatbot-tabs";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Chatbot" };

const PER_PAGE = 20;
const FILTERS = [
  { key: "", label: "Tất cả", where: {} },
  { key: "chua-xem", label: "Cần xem", where: { isReviewed: false } },
  { key: "chua-hieu", label: "Có câu chưa hiểu", where: { unansweredCount: { gt: 0 } } },
] as const satisfies readonly { key: string; label: string; where: Prisma.ChatConversationWhereInput }[];

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl bg-surface p-5 shadow-soft ring-1 ring-border/70">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1.5 text-2xl font-bold tracking-tight text-leaf-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </div>
  );
}

type Props = { searchParams: Promise<{ loc?: string; trang?: string }> };

export default async function AdminChatbotPage({ searchParams }: Props) {
  const sp = await searchParams;
  const filter = FILTERS.find((f) => f.key === (sp.loc ?? "")) ?? FILTERS[0];
  const page = Math.max(1, Number(sp.trang) || 1);
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [convs7, userMsgs7, botMsgs7, answered7, toReview, intentGroups, unansweredBots, total, conversations] = await Promise.all([
    prisma.chatConversation.count({ where: { createdAt: { gte: since } } }),
    prisma.chatMessage.count({ where: { role: "user", createdAt: { gte: since } } }),
    prisma.chatMessage.count({ where: { role: "bot", createdAt: { gte: since } } }),
    prisma.chatMessage.count({ where: { role: "bot", answered: true, createdAt: { gte: since } } }),
    prisma.chatConversation.count({ where: { isReviewed: false } }),
    prisma.chatMessage.groupBy({
      by: ["intent"],
      where: { role: "bot", createdAt: { gte: since }, intent: { not: null } },
      _count: { _all: true },
    }),
    prisma.chatMessage.findMany({
      where: { role: "bot", answered: false },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: { id: true, conversationId: true, createdAt: true },
    }),
    prisma.chatConversation.count({ where: filter.where }),
    prisma.chatConversation.findMany({
      where: filter.where,
      orderBy: { lastMessageAt: "desc" },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
      include: { messages: { where: { role: "user" }, orderBy: { id: "asc" }, take: 1, select: { content: true } } },
    }),
  ]);

  // Câu hỏi của khách ngay trước mỗi câu bot chưa hiểu
  const unansweredQuestions = (
    await Promise.all(
      unansweredBots.map((b) =>
        prisma.chatMessage.findFirst({
          where: { conversationId: b.conversationId, role: "user", id: { lt: b.id } },
          orderBy: { id: "desc" },
          select: { content: true, conversationId: true, createdAt: true },
        }),
      ),
    )
  ).filter((x): x is NonNullable<typeof x> => !!x);

  const intents = intentGroups
    .map((g) => ({ intent: g.intent as IntentId, count: g._count._all }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
  const maxIntent = Math.max(1, ...intents.map((i) => i.count));
  const rate = botMsgs7 ? Math.round((answered7 / botMsgs7) * 100) : 0;

  const href = (key: string, p = 1) => {
    const params = new URLSearchParams();
    if (key) params.set("loc", key);
    if (p > 1) params.set("trang", String(p));
    const s = params.toString();
    return `/admin/chatbot${s ? `?${s}` : ""}`;
  };

  return (
    <>
      <PageHeader
        title="Chatbot"
        description={
          <span className="flex items-center gap-2">
            Trợ lý Bé Sen trên website ·{" "}
            {isAiEnabled() ? <Badge tone="blue">Đang bật AI (Claude)</Badge> : <Badge tone="gray">Chế độ luật (không dùng AI)</Badge>}
          </span>
        }
      />
      <ChatbotTabs active="conversations" />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Hội thoại (7 ngày)" value={String(convs7)} />
        <Stat label="Tin nhắn của khách (7 ngày)" value={String(userMsgs7)} />
        <Stat label="Tỉ lệ bot hiểu câu hỏi" value={`${rate}%`} hint={`${answered7}/${botMsgs7} câu trả lời (7 ngày)`} />
        <Stat label="Hội thoại cần xem" value={String(toReview)} hint="Có câu bot chưa hiểu" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Card title="Khách hỏi gì nhiều nhất" description="Số câu trả lời theo chủ đề, 7 ngày qua">
          {intents.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted">Chưa có dữ liệu</p>
          ) : (
            <ul className="space-y-3">
              {intents.map((i) => (
                <li key={i.intent}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{INTENT_LABEL[i.intent] ?? i.intent}</span>
                    <span className="font-semibold tabular-nums">{i.count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-leaf-50" aria-hidden>
                    <div className="h-full rounded-full bg-leaf-600" style={{ width: `${(i.count / maxIntent) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Câu hỏi bot chưa hiểu" description="Thêm vào kiến thức để bot trả lời được lần sau" bodyClassName="p-0">
          {unansweredQuestions.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-muted">Bot đã trả lời được mọi câu hỏi 🎉</p>
          ) : (
            <ul className="divide-y divide-border">
              {unansweredQuestions.map((q, i) => (
                <li key={i} className="flex items-center gap-3 px-5 py-3">
                  <div className="min-w-0 flex-1">
                    <Link href={`/admin/chatbot/${q.conversationId}`} className="line-clamp-1 text-sm font-medium hover:text-leaf-700">
                      “{q.content}”
                    </Link>
                    <p className="text-xs text-muted">{formatDateTime(q.createdAt)}</p>
                  </div>
                  <Link
                    href={`/admin/chatbot/kien-thuc?q=${encodeURIComponent(q.content)}`}
                    className="inline-flex shrink-0 items-center gap-1 rounded-full bg-leaf-100 px-3 py-1.5 text-xs font-semibold text-leaf-800 hover:bg-leaf-200"
                  >
                    <Plus className="size-3.5" aria-hidden /> Thêm kiến thức
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <h2 className="mt-8 mb-3 font-semibold text-leaf-900">Lịch sử hội thoại</h2>
      <nav className="mb-4 flex gap-1 border-b border-border" aria-label="Lọc hội thoại">
        {FILTERS.map((f) => (
          <Link
            key={f.key || "all"}
            href={href(f.key)}
            aria-current={filter.key === f.key ? "page" : undefined}
            className={cn(
              "-mb-px border-b-2 px-3 py-2 text-sm font-medium",
              filter.key === f.key ? "border-leaf-600 text-leaf-800" : "border-transparent text-muted hover:text-foreground",
            )}
          >
            {f.label}
          </Link>
        ))}
      </nav>

      {conversations.length === 0 ? (
        <EmptyState title="Chưa có hội thoại nào" />
      ) : (
        <div className={tableCls.wrap}>
          <table className={tableCls.table}>
            <thead>
              <tr>
                <th className={tableCls.th}>Tin nhắn đầu tiên</th>
                <th className={tableCls.th}>Bắt đầu tại trang</th>
                <th className={`${tableCls.th} text-right`}>Số tin</th>
                <th className={tableCls.th}>Tình trạng</th>
                <th className={tableCls.th}>Lần cuối</th>
              </tr>
            </thead>
            <tbody>
              {conversations.map((c) => (
                <tr key={c.id} className={cn(tableCls.tr, "relative")}>
                  <td className={tableCls.td}>
                    <Link href={`/admin/chatbot/${c.id}`} className="line-clamp-1 font-medium after:absolute after:inset-0 hover:text-leaf-700">
                      {c.messages[0]?.content ?? "(chưa có tin nhắn)"}
                    </Link>
                  </td>
                  <td className={`${tableCls.td} text-xs text-muted`}>{c.pagePath ?? "—"}</td>
                  <td className={`${tableCls.td} text-right tabular-nums`}>{c.messageCount}</td>
                  <td className={tableCls.td}>
                    <span className="flex flex-wrap gap-1">
                      {!c.isReviewed && <Badge tone="warning">Cần xem</Badge>}
                      {c.unansweredCount > 0 ? <Badge tone="danger">{c.unansweredCount} câu chưa hiểu</Badge> : <Badge>Trả lời đủ</Badge>}
                    </span>
                  </td>
                  <td className={`${tableCls.td} whitespace-nowrap text-muted`}>{formatDateTime(c.lastMessageAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} totalPages={Math.max(1, Math.ceil(total / PER_PAGE))} makeHref={(p) => href(filter.key, p)} />
    </>
  );
}
