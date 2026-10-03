import { z } from "zod";
import { isVietnamesePhone, normalizePhone } from "./common";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Vui lòng nhập họ tên").max(100, "Họ tên quá dài"),
  contact: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập SĐT hoặc email")
    .max(120)
    .refine((v) => isVietnamesePhone(v) || EMAIL_REGEX.test(v), "Vui lòng nhập SĐT hợp lệ hoặc email")
    .transform((v) => (EMAIL_REGEX.test(v) ? v.toLowerCase() : normalizePhone(v))),
  message: z
    .string()
    .trim()
    .min(10, "Nội dung tối thiểu 10 ký tự")
    .max(2000, "Nội dung tối đa 2000 ký tự"),
});

export type ContactInput = z.input<typeof contactSchema>;
