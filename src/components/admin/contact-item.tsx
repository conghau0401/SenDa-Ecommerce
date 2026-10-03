"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Mail, Phone, RotateCcw, Trash2 } from "lucide-react";
import { deleteContact, setContactHandled } from "@/actions/admin/contacts";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ConfirmButton } from "./confirm-button";

type Contact = { id: number; name: string; contact: string; message: string; isHandled: boolean; createdAt: Date };

export function ContactItem({ c }: { c: Contact }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const isEmail = c.contact.includes("@");

  const toggle = () =>
    startTransition(async () => {
      const res = await setContactHandled(c.id, !c.isHandled).catch(() => ({ ok: false, message: "Mất kết nối" }));
      if (res.ok) {
        toast.success(res.message);
        router.refresh();
      } else toast.error(res.message);
    });

  return (
    <article className={cn("rounded-2xl bg-surface p-5 shadow-soft ring-1 ring-border/70", c.isHandled && "opacity-70")}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 font-semibold text-leaf-900">
            {c.name}
            {!c.isHandled && <span className="size-2 rounded-full bg-sale" aria-label="Chưa xử lý" />}
          </h3>
          <a
            href={isEmail ? `mailto:${c.contact}` : `tel:${c.contact}`}
            className="mt-0.5 inline-flex items-center gap-1.5 text-sm text-leaf-700 hover:underline"
          >
            {isEmail ? <Mail className="size-3.5" aria-hidden /> : <Phone className="size-3.5" aria-hidden />}
            {c.contact}
          </a>
        </div>
        <time className="text-xs text-muted" dateTime={c.createdAt.toISOString()}>
          {formatDateTime(c.createdAt)}
        </time>
      </div>
      <p className="mt-3 text-sm leading-relaxed whitespace-pre-line">{c.message}</p>
      <div className="mt-4 flex items-center justify-end gap-2 border-t border-border pt-3">
        <ConfirmButton
          title="Xóa liên hệ này?"
          action={() => deleteContact(c.id)}
          onDone={() => router.refresh()}
          ariaLabel={`Xóa liên hệ của ${c.name}`}
          className="flex size-9 items-center justify-center rounded-full text-muted hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="size-4" />
        </ConfirmButton>
        <Button size="sm" variant={c.isHandled ? "ghost" : "secondary"} onClick={toggle} loading={pending}>
          {!pending && (c.isHandled ? <RotateCcw className="size-4" aria-hidden /> : <Check className="size-4" aria-hidden />)}
          {c.isHandled ? "Đánh dấu chưa xử lý" : "Đã xử lý"}
        </Button>
      </div>
    </article>
  );
}
