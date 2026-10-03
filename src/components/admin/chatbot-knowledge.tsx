"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { FlaskConical, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { deleteFaq, saveFaq, testChatbot, toggleFaq, type ChatTestResult } from "@/actions/admin/chatbot";
import { normalize } from "@/lib/chatbot/text";
import { useDialog } from "@/hooks/use-dialog";
import { formatVND } from "@/lib/format";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { FormField, fieldAria, inputClass } from "../ui/form-field";
import { EmptyState } from "../ui/empty-state";
import { ChatRichText } from "../chat/rich-text";
import { Card, tableCls } from "./ui";
import { ToggleSwitch } from "./toggle-switch";
import { ConfirmButton } from "./confirm-button";

type Faq = {
  id: number;
  question: string;
  keywords: string;
  answer: string;
  category: string;
  isActive: boolean;
  sortOrder: number;
  hitCount: number;
};

type Draft = { question: string; keywords: string; answer: string; category: string; isActive: boolean; sortOrder: string };

/* ------------------------------------------------------------------ */
/* Thử chatbot                                                         */
/* ------------------------------------------------------------------ */

export function ChatTester() {
  const [q, setQ] = useState("");
  const [res, setRes] = useState<ChatTestResult | null>(null);
  const [pending, startTransition] = useTransition();
  return (
    <Card title={<span className="flex items-center gap-2"><FlaskConical className="size-4 text-leaf-600" aria-hidden /> Thử chatbot</span>} description="Gõ thử câu hỏi để xem bot hiểu thế nào (không lưu lại)">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          startTransition(async () => setRes(await testChatbot(q)));
        }}
        className="flex gap-2"
      >
        <label htmlFor="chat-test" className="sr-only">Câu hỏi thử</label>
        <input id="chat-test" value={q} onChange={(e) => setQ(e.target.value)} placeholder="VD: ship ra Hà Nội mất mấy ngày" className={inputClass} />
        <Button type="submit" size="icon" loading={pending} disabled={!q.trim()} aria-label="Thử">
          {!pending && <Search className="size-4" />}
        </Button>
      </form>
      {res && (
        <div className="mt-4 space-y-2">
          <div className="flex flex-wrap gap-1.5">
            <Badge tone={res.answered ? "green" : "danger"}>{res.answered ? "Hiểu" : "Chưa hiểu"}</Badge>
            <Badge tone="gray">{res.intentLabel}</Badge>
            {res.faqQuestion && <Badge tone="blue">FAQ: {res.faqQuestion}</Badge>}
          </div>
          <div className="rounded-xl bg-sand/60 p-3 text-sm">
            <ChatRichText text={res.text} />
            {res.payload.products && res.payload.products.length > 0 && (
              <p className="mt-2 border-t border-border pt-2 text-xs text-muted">
                Thẻ sản phẩm: {res.payload.products.map((p) => `${p.name} (${formatVND(p.salePrice ?? p.price)})`).join(", ")}
              </p>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Form thêm / sửa                                                     */
/* ------------------------------------------------------------------ */

function FaqDialog({
  editing,
  draft: initial,
  categories,
  onClose,
}: {
  editing: Faq | null;
  draft: Draft;
  categories: string[];
  onClose: () => void;
}) {
  const router = useRouter();
  const [v, setV] = useState<Draft>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();
  const ref = useDialog<HTMLDivElement>(true, () => !pending && onClose());
  const set = (k: keyof Draft) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setV((s) => ({ ...s, [k]: e.target.value }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await saveFaq(editing?.id ?? null, { ...v, sortOrder: Number(v.sortOrder) || 0 }).catch(() => ({ ok: false as const, message: "Mất kết nối" }));
      if (res.ok) {
        toast.success(res.message ?? "Đã lưu");
        router.refresh();
        onClose();
      } else {
        toast.error(res.message);
        if ("errors" in res && res.errors) setErrors(res.errors);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <motion.div className="absolute inset-0 cursor-pointer bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
      <motion.div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="faq-dialog-title"
        className="relative max-h-[94dvh] w-full max-w-3xl overflow-y-auto rounded-t-2xl bg-surface shadow-lift sm:rounded-2xl"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 24 }}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface px-5 py-4">
          <h2 id="faq-dialog-title" className="font-semibold text-leaf-900">{editing ? "Sửa kiến thức" : "Thêm kiến thức mới"}</h2>
          <button type="button" onClick={onClose} className="flex size-9 items-center justify-center rounded-full hover:bg-sand" aria-label="Đóng">
            <X className="size-5" />
          </button>
        </div>
        <form onSubmit={submit} noValidate className="grid gap-5 p-5 md:grid-cols-2">
          <div className="space-y-4">
            <FormField id="faq-question" label="Câu hỏi mẫu" required error={errors.question} hint="Hiển thị trong danh sách để dễ quản lý">
              <input {...fieldAria("faq-question", errors.question)} value={v.question} onChange={set("question")} data-autofocus className={inputClass} />
            </FormField>
            <FormField
              id="faq-keywords"
              label="Từ khóa nhận diện"
              required
              error={errors.keywords}
              hint="Phân tách bằng dấu phẩy. Gõ KHÔNG dấu để khớp cả khi khách gõ có/không dấu. Ưu tiên cụm 2–4 từ (VD: mat may ngay, ship tinh)."
            >
              <textarea {...fieldAria("faq-keywords", errors.keywords)} value={v.keywords} onChange={set("keywords")} rows={4} className={inputClass} />
            </FormField>
            <div className="grid grid-cols-[1fr_90px] gap-3">
              <FormField id="faq-category" label="Nhóm" error={errors.category}>
                <input {...fieldAria("faq-category", errors.category)} value={v.category} onChange={set("category")} list="faq-categories" className={inputClass} />
              </FormField>
              <FormField id="faq-sort" label="Thứ tự" error={errors.sortOrder}>
                <input {...fieldAria("faq-sort", errors.sortOrder)} value={v.sortOrder} onChange={set("sortOrder")} inputMode="numeric" className={inputClass} />
              </FormField>
              <datalist id="faq-categories">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>
            <ToggleSwitch showLabel label="Đang sử dụng" checked={v.isActive} onChange={(isActive) => setV((s) => ({ ...s, isActive }))} />
          </div>
          <div className="space-y-4">
            <FormField
              id="faq-answer"
              label="Câu trả lời"
              required
              error={errors.answer}
              hint='Định dạng: **đậm**, [chữ](/duong-dan), xuống dòng; dòng bắt đầu "- " là gạch đầu dòng'
            >
              <textarea {...fieldAria("faq-answer", errors.answer)} value={v.answer} onChange={set("answer")} rows={8} className={inputClass} />
            </FormField>
            <div>
              <p className="mb-1.5 text-xs font-medium text-muted">Xem trước</p>
              <div className="chat-bg rounded-xl p-3">
                <div className="rounded-2xl rounded-bl-md bg-white px-3.5 py-2.5 text-sm shadow-soft">
                  {v.answer.trim() ? <ChatRichText text={v.answer} /> : <span className="text-muted">Câu trả lời sẽ hiển thị ở đây</span>}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 border-t border-border pt-4 md:col-span-2">
            <Button variant="ghost" onClick={onClose} disabled={pending}>Hủy</Button>
            <Button type="submit" loading={pending}>{editing ? "Lưu" : "Thêm kiến thức"}</Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Danh sách                                                           */
/* ------------------------------------------------------------------ */

export function KnowledgeManager({ faqs, initialQuestion }: { faqs: Faq[]; initialQuestion: string }) {
  const router = useRouter();
  const [dialog, setDialog] = useState<{ editing: Faq | null; draft: Draft } | null>(null);
  const [filter, setFilter] = useState("");
  const categories = useMemo(() => [...new Set(faqs.map((f) => f.category))], [faqs]);

  // Mở sẵn form khi đến từ "Thêm vào kiến thức" (?q=câu hỏi khách)
  useEffect(() => {
    if (!initialQuestion) return;
    setDialog({
      editing: null,
      draft: { question: initialQuestion, keywords: normalize(initialQuestion), answer: "", category: "chung", isActive: true, sortOrder: "0" },
    });
    router.replace("/admin/chatbot/kien-thuc", { scroll: false });
  }, [initialQuestion, router]);

  const shown = faqs.filter((f) => {
    const n = normalize(filter);
    return !n || normalize(`${f.question} ${f.keywords} ${f.answer} ${f.category}`).includes(n);
  });

  return (
    <div className="min-w-0">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="relative min-w-60 flex-1 sm:max-w-xs">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" aria-hidden />
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Lọc kiến thức..."
            aria-label="Lọc kiến thức"
            className="h-10 w-full rounded-xl border border-border bg-surface pr-3 pl-9 text-sm outline-none focus:border-leaf-500 focus:ring-2 focus:ring-leaf-200"
          />
        </div>
        <Button
          onClick={() => setDialog({ editing: null, draft: { question: "", keywords: "", answer: "", category: "chung", isActive: true, sortOrder: "0" } })}
        >
          <Plus className="size-4" aria-hidden /> Thêm kiến thức
        </Button>
      </div>

      {shown.length === 0 ? (
        <EmptyState title="Không có kiến thức nào" />
      ) : (
        <div className={tableCls.wrap}>
          <table className={tableCls.table}>
            <thead>
              <tr>
                <th className={tableCls.th}>Câu hỏi & từ khóa</th>
                <th className={tableCls.th}>Nhóm</th>
                <th className={`${tableCls.th} text-right`}>Lượt dùng</th>
                <th className={`${tableCls.th} text-center`}>Bật</th>
                <th className={tableCls.th}><span className="sr-only">Thao tác</span></th>
              </tr>
            </thead>
            <tbody>
              {shown.map((f) => (
                <tr key={f.id} className={tableCls.tr}>
                  <td className={`${tableCls.td} max-w-md`}>
                    <button
                      type="button"
                      onClick={() =>
                        setDialog({ editing: f, draft: { question: f.question, keywords: f.keywords, answer: f.answer, category: f.category, isActive: f.isActive, sortOrder: String(f.sortOrder) } })
                      }
                      className="text-left font-medium hover:text-leaf-700"
                    >
                      {f.question}
                    </button>
                    <p className="mt-0.5 line-clamp-1 text-xs text-muted">{f.keywords}</p>
                  </td>
                  <td className={tableCls.td}><Badge tone="gray">{f.category}</Badge></td>
                  <td className={`${tableCls.td} text-right tabular-nums`}>{f.hitCount}</td>
                  <td className={`${tableCls.td} text-center`}>
                    <ToggleSwitch size="sm" label={`Bật "${f.question}"`} checked={f.isActive} action={(val) => toggleFaq(f.id, val)} />
                  </td>
                  <td className={tableCls.td}>
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() =>
                          setDialog({ editing: f, draft: { question: f.question, keywords: f.keywords, answer: f.answer, category: f.category, isActive: f.isActive, sortOrder: String(f.sortOrder) } })
                        }
                        className="flex size-8 items-center justify-center rounded-lg text-muted hover:bg-leaf-50 hover:text-leaf-700"
                        aria-label={`Sửa "${f.question}"`}
                      >
                        <Pencil className="size-4" />
                      </button>
                      <ConfirmButton
                        title="Xóa kiến thức này?"
                        description={`"${f.question}" sẽ bị xóa, bot không trả lời câu này nữa.`}
                        action={() => deleteFaq(f.id)}
                        onDone={() => router.refresh()}
                        ariaLabel={`Xóa "${f.question}"`}
                        className="flex size-8 items-center justify-center rounded-lg text-muted hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="size-4" />
                      </ConfirmButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {dialog && (
          <FaqDialog
            key={dialog.editing?.id ?? "new"}
            editing={dialog.editing}
            draft={dialog.draft}
            categories={categories}
            onClose={() => setDialog(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
