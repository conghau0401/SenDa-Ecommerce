/**
 * CÔNG CỤ (không bắt buộc): tải ảnh sen đá giấy phép tự do từ Wikimedia Commons
 * về thư mục nháp .seed-raw/ kèm manifest.json (tác giả + giấy phép).
 *
 * Bộ ảnh seed chính thức đã được chọn lọc, nén WebP và lưu sẵn trong prisma/seed-images/
 * (kèm CREDITS.md), nên `npm run db:seed` KHÔNG cần mạng. Chỉ dùng script này khi muốn
 * làm mới bộ ảnh: chạy, xem lại ảnh, rồi chép những ảnh đạt vào prisma/seed-images/.
 *
 * Chạy: npx tsx scripts/fetch-seed-images.ts
 */
import fs from "node:fs/promises";
import path from "node:path";

export const SEED_DIR = path.join(process.cwd(), ".seed-raw");
export const MANIFEST_PATH = path.join(SEED_DIR, "manifest.json");

export type SeedImage = {
  file: string;
  group: string;
  title: string;
  author: string;
  license: string;
  source: string;
};
export type SeedManifest = Record<string, SeedImage[]>;

const UA = "SenDaShopSeed/1.0 (local development seed script)";

/** Nhóm ảnh -> các từ khóa tìm kiếm, số ảnh cần lấy */
const GROUPS: Record<string, { queries: string[]; count: number }> = {
  echeveria: { queries: ["Echeveria rosette", "Echeveria elegans", "Echeveria plant"], count: 14 },
  haworthia: { queries: ["Haworthia cooperi", "Haworthia"], count: 6 },
  string: { queries: ["Senecio rowleyanus", "Sedum morganianum", "Curio rowleyanus"], count: 6 },
  redEdge: { queries: ["Echeveria agavoides", "Crassula capitella", "Sedum adolphi"], count: 7 },
  cactus: { queries: ["Mammillaria flower", "Gymnocalycium", "Astrophytum"], count: 9 },
  terrarium: { queries: ["succulent terrarium", "terrarium plants glass"], count: 5 },
  pot: { queries: ["succulents in pots", "succulent pot", "potted succulent"], count: 7 },
  soil: { queries: ["perlite", "potting soil", "pumice stones"], count: 4 },
  graptopetalum: { queries: ["Graptopetalum paraguayense", "Graptoveria", "Pachyphytum"], count: 6 },
  banner: { queries: ["succulent garden", "succulents collection", "succulent plants"], count: 8 },
};

const EXCLUDE = /(mhnt|herbar|drawing|illustrat|plate|map\b|specimen|stamp|book|diagram|botanical_magazine|curtis|\.svg|\.tif|\.gif|logo|distribution|chart|x-ray|scan)/i;

type ApiPage = {
  title: string;
  imageinfo?: {
    width: number;
    height: number;
    thumburl?: string;
    descriptionurl: string;
    mime?: string;
    extmetadata?: Record<string, { value: string }>;
  }[];
};

const stripHtml = (s: string) => s.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

async function search(query: string): Promise<ApiPage[]> {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    generator: "search",
    gsrnamespace: "6",
    gsrsearch: `${query} filetype:bitmap`,
    gsrlimit: "40",
    prop: "imageinfo",
    iiprop: "url|size|mime|extmetadata",
    iiurlwidth: "1000",
    iiextmetadatafilter: "LicenseShortName|Artist",
    origin: "*",
  });
  const res = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, {
    headers: { "User-Agent": UA },
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) throw new Error(`Commons API ${res.status}`);
  const data = (await res.json()) as { query?: { pages?: Record<string, ApiPage & { index: number }> } };
  return Object.values(data.query?.pages ?? {}).sort((a, b) => a.index - b.index);
}

async function download(url: string, dest: string) {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA }, signal: AbortSignal.timeout(60_000) });
      if (res.status === 429) {
        await new Promise((r) => setTimeout(r, 2000 * attempt));
        continue;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await fs.writeFile(dest, Buffer.from(await res.arrayBuffer()));
      return;
    } catch (err) {
      if (attempt === 3) throw err;
    }
  }
  throw new Error("Download failed after retries");
}

export async function fetchSeedImages(): Promise<SeedManifest> {
  await fs.mkdir(SEED_DIR, { recursive: true });
  const manifest: SeedManifest = {};
  const usedTitles = new Set<string>();

  for (const [group, { queries, count }] of Object.entries(GROUPS)) {
    const picked: SeedImage[] = [];
    for (const q of queries) {
      if (picked.length >= count) break;
      let pages: ApiPage[] = [];
      try {
        pages = await search(q);
      } catch (err) {
        console.warn(`  ! Tìm "${q}" lỗi:`, (err as Error).message);
        continue;
      }
      for (const page of pages) {
        if (picked.length >= count) break;
        const info = page.imageinfo?.[0];
        if (!info?.thumburl || usedTitles.has(page.title) || EXCLUDE.test(page.title)) continue;
        if (info.mime && !/jpe?g|png|webp/.test(info.mime)) continue;
        const ratio = info.width / info.height;
        if (info.width < 700 || info.height < 500 || ratio < 0.65 || ratio > 1.8) continue;

        const ext = /png/.test(info.mime ?? "") ? "png" : "jpg";
        const fileName = `${group}-${picked.length + 1}.${ext}`;
        try {
          await download(info.thumburl, path.join(SEED_DIR, fileName));
        } catch (err) {
          console.warn(`  ! Tải ${page.title} lỗi:`, (err as Error).message);
          continue;
        }
        usedTitles.add(page.title);
        picked.push({
          file: fileName,
          group,
          title: page.title.replace(/^File:/, "").replace(/\.[a-z]+$/i, ""),
          author: stripHtml(info.extmetadata?.Artist?.value ?? "Unknown"),
          license: stripHtml(info.extmetadata?.LicenseShortName?.value ?? ""),
          source: info.descriptionurl,
        });
        await new Promise((r) => setTimeout(r, 150)); // lịch sự với server
      }
    }
    manifest[group] = picked;
    console.log(`  ✓ ${group}: ${picked.length}/${count} ảnh`);
  }

  await fs.writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2), "utf8");
  return manifest;
}

// Chạy trực tiếp: tsx scripts/fetch-seed-images.ts
if (process.argv[1] && /fetch-seed-images/.test(process.argv[1])) {
  console.log("Đang tải ảnh seed từ Wikimedia Commons...");
  fetchSeedImages()
    .then((m) => console.log(`Xong: ${Object.values(m).flat().length} ảnh -> .seed-raw/`))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
