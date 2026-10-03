import { z } from "zod";

/**
 * Schema cài đặt cửa hàng (dùng được cả client & server).
 * Lưu trong bảng Setting dạng key-value (value = JSON), mỗi nhóm là 1 key.
 */

const optionalUrl = z.string().trim().max(500).optional().default("");

export const storeSettingsSchema = z.object({
  name: z.string().trim().min(1).max(100).default("Sen Đá Xinh"),
  slogan: z.string().trim().max(200).default(""),
  logo: z.string().trim().max(500).default(""),
  phone: z.string().trim().max(30).default(""),
  email: z.string().trim().max(100).default(""),
  address: z.string().trim().max(300).default(""),
  workingHours: z.string().trim().max(200).default(""),
  mapEmbedUrl: optionalUrl,
});

export const socialSettingsSchema = z.object({
  facebook: optionalUrl,
  instagram: optionalUrl,
  tiktok: optionalUrl,
  youtube: optionalUrl,
  zalo: optionalUrl,
});

export const bankSettingsSchema = z.object({
  bankId: z.string().trim().max(30).default(""), // mã ngân hàng VietQR, VD: VCB, MB, 970436
  bankName: z.string().trim().max(100).default(""),
  accountNumber: z.string().trim().max(30).default(""),
  accountName: z.string().trim().max(100).default(""),
});

export const shippingSettingsSchema = z.object({
  fee: z.coerce.number().int().min(0).default(30000),
  /** Miễn phí ship khi tạm tính >= giá trị này. 0 = không áp dụng */
  freeThreshold: z.coerce.number().int().min(0).default(500000),
});

export const bannerSchema = z.object({
  image: z.string().trim().min(1).max(500),
  title: z.string().trim().max(150).default(""),
  subtitle: z.string().trim().max(300).default(""),
  ctaText: z.string().trim().max(50).default(""),
  ctaLink: z.string().trim().max(300).default(""),
});

export const homeSettingsSchema = z.object({
  banners: z.array(bannerSchema).max(6).default([]),
});

export const SETTING_SCHEMAS = {
  store: storeSettingsSchema,
  social: socialSettingsSchema,
  bank: bankSettingsSchema,
  shipping: shippingSettingsSchema,
  home: homeSettingsSchema,
} as const;

export type SettingKey = keyof typeof SETTING_SCHEMAS;
export type Settings = { [K in SettingKey]: z.infer<(typeof SETTING_SCHEMAS)[K]> };
export type Banner = z.infer<typeof bannerSchema>;

/** Phí ship theo tạm tính */
export function calcShippingFee(subtotal: number, shipping: Settings["shipping"]): number {
  if (subtotal <= 0) return 0;
  if (shipping.freeThreshold > 0 && subtotal >= shipping.freeThreshold) return 0;
  return shipping.fee;
}

/** URL ảnh QR VietQR cho đơn chuyển khoản */
export function vietQrUrl(bank: Settings["bank"], amount: number, content: string): string | null {
  if (!bank.bankId || !bank.accountNumber) return null;
  const params = new URLSearchParams({
    amount: String(amount),
    addInfo: content,
    accountName: bank.accountName,
  });
  return `https://img.vietqr.io/image/${encodeURIComponent(bank.bankId)}-${encodeURIComponent(
    bank.accountNumber,
  )}-compact2.png?${params.toString()}`;
}
