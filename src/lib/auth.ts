import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "./prisma";
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession, verifySession } from "./session-token";

export async function createSession(user: { id: number; email: string; name: string }) {
  const token = await signSession({ sub: String(user.id), email: user.email, name: user.name });
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete(SESSION_COOKIE);
}

/** Admin hiện tại (đã kiểm tra token + còn tồn tại trong DB), null nếu chưa đăng nhập */
export const getCurrentAdmin = cache(async () => {
  const session = await verifySession((await cookies()).get(SESSION_COOKIE)?.value);
  if (!session) return null;
  const id = Number(session.sub);
  if (!Number.isInteger(id)) return null;
  return prisma.adminUser.findUnique({ where: { id }, select: { id: true, email: true, name: true } });
});

/** Dùng trong trang/server action admin: chuyển về trang đăng nhập nếu chưa đăng nhập */
export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
