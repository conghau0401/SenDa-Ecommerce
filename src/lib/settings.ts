import "server-only";
import { cache } from "react";
import { prisma } from "./prisma";
import { SETTING_SCHEMAS, type SettingKey, type Settings } from "./settings-schema";

export * from "./settings-schema";

function parseGroup<K extends SettingKey>(key: K, raw: string | undefined): Settings[K] {
  const schema = SETTING_SCHEMAS[key];
  let json: unknown = {};
  try {
    json = raw ? JSON.parse(raw) : {};
  } catch {
    json = {};
  }
  const result = schema.safeParse(json);
  return (result.success ? result.data : schema.parse({})) as Settings[K];
}

/** Đọc toàn bộ cài đặt (được cache trong 1 request) */
export const getSettings = cache(async (): Promise<Settings> => {
  const rows = await prisma.setting.findMany();
  const map = new Map(rows.map((r) => [r.key, r.value]));
  return {
    store: parseGroup("store", map.get("store")),
    social: parseGroup("social", map.get("social")),
    bank: parseGroup("bank", map.get("bank")),
    shipping: parseGroup("shipping", map.get("shipping")),
    home: parseGroup("home", map.get("home")),
  };
});

export async function saveSetting<K extends SettingKey>(key: K, value: Settings[K]) {
  const json = JSON.stringify(value);
  await prisma.setting.upsert({
    where: { key },
    create: { key, value: json },
    update: { value: json },
  });
}
