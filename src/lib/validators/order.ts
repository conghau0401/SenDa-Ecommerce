import { z } from "zod";
import { PAYMENT_METHODS } from "../constants";
import { phoneSchema } from "./common";

export const checkoutItemSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().min(1, "Số lượng tối thiểu là 1").max(99, "Số lượng tối đa là 99"),
});

export const checkoutSchema = z.object({
  customerName: z.string().trim().min(2, "Vui lòng nhập họ tên").max(100, "Họ tên quá dài"),
  phone: phoneSchema,
  address: z
    .string()
    .trim()
    .min(10, "Vui lòng nhập địa chỉ đầy đủ (số nhà, đường, phường/xã, quận/huyện, tỉnh/thành)")
    .max(500, "Địa chỉ quá dài"),
  note: z.string().trim().max(500, "Ghi chú tối đa 500 ký tự").optional().default(""),
  paymentMethod: z.enum(PAYMENT_METHODS, { message: "Vui lòng chọn phương thức thanh toán" }).default("COD"),
  items: z.array(checkoutItemSchema).min(1, "Giỏ hàng đang trống").max(50, "Giỏ hàng quá nhiều sản phẩm"),
});

export type CheckoutInput = z.input<typeof checkoutSchema>;

/** Chỉ phần thông tin khách – dùng validate phía client */
export const customerSchema = checkoutSchema.pick({ customerName: true, phone: true, address: true, note: true });

export const lookupSchema = z.object({
  phone: phoneSchema,
  code: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập mã đơn hàng")
    .max(30)
    .transform((v) => v.toUpperCase().replace(/\s/g, "")),
});
