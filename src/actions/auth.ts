"use server";

import bcrypt from "bcryptjs";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession, requireAdmin } from "@/lib/auth";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit";
import { fieldErrors, type ActionResult } from "@/lib/validators/common";

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

// Hash giả để so sánh khi email không tồn tại (thời gian phản hồi như nhau)
const DUMMY_HASH = bcrypt.hashSync("not-a-real-password", 10);

/** Chỉ cho phép chuyển hướng nội bộ trong /admin */
function safeNext(next: unknown): string {
  return typeof next === "string" && next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin";
}

export async function login(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { ok: false, message: "Vui lòng kiểm tra lại", errors: fieldErrors(parsed.error) };

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const rlKey = `login:${ip}:${parsed.data.email}`;
  const rl = checkRateLimit(rlKey, 5, 15 * 60 * 1000);
  if (!rl.ok) {
    return { ok: false, message: `Đăng nhập sai quá nhiều lần. Thử lại sau ${Math.ceil(rl.retryAfterSec / 60)} phút.` };
  }

  const user = await prisma.adminUser.findUnique({ where: { email: parsed.data.email } });
  // Luôn so sánh hash (kể cả khi không có user) để không lộ email tồn tại qua thời gian phản hồi
  const valid = await bcrypt.compare(parsed.data.password, user?.passwordHash ?? DUMMY_HASH);
  if (!user || !valid) return { ok: false, message: "Email hoặc mật khẩu không đúng" };

  resetRateLimit(rlKey);
  await createSession(user);
  redirect(safeNext(formData.get("next")));
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

const passwordSchema = z
  .object({
    current: z.string().min(1, "Nhập mật khẩu hiện tại"),
    next: z.string().min(8, "Mật khẩu mới tối thiểu 8 ký tự").max(100),
    confirm: z.string(),
  })
  .refine((d) => d.next === d.confirm, { path: ["confirm"], message: "Mật khẩu nhập lại không khớp" });

export async function changePassword(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  const admin = await requireAdmin();
  const parsed = passwordSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { ok: false, message: "Vui lòng kiểm tra lại", errors: fieldErrors(parsed.error) };

  const user = await prisma.adminUser.findUniqueOrThrow({ where: { id: admin.id } });
  if (!(await bcrypt.compare(parsed.data.current, user.passwordHash))) {
    return { ok: false, message: "Mật khẩu hiện tại không đúng", errors: { current: "Mật khẩu hiện tại không đúng" } };
  }
  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { passwordHash: await bcrypt.hash(parsed.data.next, 10) },
  });
  return { ok: true, message: "Đã đổi mật khẩu" };
}
