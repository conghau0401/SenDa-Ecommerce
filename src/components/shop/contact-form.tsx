"use client";

import { startTransition, useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { CheckCircle2, Send } from "lucide-react";
import { submitContact } from "@/actions/contact";
import { Button } from "../ui/button";
import { FormField, fieldAria, inputClass } from "../ui/form-field";

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, null);
  const formRef = useRef<HTMLFormElement>(null);
  const errors = state && !state.ok ? state.errors : undefined;

  useEffect(() => {
    if (!state) return;
    if (state.ok) formRef.current?.reset();
    else if (!state.errors) toast.error(state.message);
  }, [state]);

  if (state?.ok) {
    return (
      <div className="flex flex-col items-center rounded-[1.5rem] bg-leaf-50 px-6 py-12 text-center" role="status">
        <CheckCircle2 className="size-12 text-leaf-600" aria-hidden />
        <p className="mt-4 text-lg font-semibold text-leaf-900">Đã gửi thành công!</p>
        <p className="mt-1 text-muted">{state.message}</p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      noValidate
      className="space-y-5"
      onSubmit={(e) => {
        // Gọi action thủ công để React không tự reset form khi có lỗi validate
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => action(data));
      }}
    >
      {/* Honeypot – ẩn với người dùng */}
      <div className="absolute -left-[9999px]" aria-hidden>
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <FormField id="contact-name" label="Họ tên" required error={errors?.name}>
          <input {...fieldAria("contact-name", errors?.name)} name="name" autoComplete="name" className={inputClass} placeholder="Nguyễn Văn A" />
        </FormField>
        <FormField id="contact-contact" label="Số điện thoại hoặc email" required error={errors?.contact}>
          <input
            {...fieldAria("contact-contact", errors?.contact)}
            name="contact"
            autoComplete="tel"
            className={inputClass}
            placeholder="0901 234 567"
          />
        </FormField>
      </div>
      <FormField id="contact-message" label="Nội dung" required error={errors?.message}>
        <textarea
          {...fieldAria("contact-message", errors?.message)}
          name="message"
          rows={5}
          className={inputClass}
          placeholder="Bạn cần shop tư vấn điều gì?"
        />
      </FormField>
      <Button type="submit" size="lg" loading={pending} className="w-full sm:w-auto">
        {!pending && <Send className="size-4" aria-hidden />}
        Gửi liên hệ
      </Button>
    </form>
  );
}
