import { normalizePhone, VN_PHONE_REGEX } from "../validators/common";

/** Chữ thường, bỏ dấu tiếng Việt, chỉ giữ chữ/số, gộp khoảng trắng: "Phí ship bao nhiêu?" -> "phi ship bao nhieu" */
export function normalize(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Chữ thường giữ nguyên dấu – để phân biệt "đỏ"/"đồ"/"đó" khi cần */
export function lowerAccented(input: string): string {
  return input.normalize("NFC").toLowerCase().replace(/\s+/g, " ").trim();
}

export type TextForms = { raw: string; accented: string; plain: string };

export function textForms(raw: string): TextForms {
  return { raw, accented: lowerAccented(raw), plain: normalize(raw) };
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const hasAccent = (s: string) => /[^\x00-\x7f]/.test(s);

/**
 * Câu có chứa cụm từ (khớp nguyên từ) không.
 * Cụm từ có dấu -> so trên chữ có dấu (chính xác); không dấu -> so trên chữ đã bỏ dấu (khách gõ không dấu vẫn khớp).
 */
export function hasPhrase(t: TextForms, phrase: string): boolean {
  const p = phrase.trim().toLowerCase();
  if (!p) return false;
  if (hasAccent(p)) {
    return new RegExp(`(^|[^\\p{L}\\p{N}])${escapeRe(p.normalize("NFC"))}($|[^\\p{L}\\p{N}])`, "u").test(t.accented);
  }
  const np = normalize(p);
  return np.length > 0 && ` ${t.plain} `.includes(` ${np} `);
}

/** Điểm khớp: cụm nhiều từ được cộng nhiều điểm hơn (cụ thể hơn) */
export function phraseScore(t: TextForms, phrases: readonly string[], weight = 1): number {
  let score = 0;
  for (const p of phrases) {
    if (hasPhrase(t, p)) score += weight * (1 + 0.5 * (p.trim().split(/\s+/).length - 1));
  }
  return score;
}

/* ------------------------------------------------------------------ */
/* Trích xuất thông tin                                                */
/* ------------------------------------------------------------------ */

/** Mã đơn dạng SD261003-7K2F (cho phép thiếu gạch, viết thường) */
export function extractOrderCode(raw: string): string | null {
  const m = raw.toUpperCase().match(/\bSD\s?(\d{6})\s?-?\s?([A-Z0-9]{4})\b/);
  return m ? `SD${m[1]}-${m[2]}` : null;
}

/** SĐT di động VN trong câu */
export function extractPhone(raw: string): string | null {
  const candidates = raw.match(/(\+?84|0)[\d\s.\-]{8,13}\d/g) ?? [];
  for (const c of candidates) {
    const p = normalizePhone(c);
    if (VN_PHONE_REGEX.test(p)) return p;
  }
  return null;
}

export type Budget = { min?: number; max?: number };

/**
 * Ngân sách trong câu: "dưới 100k", "khoảng 200 nghìn", "tầm 1tr", "từ 50k đến 150k", "rẻ thôi"...
 */
export function extractBudget(t: TextForms): Budget | null {
  const s = t.plain;
  const toVnd = (num: string, unit: string | undefined, hasBudgetWord: boolean): number | null => {
    const n = Number(num.replace(/[.,](?=\d{3}\b)/g, "").replace(",", "."));
    if (!Number.isFinite(n) || n <= 0) return null;
    switch (unit) {
      case "k":
      case "nghin":
      case "ngan":
      case "n":
        return Math.round(n * 1000);
      case "tr":
      case "trieu":
      case "cu":
        return Math.round(n * 1_000_000);
      case "d":
      case "dong":
      case "vnd":
        return n >= 1000 ? Math.round(n) : null;
      default:
        if (n >= 10_000) return Math.round(n); // 150000
        if (hasBudgetWord && n < 1000) return Math.round(n * 1000); // "dưới 100" = 100k
        return null;
    }
  };

  const unit = "(k|nghin|ngan|n|tr|trieu|cu|d|dong|vnd)?";
  const num = "(\\d{1,3}(?:[.,]\\d{3})+|\\d+(?:[.,]\\d+)?)";

  // Khoảng: "từ 50k đến 150k", "50k - 150k"
  const range = s.match(new RegExp(`(?:tu\\s+)?${num}\\s*${unit}\\s*(?:den|toi|\\s)\\s*${num}\\s*${unit}\\b`));
  if (range && /\b(tu|den|toi)\b/.test(range[0])) {
    const a = toVnd(range[1], range[2] || range[4], true);
    const b = toVnd(range[3], range[4] || range[2], true);
    if (a && b) return { min: Math.min(a, b), max: Math.max(a, b) };
  }

  const re = new RegExp(`(duoi|toi da|khong qua|max|tren|hon|tu|khoang|tam|co|gia|ngan sach|budget)?\\s*${num}\\s*${unit}\\b`, "g");
  for (const m of s.matchAll(re)) {
    const word = m[1];
    // bỏ qua số điện thoại / mã đơn / số lượng ("2 chau")
    if (m[2].replace(/\D/g, "").length >= 8) continue;
    const v = toVnd(m[2], m[3], !!word);
    if (!v || v < 5_000 || v > 50_000_000) continue;
    if (word === "duoi" || word === "toi da" || word === "khong qua" || word === "max") return { max: v };
    if (word === "tren" || word === "hon" || word === "tu") return { min: v };
    return { min: Math.round(v * 0.6), max: Math.round(v * 1.25) };
  }

  if (/\b(re|gia re|re re|binh dan|sinh vien|tiet kiem)\b/.test(s)) return { max: 60_000 };
  return null;
}
