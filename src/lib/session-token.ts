import { jwtVerify, SignJWT } from "jose";

/**
 * Token phiên admin (JWT HS256) – dùng được ở cả Edge middleware và Node.
 * Không import prisma/node APIs ở đây.
 */
export const SESSION_COOKIE = "senda_admin";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 ngày

export type SessionPayload = { sub: string; email: string; name: string };

function key() {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("SESSION_SECRET phải có ít nhất 32 ký tự (xem .env)");
  return new TextEncoder().encode(secret);
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ email: payload.email, name: payload.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(key());
}

export async function verifySession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, key(), { algorithms: ["HS256"] });
    if (!payload.sub) return null;
    return { sub: payload.sub, email: String(payload.email ?? ""), name: String(payload.name ?? "") };
  } catch {
    return null;
  }
}
