"use client";

import { startTransition, useActionState } from "react";
import { LogIn } from "lucide-react";
import { login } from "@/actions/auth";
import { Button } from "../ui/button";
import { FormField, fieldAria, inputClass } from "../ui/form-field";

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(login, null);
  const errors = state && !state.ok ? state.errors : undefined;

  return (
    <form
      noValidate
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => action(data));
      }}
    >
      <input type="hidden" name="next" value={next} />
      {state && !state.ok && !errors && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {state.message}
        </p>
      )}
      <FormField id="login-email" label="Email" error={errors?.email}>
        <input
          {...fieldAria("login-email", errors?.email)}
          name="email"
          type="email"
          autoComplete="username"
          autoFocus
          className={inputClass}
        />
      </FormField>
      <FormField id="login-password" label="Mật khẩu" error={errors?.password}>
        <input
          {...fieldAria("login-password", errors?.password)}
          name="password"
          type="password"
          autoComplete="current-password"
          className={inputClass}
        />
      </FormField>
      <Button type="submit" size="lg" className="w-full" loading={pending}>
        {!pending && <LogIn className="size-4" aria-hidden />}
        Đăng nhập
      </Button>
    </form>
  );
}
