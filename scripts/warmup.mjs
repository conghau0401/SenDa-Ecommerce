/**
 * Làm nóng dev server: mở trước mọi trang để Next.js biên dịch sẵn,
 * tránh chờ 1–3 giây ở lần đầu bấm mỗi menu khi chạy `npm run dev`.
 *
 *   npm run warmup              # dev server đang chạy ở http://localhost:3000
 *   npm run warmup -- 3001      # cổng khác
 *   npm run dev:warm            # chạy dev server + tự warmup (xem scripts/dev-warm.mjs)
 *
 * Trang admin cần đăng nhập: script tự tạo phiên tạm (JWT) bằng SESSION_SECRET trong .env,
 * chỉ gửi tới localhost. Không dùng cho production.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Nạp .env vào process.env (không ghi đè biến đã có) */
function loadEnv() {
  const file = path.join(ROOT, ".env");
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*"?(.*?)"?\s*$/i);
    if (m && !line.trim().startsWith("#") && process.env[m[1]] === undefined) process.env[m[1]] = m[2];
  }
}

async function waitForServer(base, timeoutMs = 180_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(`${base}/robots.txt`, { signal: AbortSignal.timeout(60_000) });
      if (res.ok) return true;
    } catch {
      /* server chưa sẵn sàng */
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  return false;
}

/** Lấy slug/id mẫu từ DB để làm nóng các trang chi tiết */
async function samples() {
  const { PrismaClient } = await import("@prisma/client");
  const db = new PrismaClient();
  try {
    const [product, category, post, order, conversation, admin] = await Promise.all([
      db.product.findFirst({ where: { isActive: true }, select: { id: true, slug: true } }),
      db.category.findFirst({ where: { isActive: true }, select: { slug: true } }),
      db.post.findFirst({ where: { status: "PUBLISHED" }, select: { id: true, slug: true } }),
      db.order.findFirst({ select: { id: true } }),
      db.chatConversation.findFirst({ select: { id: true } }),
      db.adminUser.findFirst({ select: { id: true, email: true, name: true } }),
    ]);
    return { product, category, post, order, conversation, admin };
  } finally {
    await db.$disconnect();
  }
}

/** Cookie phiên admin – cùng định dạng với src/lib/session-token.ts */
async function adminCookie(admin) {
  const secret = process.env.SESSION_SECRET;
  if (!admin || !secret || secret.length < 32) return null;
  const { SignJWT } = await import("jose");
  const token = await new SignJWT({ email: admin.email, name: admin.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(admin.id))
    .setIssuedAt()
    .setExpirationTime("10m")
    .sign(new TextEncoder().encode(secret));
  return `senda_admin=${token}`;
}

export async function warmup(base = "http://localhost:3000") {
  loadEnv();
  process.stdout.write(`⏳ Chờ dev server tại ${base}...`);
  if (!(await waitForServer(base))) {
    console.log(`\n✗ Không kết nối được ${base}. Hãy chạy "npm run dev" trước.`);
    process.exitCode = 1;
    return;
  }
  console.log(" sẵn sàng");

  const s = await samples();
  const cookie = await adminCookie(s.admin);

  const shop = [
    "/",
    "/san-pham",
    s.product && `/san-pham/${s.product.slug}`,
    s.category && `/danh-muc/${s.category.slug}`,
    "/tin-tuc",
    s.post && `/tin-tuc/${s.post.slug}`,
    "/lien-he",
    "/tra-cuu-don-hang",
    "/thanh-toan",
    "/dat-hang-thanh-cong/SD000000-XXXX",
    "/trang-khong-ton-tai",
    "/sitemap.xml",
  ].filter(Boolean);
  const admin = [
    "/admin/login",
    "/admin",
    "/admin/don-hang",
    s.order && `/admin/don-hang/${s.order.id}`,
    "/admin/san-pham",
    "/admin/san-pham/moi",
    s.product && `/admin/san-pham/${s.product.id}`,
    "/admin/danh-muc",
    "/admin/tin-tuc",
    "/admin/tin-tuc/moi",
    s.post && `/admin/tin-tuc/${s.post.id}`,
    "/admin/lien-he",
    "/admin/chatbot",
    s.conversation && `/admin/chatbot/${s.conversation.id}`,
    "/admin/chatbot/kien-thuc",
    "/admin/cai-dat",
  ].filter(Boolean);

  const started = Date.now();
  let ok = 0;
  const all = [...shop.map((p) => [p, false]), ...admin.map((p) => [p, p !== "/admin/login"])];
  for (const [p, needAuth] of all) {
    const t0 = Date.now();
    let status = "lỗi";
    try {
      const res = await fetch(base + p, {
        headers: needAuth && cookie ? { cookie } : {},
        redirect: "manual",
        signal: AbortSignal.timeout(180_000),
      });
      status = String(res.status);
      await res.arrayBuffer(); // đọc hết để trang render xong
      if (res.status < 500) ok++;
    } catch (err) {
      status = `lỗi (${err.name})`;
    }
    const ms = Date.now() - t0;
    console.log(`  ${status.startsWith("5") || status.startsWith("lỗi") ? "✗" : "✓"} ${p.padEnd(42)} ${status.padEnd(4)} ${String(ms).padStart(6)} ms`);
  }
  if (!cookie) console.log("  (bỏ qua đăng nhập admin: thiếu SESSION_SECRET hoặc chưa có tài khoản admin – trang admin chỉ được làm nóng một phần)");
  console.log(`🔥 Xong ${ok}/${all.length} trang trong ${((Date.now() - started) / 1000).toFixed(1)} giây – giờ bấm menu sẽ không phải chờ biên dịch.`);
}

// Chạy trực tiếp: node scripts/warmup.mjs [cổng|url]
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const arg = process.argv[2];
  const base = !arg ? "http://localhost:3000" : /^\d+$/.test(arg) ? `http://localhost:${arg}` : arg.replace(/\/$/, "");
  await warmup(base);
}
