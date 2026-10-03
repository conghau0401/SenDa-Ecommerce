import { z } from "zod";

/** Chuẩn hóa SĐT: bỏ khoảng trắng/dấu chấm/gạch, +84 -> 0 */
export function normalizePhone(input: string): string {
  const digits = input.replace(/[\s.\-()]/g, "");
  return digits.startsWith("+84") ? `0${digits.slice(3)}` : digits.startsWith("84") && digits.length === 11 ? `0${digits.slice(2)}` : digits;
}

/** SĐT di động VN: 10 số, đầu 03/05/07/08/09 */
export const VN_PHONE_REGEX = /^0(3|5|7|8|9)\d{8}$/;

export function isVietnamesePhone(input: string): boolean {
  return VN_PHONE_REGEX.test(normalizePhone(input));
}

export const phoneSchema = z
  .string({ required_error: "Vui lòng nhập số điện thoại" })
  .trim()
  .min(1, "Vui lòng nhập số điện thoại")
  .transform(normalizePhone)
  .refine((v) => VN_PHONE_REGEX.test(v), "Số điện thoại không hợp lệ (VD: 0901234567)");

/** Map lỗi zod -> { field: message } (lấy lỗi đầu tiên mỗi field) */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "_form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export type ActionResult<T = undefined> =
  | { ok: true; data?: T; message?: string }
  | { ok: false; message: string; errors?: Record<string, string> };
