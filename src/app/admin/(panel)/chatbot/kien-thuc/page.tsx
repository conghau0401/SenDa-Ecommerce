import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { INTENT_LABEL, INTENT_PHRASES, TRAITS, type IntentId } from "@/lib/chatbot/knowledge";
import { Card, PageHeader } from "@/components/admin/ui";
import { ChatbotTabs } from "@/components/admin/chatbot-tabs";
import { ChatTester, KnowledgeManager } from "@/components/admin/chatbot-knowledge";

export const metadata: Metadata = { title: "Kiến thức chatbot" };

/** Nguồn dữ liệu của từng ý định có sẵn – để admin biết sửa ở đâu */
const BUILTIN: { intent: IntentId; source: string }[] = [
  { intent: "shipping_fee", source: "Cài đặt → Giao hàng" },
  { intent: "hours", source: "Cài đặt → Cửa hàng (giờ mở cửa)" },
  { intent: "address", source: "Cài đặt → Cửa hàng (địa chỉ)" },
  { intent: "payment", source: "Cài đặt → Chuyển khoản" },
  { intent: "contact", source: "Cài đặt → Cửa hàng & Mạng xã hội" },
  { intent: "order_status", source: "Đơn hàng (cần mã đơn + SĐT)" },
  { intent: "recommend", source: "Sản phẩm đang bán (giá, tồn kho, danh mục)" },
  { intent: "gift", source: "Sản phẩm đang bán" },
  { intent: "promotion", source: "Sản phẩm có giá khuyến mãi" },
  { intent: "product_info", source: "Tên, giá, tồn kho sản phẩm" },
  { intent: "catalog", source: "Danh mục đang hiển thị" },
  { intent: "how_to_order", source: "Câu trả lời cố định" },
];

type Props = { searchParams: Promise<{ q?: string }> };

export default async function ChatKnowledgePage({ searchParams }: Props) {
  const { q } = await searchParams;
  const faqs = await prisma.chatFaq.findMany({ orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { id: "asc" }] });

  return (
    <>
      <PageHeader
        title="Chatbot"
        description="Bé Sen trả lời bằng: (1) dữ liệu thật của shop cho các chủ đề có sẵn, (2) bộ kiến thức hỏi – đáp bên dưới."
      />
      <ChatbotTabs active="knowledge" />

      <div className="grid items-start gap-6 xl:grid-cols-[1fr_380px]">
        <KnowledgeManager faqs={faqs} initialQuestion={q?.slice(0, 200) ?? ""} />

        <div className="space-y-6 xl:sticky xl:top-6">
          <ChatTester />
          <Card title="Chủ đề tự tra dữ liệu" description="Không cần thêm kiến thức – sửa dữ liệu gốc là bot cập nhật theo">
            <ul className="space-y-2.5 text-sm">
              {BUILTIN.map((b) => (
                <li key={b.intent}>
                  <p className="font-medium">{INTENT_LABEL[b.intent]}</p>
                  <p className="text-xs text-muted">
                    Nguồn: {b.source}
                    {INTENT_PHRASES[b.intent] && <> · VD: “{INTENT_PHRASES[b.intent]!.phrases.slice(0, 3).join("”, “")}”</>}
                  </p>
                </li>
              ))}
            </ul>
            <details className="mt-4 text-sm">
              <summary className="cursor-pointer font-medium text-leaf-700">Đặc điểm dùng để tư vấn chọn cây ({TRAITS.length})</summary>
              <ul className="mt-2 space-y-1.5 text-xs text-muted">
                {TRAITS.map((t) => (
                  <li key={t.key}>
                    <span className="font-medium text-foreground">{t.label}</span>: {t.phrases.slice(0, 4).join(", ")}…
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-muted">Danh sách đầy đủ: docs/chatbot.md</p>
            </details>
          </Card>
        </div>
      </div>
    </>
  );
}
