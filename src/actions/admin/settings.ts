"use server";

import { requireAdmin } from "@/lib/auth";
import { revalidateStore } from "@/lib/revalidate";
import { SETTING_SCHEMAS, saveSetting, type SettingKey, type Settings } from "@/lib/settings";
import { fieldErrors, type ActionResult } from "@/lib/validators/common";

export async function saveSettings<K extends SettingKey>(key: K, value: unknown): Promise<ActionResult> {
  await requireAdmin();
  const schema = SETTING_SCHEMAS[key];
  if (!schema) return { ok: false, message: "Nhóm cài đặt không hợp lệ" };
  const parsed = schema.safeParse(value);
  if (!parsed.success) return { ok: false, message: "Vui lòng kiểm tra lại", errors: fieldErrors(parsed.error) };

  // Bản đồ: chấp nhận dán cả đoạn <iframe ...>, chỉ lấy src
  if (key === "store") {
    const store = parsed.data as Settings["store"];
    const m = store.mapEmbedUrl.match(/src=["']([^"']+)["']/);
    if (m) store.mapEmbedUrl = m[1];
  }

  try {
    await saveSetting(key, parsed.data as Settings[K]);
  } catch (err) {
    console.error("saveSettings", err);
    return { ok: false, message: "Không thể lưu cài đặt" };
  }
  revalidateStore();
  return { ok: true, message: "Đã lưu cài đặt" };
}
