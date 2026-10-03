"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Plus, RotateCcw, SendHorizontal, X } from "lucide-react";
import { getChatHistory, sendChatMessage } from "@/actions/chat";
import type { ChatMessageDTO, ChatProductCard } from "@/lib/chatbot/types";
import { QUICK_REPLIES } from "@/lib/chatbot/knowledge";
import { effectivePrice, formatVND } from "@/lib/format";
import { useUi } from "@/store/ui";
import { cn } from "@/lib/utils";
import { useAddToCart } from "../cart/use-add-to-cart";
import { Mascot } from "./mascot";
import { ChatRichText } from "./rich-text";

const SESSION_KEY = "senda-chat-session";
const GREETED_KEY = "senda-chat-greeted";
const MAX_LEN = 500;

function getSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id || !/^[0-9a-f-]{36}$/i.test(id)) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

/** Thẻ sản phẩm nhỏ trong tin nhắn – xem chi tiết hoặc thêm nhanh vào giỏ */
function ProductMiniCard({ p, onNavigate }: { p: ChatProductCard; onNavigate: () => void }) {
  const addToCart = useAddToCart();
  const ref = useRef<HTMLDivElement>(null);
  const price = effectivePrice(p);
  const out = p.stock <= 0;
  return (
    <div ref={ref} className="flex w-36 shrink-0 snap-start flex-col overflow-hidden rounded-2xl bg-white shadow-soft ring-1 ring-border/70">
      <Link href={`/san-pham/${p.slug}`} onClick={onNavigate} className="relative block aspect-square bg-sand">
        {p.image && <Image src={p.image} alt={p.name} fill sizes="144px" className="object-cover" />}
        {out && <span className="absolute inset-x-0 bottom-0 bg-black/55 py-0.5 text-center text-[11px] font-semibold text-white">Hết hàng</span>}
      </Link>
      <div className="flex flex-1 flex-col p-2">
        <Link href={`/san-pham/${p.slug}`} onClick={onNavigate} className="line-clamp-2 text-xs leading-snug font-semibold hover:text-leaf-700">
          {p.name}
        </Link>
        <div className="mt-auto flex items-end justify-between gap-1 pt-1.5">
          <div className="leading-tight">
            <p className={cn("text-[13px] font-bold", price < p.price ? "text-sale" : "text-leaf-800")}>{formatVND(price)}</p>
            {price < p.price && <p className="text-[10px] text-muted line-through">{formatVND(p.price)}</p>}
          </div>
          {!out && (
            <button
              type="button"
              onClick={() =>
                addToCart({ productId: p.id, slug: p.slug, name: p.name, image: p.image, price, stock: p.stock }, 1, ref.current)
              }
              className="flex size-7 shrink-0 items-center justify-center rounded-full bg-leaf-100 text-leaf-800 transition hover:bg-primary hover:text-white"
              aria-label={`Thêm ${p.name} vào giỏ`}
            >
              <Plus className="size-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex items-end gap-2" role="status" aria-label="Bé Sen đang soạn tin">
      <Mascot className="size-8 shrink-0" />
      <div className="flex gap-1 rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-soft">
        <span className="chat-typing-dot size-2 rounded-full bg-leaf-500" />
        <span className="chat-typing-dot size-2 rounded-full bg-leaf-500" />
        <span className="chat-typing-dot size-2 rounded-full bg-leaf-500" />
      </div>
    </div>
  );
}

export function ChatWidget({ storeName }: { storeName: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessageDTO[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [sending, setSending] = useState(false);
  const [input, setInput] = useState("");
  const [bubble, setBubble] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sessionRef = useRef<string>("");
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const stickyBar = useUi((s) => s.stickyBarVisible);
  const reduceMotion = useReducedMotion();

  const welcome: ChatMessageDTO = {
    id: -1,
    role: "bot",
    content: `Xin chào 👋 Mình là **Bé Sen** – trợ lý của ${storeName}.\nMình có thể tư vấn chọn cây, quà tặng, phí ship, thời gian giao hàng hoặc kiểm tra đơn hàng cho bạn. Bạn cần gì nè?`,
    payload: { quickReplies: [...QUICK_REPLIES.welcome] },
    createdAt: "",
  };
  const all = [welcome, ...messages];
  const lastBot = [...all].reverse().find((m) => m.role === "bot");

  // Lời chào nhỏ cạnh nút chat (1 lần mỗi phiên trình duyệt)
  useEffect(() => {
    if (sessionStorage.getItem(GREETED_KEY)) return;
    const show = setTimeout(() => setBubble(true), 5000);
    const hide = setTimeout(() => setBubble(false), 14000);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, []);

  // Mở lần đầu: tải lịch sử
  useEffect(() => {
    if (!open || loaded) return;
    sessionRef.current = getSessionId();
    getChatHistory(sessionRef.current)
      .then(setMessages)
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [open, loaded]);

  // Cuộn xuống cuối khi có tin mới
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: reduceMotion ? "auto" : "smooth" });
  }, [messages, sending, open, reduceMotion]);

  // Mobile: chat chiếm toàn màn hình -> khóa cuộn trang; Esc để đóng
  useEffect(() => {
    if (!open) return;
    const mobile = window.matchMedia("(max-width: 639px)").matches;
    const prev = document.body.style.overflow;
    if (mobile) document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        launcherRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    const t = setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 250);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
    };
  }, [open]);

  const openChat = () => {
    setOpen(true);
    setBubble(false);
    sessionStorage.setItem(GREETED_KEY, "1");
  };

  /** Bấm link trong chat: trên mobile đóng khung chat để thấy trang */
  const onNavigate = useCallback(() => {
    if (window.matchMedia("(max-width: 639px)").matches) setOpen(false);
  }, []);

  const send = async (raw: string) => {
    const text = raw.trim().slice(0, MAX_LEN);
    if (!text || sending) return;
    setError(null);
    setInput("");
    const temp: ChatMessageDTO = { id: -Date.now(), role: "user", content: text, payload: null, createdAt: new Date().toISOString() };
    setMessages((m) => [...m, temp]);
    setSending(true);
    const started = Date.now();
    try {
      if (!sessionRef.current) sessionRef.current = getSessionId();
      const res = await sendChatMessage({ sessionId: sessionRef.current, text, pagePath: pathname });
      // Giữ hiệu ứng "đang gõ" tối thiểu để cảm giác tự nhiên
      const wait = 650 - (Date.now() - started);
      if (wait > 0) await new Promise((r) => setTimeout(r, wait));
      if (res.ok) setMessages((m) => [...m.filter((x) => x.id !== temp.id), res.user, res.bot]);
      else {
        setError(res.message);
        setMessages((m) => m.filter((x) => x.id !== temp.id));
        setInput(text);
      }
    } catch {
      setError("Mất kết nối, bạn thử lại nhé!");
      setMessages((m) => m.filter((x) => x.id !== temp.id));
      setInput(text);
    } finally {
      setSending(false);
      inputRef.current?.focus({ preventScroll: true });
    }
  };

  const newConversation = () => {
    sessionRef.current = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sessionRef.current);
    setMessages([]);
    setError(null);
  };

  return (
    <>
      {/* Nút mở chat */}
      <div
        className={cn(
          "fixed right-4 z-40 flex items-end gap-2 transition-[bottom] duration-300 sm:right-6 sm:bottom-6",
          stickyBar ? "bottom-24 lg:bottom-6" : "bottom-4",
          open && "pointer-events-none opacity-0 sm:pointer-events-auto sm:opacity-100",
        )}
      >
        <AnimatePresence>
          {bubble && !open && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              className="relative mb-2 max-w-[220px] rounded-2xl rounded-br-md bg-white py-2.5 pr-8 pl-3.5 text-sm shadow-lift ring-1 ring-border/70"
            >
              <button type="button" onClick={openChat} className="text-left">
                Chào bạn 👋 Cần <strong className="text-leaf-700">Bé Sen</strong> tư vấn chọn cây không nè?
              </button>
              <button
                type="button"
                onClick={() => {
                  setBubble(false);
                  sessionStorage.setItem(GREETED_KEY, "1");
                }}
                className="absolute top-1.5 right-1.5 flex size-6 items-center justify-center rounded-full text-muted hover:bg-sand"
                aria-label="Ẩn lời chào"
              >
                <X className="size-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button
          ref={launcherRef}
          type="button"
          onClick={() => (open ? setOpen(false) : openChat())}
          whileHover={reduceMotion ? undefined : { scale: 1.06, rotate: -4 }}
          whileTap={{ scale: 0.94 }}
          className="relative flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-leaf-50 to-accent shadow-lift ring-4 ring-white"
          aria-label={open ? "Đóng khung chat" : "Mở chat với Bé Sen – trợ lý tư vấn"}
          aria-expanded={open}
          aria-controls="senda-chat"
        >
          {!open && !reduceMotion && <span className="absolute inset-0 animate-ping rounded-full bg-leaf-400/25 [animation-duration:2.5s]" aria-hidden />}
          {open ? <X className="size-7 text-leaf-800" /> : <Mascot className="size-12" blink />}
        </motion.button>
      </div>

      {/* Khung chat */}
      <AnimatePresence>
        {open && (
          <motion.section
            id="senda-chat"
            role="dialog"
            aria-label="Chat với Bé Sen"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", damping: 26, stiffness: 300 }}
            style={{ transformOrigin: "bottom right" }}
            className="fixed inset-0 z-50 flex flex-col overflow-hidden bg-background sm:inset-auto sm:right-6 sm:bottom-26 sm:h-[min(640px,calc(100dvh-8.5rem))] sm:w-[390px] sm:rounded-[28px] sm:shadow-[0_24px_60px_rgb(31_42_34/0.22)] sm:ring-1 sm:ring-border"
          >
            {/* Header */}
            <header className="relative flex shrink-0 items-center gap-3 bg-gradient-to-r from-leaf-700 to-leaf-500 px-4 pt-[max(0.85rem,env(safe-area-inset-top))] pb-3.5 text-white">
              <span className="flex size-11 items-center justify-center rounded-full bg-white/95 shadow">
                <Mascot className="size-9" blink />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-bold">Bé Sen 🌱</p>
                <p className="flex items-center gap-1.5 text-xs text-white/85">
                  <span className="size-2 rounded-full bg-green-300 shadow-[0_0_0_3px_rgb(134_239_172/0.3)]" aria-hidden /> Trực tuyến · trả lời ngay
                </p>
              </div>
              <button
                type="button"
                onClick={newConversation}
                className="flex size-9 items-center justify-center rounded-full hover:bg-white/15"
                aria-label="Bắt đầu cuộc trò chuyện mới"
                title="Cuộc trò chuyện mới"
              >
                <RotateCcw className="size-4.5" />
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex size-9 items-center justify-center rounded-full hover:bg-white/15"
                aria-label="Đóng khung chat"
              >
                <X className="size-5" />
              </button>
            </header>

            {/* Tin nhắn */}
            <div ref={listRef} className="chat-bg flex-1 space-y-3 overflow-y-auto overscroll-contain px-3.5 py-4" aria-live="polite">
              {all.map((m) =>
                m.role === "user" ? (
                  <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
                    <p className="max-w-[80%] rounded-2xl rounded-br-md bg-leaf-700 px-3.5 py-2.5 text-[14px] leading-relaxed whitespace-pre-line text-white shadow-soft">
                      {m.content}
                    </p>
                  </motion.div>
                ) : (
                  <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
                    <div className="flex items-end gap-2">
                      <Mascot className="size-8 shrink-0" />
                      <div className="max-w-[82%] rounded-2xl rounded-bl-md bg-white px-3.5 py-2.5 text-[14px] leading-relaxed text-foreground shadow-soft">
                        <ChatRichText text={m.content} onNavigate={onNavigate} />
                      </div>
                    </div>
                    {m.payload?.products && m.payload.products.length > 0 && (
                      <div className="-mx-3.5 flex snap-x gap-2.5 overflow-x-auto pr-3.5 pb-1 pl-[3.25rem]">
                        {m.payload.products.map((p) => (
                          <ProductMiniCard key={p.id} p={p} onNavigate={onNavigate} />
                        ))}
                      </div>
                    )}
                    {m === lastBot && !sending && m.payload?.quickReplies && m.payload.quickReplies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pl-10">
                        {m.payload.quickReplies.map((q) => (
                          <button
                            key={q}
                            type="button"
                            onClick={() => void send(q)}
                            className="rounded-full border border-leaf-300 bg-white px-3 py-1.5 text-[13px] font-medium text-leaf-800 transition hover:-translate-y-0.5 hover:border-leaf-500 hover:bg-leaf-50 active:translate-y-0"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ),
              )}
              {open && !loaded && <p className="text-center text-xs text-muted">Đang tải cuộc trò chuyện...</p>}
              {sending && <TypingBubble />}
            </div>

            {/* Ô nhập */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void send(input);
              }}
              className="shrink-0 border-t border-border bg-white px-3 pt-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
            >
              {error && (
                <p className="mb-2 rounded-xl bg-amber-50 px-3 py-1.5 text-xs text-amber-900" role="alert">
                  {error}
                </p>
              )}
              <div className="flex items-end gap-2 rounded-3xl bg-sand/70 py-1.5 pr-1.5 pl-4 ring-1 ring-transparent transition focus-within:bg-white focus-within:ring-leaf-400">
                <label htmlFor="chat-input" className="sr-only">
                  Nhập tin nhắn
                </label>
                <textarea
                  id="chat-input"
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value.slice(0, MAX_LEN))}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                      e.preventDefault();
                      void send(input);
                    }
                  }}
                  rows={1}
                  placeholder="Nhắn cho Bé Sen..."
                  className="max-h-28 min-h-[36px] flex-1 resize-none bg-transparent py-2 text-[15px] outline-none [field-sizing:content] placeholder:text-muted/70"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || sending}
                  className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-soft transition hover:bg-primary-hover disabled:bg-leaf-200 disabled:shadow-none"
                  aria-label="Gửi tin nhắn"
                >
                  <SendHorizontal className="size-[18px]" />
                </button>
              </div>
              <p className="mt-1.5 text-center text-[11px] text-muted">Bé Sen là trợ lý tự động · Cần gấp? Gọi hotline shop nhé</p>
            </form>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
