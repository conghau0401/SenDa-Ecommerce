/**
 * UUID v4 dùng được ở mọi môi trường.
 * crypto.randomUUID() chỉ có trong "secure context" (HTTPS hoặc localhost) – mở web qua
 * http://192.168.x.x (điện thoại trong mạng LAN) sẽ không có hàm này. Khi đó tự tạo UUID v4
 * từ crypto.getRandomValues() (có ở mọi trình duyệt, kể cả trang http).
 */
export function randomUUID(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  const b = new Uint8Array(16);
  crypto.getRandomValues(b);
  b[6] = (b[6] & 0x0f) | 0x40; // version 4
  b[8] = (b[8] & 0x3f) | 0x80; // variant RFC 4122
  const h = Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}
