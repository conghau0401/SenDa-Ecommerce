import "server-only";
import { cookies } from "next/headers";
import { signValue, unsignValue } from "./signed-cookie";

/**
 * Cookie có chữ ký lưu các mã đơn vừa đặt trên trình duyệt này.
 * Trang cảm ơn chỉ hiển thị chi tiết (tên, SĐT, địa chỉ) khi mã đơn có trong cookie –
 * tránh người khác đoán mã đơn để xem thông tin cá nhân.
 */
const COOKIE = "senda_recent_orders";
const MAX = 5;

export async function getRecentOrderCodes(): Promise<string[]> {
  const raw = unsignValue((await cookies()).get(COOKIE)?.value);
  return raw ? raw.split(",").filter(Boolean) : [];
}

export async function rememberOrderCode(code: string) {
  const codes = [code, ...(await getRecentOrderCodes()).filter((c) => c !== code)].slice(0, MAX);
  (await cookies()).set(COOKIE, signValue(codes.join(",")), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}
