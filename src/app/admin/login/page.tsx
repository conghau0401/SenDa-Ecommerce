import type { Metadata } from "next";
import { Leaf } from "lucide-react";
import { getSettings } from "@/lib/settings";
import { LoginForm } from "@/components/admin/login-form";
import { PROJECT } from "@/lib/project";

export const metadata: Metadata = { title: "Đăng nhập" };

type Props = { searchParams: Promise<{ next?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const [{ next }, { store }] = await Promise.all([searchParams, getSettings()]);
  return (
    <main className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-leaf-50 via-background to-leaf-100 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-primary text-white shadow-lift">
            <Leaf className="size-7" aria-hidden />
          </span>
          <h1 className="mt-4 text-2xl font-bold text-leaf-900">{store.name}</h1>
          <p className="text-sm text-muted">Đăng nhập trang quản trị</p>
        </div>
        <div className="rounded-[1.5rem] bg-surface p-6 shadow-lift ring-1 ring-border/60 sm:p-8">
          <LoginForm next={next ?? "/admin"} />
        </div>
        <p className="mt-6 text-center text-xs leading-relaxed text-muted">
          {PROJECT.type} · {PROJECT.student} – MSSV {PROJECT.studentId}
          <br />
          {PROJECT.school}
        </p>
      </div>
    </main>
  );
}
