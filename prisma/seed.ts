/**
 * Seed dữ liệu mẫu: danh mục, sản phẩm, bài viết, cài đặt, đơn hàng mẫu, liên hệ mẫu, admin.
 * Chạy lại an toàn: xóa sạch dữ liệu cũ rồi tạo mới.
 *
 *   npm run db:seed
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import fs from "node:fs/promises";
import path from "node:path";
import { slugify } from "../src/lib/slug";
import { productDerivedFields } from "../src/lib/product-utils";
import { CHAT_FAQS } from "./seed-data/chat-faqs";
import { generateDemoOrders } from "./seed-data/demo-orders";
import type { Settings } from "../src/lib/settings-schema";

const prisma = new PrismaClient();

const SEED_SRC = path.join(process.cwd(), "prisma", "seed-images");
const SEED_DEST = path.join(process.cwd(), "public", "uploads", "seed");

type ImageGroup =
  | "echeveria"
  | "graptopetalum"
  | "haworthia"
  | "string"
  | "redEdge"
  | "cactus"
  | "terrarium"
  | "pot"
  | "soil"
  | "banner";

/* ------------------------------------------------------------------ */
/* Ảnh                                                                 */
/* ------------------------------------------------------------------ */

let manifest: Record<string, { file: string }[]> = {};

async function prepareImages() {
  await fs.mkdir(SEED_DEST, { recursive: true });
  manifest = JSON.parse(await fs.readFile(path.join(SEED_SRC, "manifest.json"), "utf8"));
  const files = (await fs.readdir(SEED_SRC)).filter((f) => f.endsWith(".webp"));
  await Promise.all(files.map((f) => fs.copyFile(path.join(SEED_SRC, f), path.join(SEED_DEST, f))));
  console.log(`  ✓ Đã chép ${files.length} ảnh vào public/uploads/seed`);
}

/** Lấy ảnh thứ i (vòng lặp) trong nhóm */
function img(group: ImageGroup, i: number): string {
  const list = manifest[group];
  if (!list?.length) throw new Error(`Thiếu ảnh nhóm ${group}`);
  return `/uploads/seed/${list[((i % list.length) + list.length) % list.length].file}`;
}

/* ------------------------------------------------------------------ */
/* Nội dung mẫu                                                        */
/* ------------------------------------------------------------------ */

const CARE_SUCCULENT = `
<h3>Ánh sáng</h3>
<p>Đặt cây nơi có nắng nhẹ buổi sáng (4–6 giờ/ngày) như bậu cửa sổ, ban công hướng Đông. Tránh nắng gắt buổi trưa mùa hè vì lá dễ bị cháy.</p>
<h3>Tưới nước</h3>
<p>Áp dụng nguyên tắc <strong>"khô mới tưới, tưới thì tưới đẫm"</strong>: 5–7 ngày/lần vào mùa khô, 10–14 ngày/lần vào mùa mưa. Tưới vào gốc, tránh đọng nước ở tâm lá.</p>
<h3>Đất trồng</h3>
<p>Dùng giá thể thoát nước tốt: 40% đất sạch + 30% perlite/đá bọt + 30% xơ dừa hoặc trấu hun.</p>
<h3>Lưu ý</h3>
<ul><li>Cây mới về nên để nơi thoáng mát 2–3 ngày rồi mới cho ra nắng.</li><li>Bón phân tan chậm 1–2 tháng/lần vào mùa sinh trưởng.</li><li>Lá dưới cùng héo khô là hiện tượng tự nhiên, chỉ cần nhặt bỏ.</li></ul>`;

const CARE_CACTUS = `
<h3>Ánh sáng</h3>
<p>Xương rồng ưa nắng, cần tối thiểu 6 giờ nắng/ngày. Thiếu nắng cây sẽ vươn dài, mất dáng và khó ra hoa.</p>
<h3>Tưới nước</h3>
<p>Tưới 7–10 ngày/lần khi đất đã khô hoàn toàn. Mùa mưa và mùa đông giảm hẳn lượng nước.</p>
<h3>Đất trồng</h3>
<p>Giá thể nhiều khoáng: 50% đá perlite/pumice + 30% đất + 20% phân trùn quế.</p>
<h3>Lưu ý</h3>
<ul><li>Dùng kẹp hoặc găng tay khi thay chậu để tránh gai.</li><li>Cây ra hoa tốt hơn khi có chênh lệch nhiệt độ ngày – đêm.</li></ul>`;

const CARE_TERRARIUM = `
<h3>Vị trí đặt</h3>
<p>Để nơi có ánh sáng tán xạ, gần cửa sổ nhưng không chiếu nắng trực tiếp vào bình thủy tinh (dễ làm nóng và hấp hơi).</p>
<h3>Tưới nước</h3>
<p>Dùng bình xịt phun nhẹ quanh gốc 10–14 ngày/lần, mỗi lần 5–10 lần xịt. Terrarium không có lỗ thoát nước nên tuyệt đối không tưới quá tay.</p>
<h3>Vệ sinh</h3>
<p>Lau thành bình bằng khăn mềm khi bị mờ. Nhặt lá khô, tỉa cây mọc quá dài để giữ bố cục.</p>`;

const CARE_ACCESSORY = `
<h3>Hướng dẫn sử dụng</h3>
<p>Phù hợp cho sen đá, xương rồng và các loại cây mọng nước. Bảo quản nơi khô ráo, tránh ánh nắng trực tiếp khi chưa sử dụng.</p>
<p>Liên hệ shop nếu bạn cần tư vấn phối chậu – cây hoặc công thức trộn đất phù hợp.</p>`;

type SeedProduct = {
  name: string;
  cat: string; // slug danh mục
  price: number;
  sale?: number;
  stock: number;
  short: string;
  intro: string;
  images: [ImageGroup, number][];
  flags?: Partial<{ home: boolean; featured: boolean; isNew: boolean; inactive: boolean }>;
};

const CATEGORIES = [
  { name: "Sen đá mini", slug: "sen-da-mini", desc: "Những chậu sen đá nhỏ xinh, dễ chăm, hợp bàn làm việc.", image: ["echeveria", 0] },
  { name: "Sen đá kim cương", slug: "sen-da-kim-cuong", desc: "Haworthia với lá trong suốt lấp lánh như pha lê.", image: ["haworthia", 2] },
  { name: "Sen đá chuỗi ngọc", slug: "sen-da-chuoi-ngoc", desc: "Dáng rủ mềm mại, đẹp khi trồng chậu treo.", image: ["string", 0] },
  { name: "Sen đá viền đỏ", slug: "sen-da-vien-do", desc: "Lá viền đỏ rực khi được nắng, cực kỳ nổi bật.", image: ["redEdge", 1] },
  { name: "Xương rồng", slug: "xuong-rong", desc: "Xương rồng cảnh nhỏ gọn, nhiều loại ra hoa đẹp.", image: ["cactus", 6] },
  { name: "Tiểu cảnh terrarium", slug: "tieu-canh-terrarium", desc: "Hệ sinh thái thu nhỏ trong bình thủy tinh.", image: ["terrarium", 0] },
  { name: "Chậu & phụ kiện", slug: "chau-phu-kien", desc: "Chậu sứ, chậu đất nung và phụ kiện trang trí.", image: ["pot", 1] },
  { name: "Đất & phân bón", slug: "dat-phan-bon", desc: "Giá thể, đá trộn và phân bón chuyên cho cây mọng nước.", image: ["soil", 0] },
] as const;

const PRODUCTS: SeedProduct[] = [
  // Sen đá mini
  { name: "Sen đá Phật Bà", cat: "sen-da-mini", price: 45000, stock: 40, short: "Hoa thị xanh phấn, dáng tròn đều như đóa sen.", intro: "Sen đá Phật Bà (Echeveria elegans) là giống kinh điển với lớp phấn trắng mờ phủ trên lá xanh ngọc, xếp tầng đều đặn như một bông sen nở.", images: [["echeveria", 4], ["echeveria", 5]], flags: { home: true, featured: true } },
  { name: "Sen đá Liên Đài", cat: "sen-da-mini", price: 55000, sale: 45000, stock: 25, short: "Lá xanh mướt xếp tầng, sinh trưởng khỏe.", intro: "Sen đá Liên Đài có lá dày, mọng nước, xếp tầng xoắn ốc rất đều. Cây khỏe, ít sâu bệnh – lựa chọn tuyệt vời cho người mới bắt đầu.", images: [["echeveria", 2], ["echeveria", 3]], flags: { home: true } },
  { name: "Sen đá Lola", cat: "sen-da-mini", price: 65000, stock: 18, short: "Sắc tím hồng pastel dịu dàng.", intro: "Echeveria 'Lola' nổi tiếng với tông màu hồng tím pastel, lá dày ngắn ôm sát tạo dáng bông hồng nhỏ. Khi đủ nắng màu càng lên đẹp.", images: [["echeveria", 10], ["echeveria", 8]], flags: { featured: true, isNew: true } },
  { name: "Sen đá Bắp Cải", cat: "sen-da-mini", price: 50000, stock: 30, short: "Lá tròn to xếp chồng như bắp cải tí hon.", intro: "Sen đá Bắp Cải có lá tròn, mép hơi gợn, xếp chồng khít vào nhau tạo hình bắp cải nhỏ ngộ nghĩnh – món quà dễ thương cho bạn bè.", images: [["echeveria", 11], ["echeveria", 0]] },
  { name: "Sen đá Nâu", cat: "sen-da-mini", price: 35000, stock: 50, short: "Tông nâu đồng ấm áp, cực dễ chăm.", intro: "Sen đá Nâu (Graptopetalum 'Bronze') có màu nâu đồng óng ánh, càng phơi nắng càng đậm màu. Đây là một trong những giống dễ sống nhất.", images: [["graptopetalum", 3], ["graptopetalum", 1]], flags: { isNew: true } },
  { name: "Sen đá Ngọc Bích", cat: "sen-da-mini", price: 35000, stock: 45, short: "Lá xám xanh phủ phấn, nhân giống dễ.", intro: "Graptopetalum paraguayense – còn gọi là sen đá Ngọc Bích hay Bóng Ma – có lá xám xanh phủ phấn, dáng thả nhẹ, chỉ cần một chiếc lá là nhân giống được cây mới.", images: [["graptopetalum", 0], ["graptopetalum", 4]] },
  { name: "Sen đá Hồng Phấn", cat: "sen-da-mini", price: 60000, sale: 52000, stock: 4, short: "Lá hồng phấn mập mạp, rất ăn ảnh.", intro: "Sen đá Hồng Phấn (Graptoveria) là giống lai với lá mập, phủ phấn hồng nhạt. Cây lên màu đẹp nhất vào mùa khô khi có chênh lệch nhiệt độ.", images: [["echeveria", 9], ["graptopetalum", 2]], flags: { home: true, isNew: true } },

  // Sen đá kim cương
  { name: "Sen đá Kim Cương", cat: "sen-da-kim-cuong", price: 85000, stock: 20, short: "Đầu lá trong suốt lấp lánh như pha lê.", intro: "Haworthia cooperi – sen đá Kim Cương – sở hữu những chiếc lá mọng với 'cửa sổ' trong suốt ở đầu lá, khi có nắng xuyên qua sẽ lấp lánh như viên kim cương.", images: [["haworthia", 2], ["haworthia", 4]], flags: { home: true, featured: true } },
  { name: "Sen đá Móng Rồng", cat: "sen-da-kim-cuong", price: 45000, stock: 35, short: "Lá nhọn sọc trắng mạnh mẽ, chịu bóng tốt.", intro: "Sen đá Móng Rồng (Haworthia attenuata) có lá nhọn, mặt dưới điểm những sọc chấm trắng nổi. Cây chịu bóng tốt, rất hợp để trong văn phòng.", images: [["pot", 4], ["haworthia", 1]], flags: { featured: true } },
  { name: "Sen đá Kim Cương Truncata", cat: "sen-da-kim-cuong", price: 150000, stock: 6, short: "Lá cắt ngang độc đáo, hàng sưu tầm.", intro: "Haworthia truncata có những chiếc lá như bị cắt ngang, xếp thành hai hàng đối xứng. Đây là giống sinh trưởng chậm, được dân chơi sưu tầm rất ưa chuộng.", images: [["haworthia", 3], ["haworthia", 0]], flags: { isNew: true } },
  { name: "Sen đá Kim Cương Xanh Mini", cat: "sen-da-kim-cuong", price: 55000, stock: 0, short: "Bụi kim cương xanh mọc cụm dày.", intro: "Phiên bản mọc cụm của dòng Haworthia, các đầu lá trong suốt chen chúc tạo thành một khối tròn xanh mướt rất bắt mắt.", images: [["haworthia", 0], ["haworthia", 4]] },

  // Chuỗi ngọc
  { name: "Chuỗi Ngọc Bi", cat: "sen-da-chuoi-ngoc", price: 120000, sale: 99000, stock: 15, short: "Những hạt ngọc tròn xanh rủ dài mềm mại.", intro: "Chuỗi Ngọc Bi (Senecio rowleyanus) với những chiếc lá tròn như hạt đậu xanh nối thành chuỗi dài, cực đẹp khi trồng chậu treo ban công.", images: [["string", 2], ["string", 0]], flags: { home: true, featured: true } },
  { name: "Sen đá Đuôi Lừa", cat: "sen-da-chuoi-ngoc", price: 95000, stock: 12, short: "Lá mập xếp kín thành chuỗi như đuôi lừa.", intro: "Sedum morganianum – Đuôi Lừa – có lá xanh phấn mập mạp xếp sát nhau trên cành dài, tạo thành những 'cái đuôi' rủ xuống rất ngộ nghĩnh.", images: [["string", 3], ["string", 1]] },
  { name: "Chuỗi Ngọc Dây Dài 40cm", cat: "sen-da-chuoi-ngoc", price: 180000, stock: 5, short: "Chậu treo dây dài sẵn 40cm, lên dáng ngay.", intro: "Chậu Chuỗi Ngọc đã được chăm 8 tháng với dây dài khoảng 40cm, treo lên là có ngay một góc xanh rủ mềm mại cho ban công.", images: [["string", 1], ["string", 0]], flags: { isNew: true } },

  // Viền đỏ
  { name: "Sen đá Viền Đỏ Agavoides", cat: "sen-da-vien-do", price: 75000, stock: 22, short: "Lá nhọn xanh, viền đỏ rực khi đủ nắng.", intro: "Echeveria agavoides có lá dày nhọn như lá thùa, mép lá chuyển đỏ rực khi được phơi nắng – điểm nhấn cực kỳ nổi bật cho bộ sưu tập.", images: [["redEdge", 2], ["redEdge", 0]], flags: { home: true, featured: true } },
  { name: "Sen đá Ruby", cat: "sen-da-vien-do", price: 65000, sale: 55000, stock: 3, short: "Đầu lá đỏ như hồng ngọc.", intro: "Sen đá Ruby có lá xanh ngọc với chóp lá đỏ đậm như viên hồng ngọc. Cây nhỏ gọn, rất hợp làm quà tặng.", images: [["echeveria", 1], ["redEdge", 6]], flags: { isNew: true } },
  { name: "Sen đá Thạch Bích Đỏ", cat: "sen-da-vien-do", price: 55000, stock: 28, short: "Lá tam giác xếp tháp, đỏ đậm mùa nắng.", intro: "Crassula capitella 'Campfire' – Thạch Bích Đỏ – có lá hình tam giác xếp chồng như ngọn tháp, chuyển đỏ cam rực rỡ khi trời nắng.", images: [["redEdge", 5], ["redEdge", 4]] },
  { name: "Sen đá Sedum Vàng Cam", cat: "sen-da-vien-do", price: 40000, stock: 38, short: "Lá vàng chanh viền cam tươi tắn.", intro: "Sedum adolphi có lá vàng chanh, mép chuyển cam khi đủ nắng, mọc thành bụi nhỏ tươi tắn. Rất dễ nhân giống bằng cành.", images: [["redEdge", 1], ["redEdge", 3]] },
  { name: "Sen đá Romeo Lửa Đỏ", cat: "sen-da-vien-do", price: 180000, stock: 8, short: "Toàn thân đỏ rượu vang, hàng hiếm.", intro: "Echeveria 'Romeo' có toàn bộ lá màu đỏ rượu vang khi trưởng thành – một trong những giống sen đá đỏ đẹp nhất. Số lượng có hạn.", images: [["redEdge", 0], ["redEdge", 2]], flags: { inactive: true } },

  // Xương rồng
  { name: "Xương Rồng Mammillaria Hoa Hồng", cat: "xuong-rong", price: 55000, stock: 26, short: "Ra vòng hoa hồng quanh đỉnh rất đẹp.", intro: "Mammillaria là chi xương rồng nổi tiếng ra hoa thành vòng tròn quanh đỉnh. Cây nhỏ gọn, gai mềm, ra hoa quanh năm khi đủ nắng.", images: [["cactus", 6], ["cactus", 7]], flags: { home: true, featured: true } },
  { name: "Xương Rồng Bánh Sinh Nhật", cat: "xuong-rong", price: 65000, stock: 14, short: "Gai trắng tuyết, hoa đỏ như nến bánh kem.", intro: "Mammillaria với lớp gai trắng mịn bao phủ, mùa hoa xuất hiện những bông đỏ nhỏ xếp vòng như nến trên chiếc bánh sinh nhật.", images: [["cactus", 3], ["cactus", 2]], flags: { isNew: true } },
  { name: "Xương Rồng Trứng Chim", cat: "xuong-rong", price: 45000, sale: 39000, stock: 33, short: "Thân tròn gai vàng, hoa vàng kem.", intro: "Xương Rồng Trứng Chim có thân tròn nhỏ phủ gai vàng nhạt, nở hoa vàng kem xinh xắn. Gần như không cần chăm sóc.", images: [["cactus", 1], ["cactus", 0]] },
  { name: "Xương Rồng Tuyết Hoa Trắng", cat: "xuong-rong", price: 50000, stock: 2, short: "Hoa trắng muốt nổi bật giữa gai.", intro: "Giống xương rồng gai mảnh, nở những bông hoa trắng muốt cánh dài thanh thoát, đẹp nhất khi nở rộ vào sáng sớm.", images: [["cactus", 4], ["cactus", 5]] },

  // Terrarium
  { name: "Tiểu Cảnh Terrarium Bình Cầu", cat: "tieu-canh-terrarium", price: 350000, sale: 299000, stock: 7, short: "Bình cầu thủy tinh 15cm, phối 4–5 loại cây.", intro: "Tiểu cảnh trong bình cầu thủy tinh đường kính 15cm, phối 4–5 loại sen đá cùng sỏi màu, rêu khô và tượng trang trí. Món quà tinh tế cho dịp đặc biệt.", images: [["terrarium", 0], ["terrarium", 2]], flags: { home: true, featured: true, isNew: true } },
  { name: "Tiểu Cảnh Chuông Thủy Tinh", cat: "tieu-canh-terrarium", price: 280000, stock: 9, short: "Chuông thủy tinh đế gỗ sang trọng.", intro: "Một cây sen đá nhỏ đặt trang trọng dưới chuông thủy tinh với đế gỗ tự nhiên – phong cách tối giản, rất hợp bàn làm việc.", images: [["terrarium", 1]] },
  { name: "Tiểu Cảnh Sa Mạc Mini", cat: "tieu-canh-terrarium", price: 250000, stock: 10, short: "Xương rồng & sen đá trên nền cát sa mạc.", intro: "Tiểu cảnh lấy cảm hứng sa mạc với xương rồng, sen đá và lớp cát vàng – mang thiên nhiên hoang dã vào góc nhỏ của bạn.", images: [["terrarium", 2], ["terrarium", 3]] },

  // Chậu & phụ kiện
  { name: "Chậu Sứ Trắng Tròn 10cm", cat: "chau-phu-kien", price: 45000, stock: 60, short: "Chậu sứ men trắng, có lỗ thoát nước.", intro: "Chậu sứ men trắng bóng, đường kính 10cm, có lỗ thoát nước và đĩa lót. Kiểu dáng tối giản, hợp với mọi loại sen đá.", images: [["pot", 1]], flags: { featured: true } },
  { name: "Chậu Tượng Em Bé Gỗ", cat: "chau-phu-kien", price: 85000, stock: 15, short: "Chậu hình tượng ngộ nghĩnh, cây làm 'tóc'.", intro: "Chậu hình tượng em bé màu gỗ, khi trồng sen đá lên trên trông như mái tóc xanh ngộ nghĩnh. Quà tặng siêu dễ thương.", images: [["pot", 2]], flags: { isNew: true } },
  { name: "Kệ Gỗ Trưng Bày 3 Tầng", cat: "chau-phu-kien", price: 320000, stock: 4, short: "Kệ gỗ thông, trưng được 12–15 chậu nhỏ.", intro: "Kệ gỗ thông tự nhiên 3 tầng, trưng bày được 12–15 chậu sen đá nhỏ, phù hợp ban công hoặc bậu cửa sổ.", images: [["pot", 3], ["pot", 0]] },

  // Đất & phân bón
  { name: "Đá Perlite Trộn Đất 1 Lít", cat: "dat-phan-bon", price: 25000, stock: 80, short: "Tăng độ thoáng, chống úng rễ.", intro: "Đá perlite trắng giúp giá thể tơi xốp, thoát nước nhanh – thành phần không thể thiếu khi trồng sen đá và xương rồng.", images: [["soil", 0]] },
  { name: "Đất Trồng Sen Đá Chuyên Dụng 2kg", cat: "dat-phan-bon", price: 45000, sale: 39000, stock: 55, short: "Phối trộn sẵn, dùng ngay không cần trộn.", intro: "Giá thể phối trộn sẵn từ đất sạch, perlite, đá bọt và phân trùn quế theo tỉ lệ chuẩn cho cây mọng nước. Mở bao là trồng được ngay.", images: [["soil", 1]], flags: { home: true } },
  { name: "Đá Bọt Pumice 1kg", cat: "dat-phan-bon", price: 35000, stock: 3, short: "Đá núi lửa giữ ẩm nhẹ, thoáng rễ.", intro: "Đá bọt pumice có cấu trúc rỗ giúp giữ một chút ẩm mà vẫn thoáng khí cho rễ, dùng trộn đất hoặc rải mặt chậu.", images: [["soil", 2]] },
];

const POSTS = [
  {
    title: "Hướng dẫn chăm sóc sen đá cho người mới bắt đầu",
    excerpt: "5 nguyên tắc vàng giúp sen đá của bạn luôn căng mọng, lên màu đẹp mà không tốn nhiều công sức.",
    cover: ["echeveria", 5] as [ImageGroup, number],
    days: 2,
    content: `<p>Sen đá nổi tiếng là loại cây "dễ sống", nhưng không ít bạn vẫn gặp cảnh cây bị úng, vươn dài hoặc rụng lá. Dưới đây là 5 nguyên tắc cơ bản giúp bạn chăm sen đá thành công ngay từ chậu đầu tiên.</p>
<h2>1. Ánh sáng là quan trọng nhất</h2>
<p>Sen đá cần ít nhất 4 giờ nắng mỗi ngày. Nắng sáng là lý tưởng nhất. Nếu cây bị <strong>vươn dài, lá thưa, màu nhạt</strong> thì đó là dấu hiệu thiếu sáng.</p>
<h2>2. Tưới ít mà đẫm</h2>
<p>Chỉ tưới khi đất đã khô hoàn toàn. Khi tưới thì tưới đẫm đến khi nước chảy ra lỗ thoát nước. Tránh tưới lắt nhắt mỗi ngày.</p>
<h2>3. Đất phải thoát nước tốt</h2>
<p>Không dùng đất thịt nguyên chất. Hãy trộn thêm perlite, đá bọt hoặc trấu hun để đất tơi xốp.</p>
<h2>4. Chậu có lỗ thoát nước</h2>
<p>Đây là điều bắt buộc. Chậu không có lỗ sẽ đọng nước dưới đáy và gây thối rễ.</p>
<h2>5. Thông gió</h2>
<p>Đặt cây nơi thoáng gió, đặc biệt vào mùa mưa, để hạn chế nấm bệnh.</p>
<blockquote><p>Mẹo nhỏ: Hãy "bỏ quên" sen đá một chút – chăm quá kỹ mới là nguyên nhân hàng đầu khiến cây chết!</p></blockquote>`,
  },
  {
    title: "Vì sao sen đá bị úng nước và cách cứu cây",
    excerpt: "Nhận biết sớm dấu hiệu úng rễ và các bước xử lý để cứu chậu sen đá yêu quý.",
    cover: ["echeveria", 10] as [ImageGroup, number],
    days: 6,
    content: `<p>Úng nước là "sát thủ" số một của sen đá, đặc biệt vào mùa mưa. Tin vui là nếu phát hiện sớm, bạn hoàn toàn có thể cứu cây.</p>
<h2>Dấu hiệu nhận biết</h2>
<ul><li>Lá dưới chuyển vàng trong, mềm nhũn.</li><li>Thân gần gốc chuyển nâu đen.</li><li>Lá rụng hàng loạt khi chạm nhẹ.</li></ul>
<h2>Các bước cứu cây</h2>
<ol><li>Nhấc cây khỏi chậu, rũ sạch đất cũ.</li><li>Cắt bỏ toàn bộ rễ và phần thân bị thối đến khi thấy mô xanh khỏe.</li><li>Để vết cắt khô 3–5 ngày ở nơi thoáng mát.</li><li>Trồng lại vào đất khô, thoát nước tốt. Chờ 5–7 ngày mới tưới lần đầu.</li></ol>
<p>Nếu thân đã thối quá nhiều, hãy tận dụng những chiếc lá còn khỏe để nhân giống cây mới.</p>`,
  },
  {
    title: "Bí quyết giúp sen đá lên màu rực rỡ",
    excerpt: "Tại sao sen đá ở vườn lại đỏ rực còn mang về nhà lại xanh lè? Đây là câu trả lời.",
    cover: ["redEdge", 1] as [ImageGroup, number],
    days: 11,
    content: `<p>Nhiều bạn thắc mắc vì sao chậu sen đá viền đỏ mua về sau vài tuần lại chuyển xanh. Màu sắc của sen đá thực chất là phản ứng của cây với <strong>môi trường "căng thẳng nhẹ"</strong>.</p>
<h2>3 yếu tố giúp cây lên màu</h2>
<h3>Nắng nhiều</h3>
<p>Ánh nắng mạnh kích thích cây sản sinh sắc tố anthocyanin (đỏ, tím) để tự bảo vệ.</p>
<h3>Chênh lệch nhiệt độ ngày – đêm</h3>
<p>Đây là lý do sen đá ở Đà Lạt luôn đẹp hơn. Ở thành phố nóng, bạn có thể tận dụng mùa khô.</p>
<h3>Hạn chế nước và phân đạm</h3>
<p>Tưới ít đi một chút và không bón phân đạm nhiều sẽ giúp cây giữ màu tốt hơn.</p>
<p>Lưu ý: tăng nắng từ từ để tránh cháy lá.</p>`,
  },
  {
    title: "Cách nhân giống sen đá bằng lá cực đơn giản",
    excerpt: "Từ một chiếc lá nhỏ, bạn có thể có cả chậu sen đá mới chỉ sau vài tháng.",
    cover: ["graptopetalum", 4] as [ImageGroup, number],
    days: 17,
    content: `<p>Nhân giống bằng lá là cách thú vị và tiết kiệm nhất để mở rộng bộ sưu tập sen đá.</p>
<h2>Chuẩn bị</h2>
<ul><li>Lá sen đá khỏe, còn nguyên phần cuống.</li><li>Khay đất khô, thoát nước tốt.</li></ul>
<h2>Các bước thực hiện</h2>
<ol><li>Nhẹ nhàng vặn lá khỏi thân, đảm bảo lấy trọn phần cuống.</li><li>Để lá ở nơi thoáng mát 2–3 ngày cho vết cắt khô.</li><li>Đặt lá nằm trên mặt đất, không cần vùi.</li><li>Phun sương nhẹ khi thấy rễ nhỏ xuất hiện (sau 2–3 tuần).</li></ol>
<p>Sau khoảng 1–2 tháng, cây con sẽ mọc ra từ cuống lá. Khi lá mẹ héo hẳn là lúc cây con đã tự lập.</p>`,
  },
  {
    title: "Gợi ý bày trí sen đá cho bàn làm việc",
    excerpt: "Biến góc làm việc thành khu vườn mini xanh mát với vài chậu sen đá nhỏ.",
    cover: ["pot", 1] as [ImageGroup, number],
    days: 23,
    content: `<p>Một vài chậu cây xanh trên bàn làm việc giúp giảm căng thẳng và tăng sự tập trung. Sen đá là lựa chọn lý tưởng vì nhỏ gọn và ít cần chăm sóc.</p>
<h2>Chọn cây phù hợp</h2>
<p>Văn phòng thường thiếu nắng, hãy ưu tiên các giống chịu bóng như <strong>sen đá Móng Rồng, Kim Cương</strong>.</p>
<h2>Phối chậu đồng bộ</h2>
<p>Chọn chậu cùng chất liệu (sứ trắng, đất nung) với kích thước khác nhau để tạo nhịp điệu.</p>
<h2>Đừng quên "tắm nắng"</h2>
<p>Mỗi tuần mang cây ra cửa sổ phơi nắng 1–2 ngày để cây giữ dáng đẹp.</p>`,
  },
  {
    title: "Terrarium – khu rừng nhỏ trong bình thủy tinh",
    excerpt: "Tìm hiểu về terrarium và cách giữ cho tiểu cảnh luôn tươi đẹp.",
    cover: ["terrarium", 2] as [ImageGroup, number],
    days: 30,
    content: `<p>Terrarium là hệ sinh thái thu nhỏ được tạo trong bình thủy tinh, vừa là cây cảnh vừa là món đồ trang trí độc đáo.</p>
<h2>Terrarium mở và kín</h2>
<p>Với sen đá và xương rồng, hãy dùng <strong>terrarium mở</strong> (miệng bình rộng) để không khí lưu thông, tránh đọng ẩm.</p>
<h2>Cấu tạo các lớp</h2>
<ol><li>Lớp sỏi thoát nước dưới đáy.</li><li>Lớp than hoạt tính chống mùi, nấm.</li><li>Lớp đất trồng.</li><li>Lớp trang trí: cát màu, sỏi, rêu, tiểu cảnh.</li></ol>
<p>Chăm sóc terrarium rất đơn giản: phun sương nhẹ 10–14 ngày/lần và để nơi có ánh sáng tán xạ.</p>`,
  },
];

/* ------------------------------------------------------------------ */
/* Main                                                                */
/* ------------------------------------------------------------------ */

async function main() {
  console.log("🌱 Bắt đầu seed...");
  await prepareImages();

  // Xóa dữ liệu cũ (theo thứ tự phụ thuộc)
  await prisma.chatMessage.deleteMany();
  await prisma.chatConversation.deleteMany();
  await prisma.chatFaq.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.post.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.adminUser.deleteMany();

  // Admin
  const email = process.env.ADMIN_EMAIL || "25210281@ms.uit.edu.vn";
  const password = process.env.ADMIN_PASSWORD || "25210281";
  await prisma.adminUser.create({
    data: { email, name: process.env.ADMIN_NAME || "Trần Thị Thanh Hương", passwordHash: await bcrypt.hash(password, 10) },
  });
  console.log(`  ✓ Admin: ${email} / ${password}`);

  // Cài đặt
  const settings: Settings = {
    store: {
      name: "Sen Đá Xinh",
      slogan: "Mang thiên nhiên xanh mát vào từng góc nhỏ",
      logo: "",
      phone: "0901 234 567",
      email: "25210281@ms.uit.edu.vn",
      address: "Trường Đại học Công nghệ Thông tin (UIT) – ĐHQG TP. Hồ Chí Minh",
      workingHours: "8:00 – 21:00, Thứ 2 – Chủ nhật",
      mapEmbedUrl:
        "https://www.google.com/maps?q=Tr%C6%B0%E1%BB%9Dng+%C4%90%E1%BA%A1i+h%E1%BB%8Dc+C%C3%B4ng+ngh%E1%BB%87+Th%C3%B4ng+tin+%C4%90HQG+TP.HCM&output=embed",
    },
    social: {
      facebook: "https://facebook.com/",
      instagram: "https://instagram.com/",
      tiktok: "https://tiktok.com/",
      youtube: "",
      zalo: "https://zalo.me/0901234567",
    },
    bank: {
      bankId: "VCB",
      bankName: "Vietcombank – CN TP. Hồ Chí Minh",
      accountNumber: "0123456789",
      accountName: "NGUYEN VAN A",
    },
    shipping: { fee: 30000, freeThreshold: 500000 },
    home: {
      banners: [
        {
          image: img("echeveria", 4),
          title: "Sen đá xinh cho góc nhỏ thêm xanh",
          subtitle: "Hơn 30 giống sen đá & xương rồng khỏe đẹp, đóng gói cẩn thận, giao tận nơi.",
          ctaText: "Mua ngay",
          ctaLink: "/san-pham",
        },
        {
          image: img("terrarium", 0),
          title: "Tiểu cảnh terrarium – quà tặng tinh tế",
          subtitle: "Thiết kế thủ công, phối cây theo yêu cầu. Giảm đến 15% trong tháng này.",
          ctaText: "Xem tiểu cảnh",
          ctaLink: "/danh-muc/tieu-canh-terrarium",
        },
        {
          image: img("banner", 0),
          title: "Miễn phí giao hàng từ 500.000đ",
          subtitle: "Cây được tuyển chọn kỹ, bảo hành 7 ngày nếu cây gặp vấn đề khi nhận.",
          ctaText: "Khám phá",
          ctaLink: "/san-pham?sap-xep=moi-nhat",
        },
      ],
    },
  };
  for (const [key, value] of Object.entries(settings)) {
    await prisma.setting.create({ data: { key, value: JSON.stringify(value) } });
  }
  console.log("  ✓ Cài đặt cửa hàng");

  // Danh mục
  const catIds = new Map<string, number>();
  for (const [i, c] of CATEGORIES.entries()) {
    const cat = await prisma.category.create({
      data: {
        name: c.name,
        slug: c.slug,
        description: c.desc,
        image: img(c.image[0] as ImageGroup, c.image[1]),
        sortOrder: i,
      },
    });
    catIds.set(c.slug, cat.id);
  }
  console.log(`  ✓ ${CATEGORIES.length} danh mục`);

  // Sản phẩm – createdAt lùi dần để "mới nhất" có ý nghĩa
  const now = Date.now();
  const created: { id: number; name: string; price: number; salePrice: number | null; image: string }[] = [];
  for (const [i, p] of PRODUCTS.entries()) {
    const isCactus = p.cat === "xuong-rong";
    const isTerrarium = p.cat === "tieu-canh-terrarium";
    const isAccessory = p.cat === "chau-phu-kien" || p.cat === "dat-phan-bon";
    const careGuide = isAccessory ? CARE_ACCESSORY : isTerrarium ? CARE_TERRARIUM : isCactus ? CARE_CACTUS : CARE_SUCCULENT;
    const description = `<p>${p.intro}</p>
<h3>Thông tin sản phẩm</h3>
<ul>${
      isAccessory
        ? "<li>Hàng có sẵn, đóng gói cẩn thận.</li><li>Hình ảnh mang tính minh họa, màu sắc có thể chênh lệch nhẹ.</li>"
        : "<li>Kích thước cây: 5–8cm (tùy giống).</li><li>Giao kèm chậu nhựa ươm, có thể chọn thêm chậu sứ.</li><li>Cây được thuần khí hậu, khỏe mạnh trước khi giao.</li>"
    }</ul>
<p>Màu sắc cây có thể thay đổi theo mùa và điều kiện ánh sáng – đó chính là nét thú vị của sen đá!</p>`;

    const product = await prisma.product.create({
      data: {
        name: p.name,
        slug: slugify(p.name),
        sku: `SD${String(i + 1).padStart(3, "0")}`,
        price: p.price,
        salePrice: p.sale ?? null,
        ...productDerivedFields({ name: p.name, sku: `SD${String(i + 1).padStart(3, "0")}`, price: p.price, salePrice: p.sale ?? null }),
        stock: p.stock,
        shortDesc: p.short,
        description,
        careGuide,
        categoryId: catIds.get(p.cat)!,
        isActive: !p.flags?.inactive,
        showOnHome: !!p.flags?.home,
        isFeatured: !!p.flags?.featured,
        isNew: !!p.flags?.isNew,
        sortOrder: i,
        createdAt: new Date(now - (PRODUCTS.length - i) * 36 * 60 * 60 * 1000 * (p.flags?.isNew ? 0.1 : 1)),
        images: {
          create: p.images.map(([g, n], idx) => ({ url: img(g, n), alt: p.name, sortOrder: idx })),
        },
      },
    });
    created.push({
      id: product.id,
      name: product.name,
      price: product.price,
      salePrice: product.salePrice,
      image: img(p.images[0][0], p.images[0][1]),
    });
  }
  console.log(`  ✓ ${PRODUCTS.length} sản phẩm`);

  // Bài viết
  for (const post of POSTS) {
    const publishedAt = new Date(now - post.days * 24 * 60 * 60 * 1000);
    await prisma.post.create({
      data: {
        title: post.title,
        slug: slugify(post.title),
        excerpt: post.excerpt,
        content: post.content,
        coverImage: img(post.cover[0], post.cover[1]),
        status: "PUBLISHED",
        publishedAt,
        createdAt: publishedAt,
      },
    });
  }
  // 1 bài nháp để thử tính năng
  await prisma.post.create({
    data: {
      title: "Top 10 giống sen đá dễ trồng nhất (bản nháp)",
      slug: "top-10-giong-sen-da-de-trong-nhat",
      excerpt: "Bài viết đang soạn.",
      content: "<p>Nội dung đang được cập nhật...</p>",
      status: "DRAFT",
    },
  });
  console.log(`  ✓ ${POSTS.length} bài viết + 1 bản nháp`);

  // Đơn hàng mẫu (90 ngày) cho dashboard, báo cáo và video demo – xem prisma/seed-data/demo-orders.ts
  const demo = await generateDemoOrders(prisma, { shippingFee: settings.shipping.fee, freeThreshold: settings.shipping.freeThreshold });
  console.log(`  ✓ ${demo.orders} đơn hàng mẫu từ ${demo.customers} khách (${demo.repeatCustomers} khách mua lại)`);

  // Liên hệ mẫu
  await prisma.contact.createMany({
    data: [
      { name: "Hoàng Yến", contact: "0909111222", message: "Shop ơi cho mình hỏi có nhận làm tiểu cảnh theo yêu cầu cho sự kiện công ty không ạ? Khoảng 50 phần.", createdAt: new Date(now - 3 * 3600_000) },
      { name: "Minh Tuấn", contact: "tuan.nguyen@example.com", message: "Sen đá của mình bị rụng lá nhiều sau khi mua về 1 tuần, shop tư vấn giúp mình với.", createdAt: new Date(now - 26 * 3600_000) },
      { name: "Thanh Trúc", contact: "0938777666", message: "Mình muốn đặt 20 chậu sen đá mini làm quà cưới, shop báo giá sỉ giúp mình.", isHandled: true, createdAt: new Date(now - 4 * 86400_000) },
    ],
  });
  console.log("  ✓ 3 liên hệ mẫu");

  // Chatbot: kiến thức hỏi – đáp
  await prisma.chatFaq.createMany({
    data: CHAT_FAQS.map((f, i) => ({ ...f, keywords: f.keywords.join(", "), sortOrder: i })),
  });
  console.log(`  ✓ ${CHAT_FAQS.length} câu hỏi – đáp cho chatbot`);

  // Chatbot: vài hội thoại mẫu để xem thử trong admin
  const sampleChats: { minutesAgo: number; reviewed: boolean; msgs: [string, string, string?, boolean?][] }[] = [
    {
      minutesAgo: 35,
      reviewed: true,
      msgs: [
        ["user", "phí ship bao nhiêu vậy shop"],
        ["bot", "Phí giao hàng đồng giá **30.000đ**/đơn.\n🎉 **Miễn phí ship** cho đơn từ **500.000đ**.", "shipping_fee"],
        ["user", "bao lâu thì nhận được hàng"],
        ["bot", CHAT_FAQS[0].answer, "faq"],
      ],
    },
    {
      minutesAgo: 120,
      reviewed: true,
      msgs: [
        ["user", "tư vấn cây dễ chăm để bàn làm việc dưới 100k"],
        ["bot", "Với tiêu chí **dễ chăm, hợp người mới, chịu bóng, để trong nhà / văn phòng, dưới 100.000đ**, Bé Sen gợi ý:", "recommend"],
      ],
    },
    {
      minutesAgo: 300,
      reviewed: false,
      msgs: [
        ["user", "shop có bán hạt giống sen đá không"],
        ["bot", "Xin lỗi, Bé Sen chưa hiểu ý bạn lắm 🥺 Bạn có thể hỏi về **phí ship, thời gian giao hàng, tư vấn chọn cây, quà tặng, tình trạng đơn hàng**... hoặc chọn nhanh bên dưới nhé!", "fallback", false],
      ],
    },
  ];
  for (const chat of sampleChats) {
    const at = new Date(now - chat.minutesAgo * 60_000);
    await prisma.chatConversation.create({
      data: {
        sessionId: crypto.randomUUID(),
        messageCount: chat.msgs.length,
        unansweredCount: chat.msgs.filter((m) => m[3] === false).length,
        isReviewed: chat.reviewed,
        pagePath: "/",
        createdAt: at,
        lastMessageAt: at,
        messages: {
          create: chat.msgs.map(([role, content, intent, answered], i) => ({
            role,
            content,
            intent: role === "bot" ? (intent ?? null) : null,
            source: role === "bot" ? (intent === "faq" ? "faq" : "rule") : null,
            answered: answered ?? true,
            createdAt: new Date(at.getTime() + i * 20_000),
          })),
        },
      },
    });
  }
  console.log(`  ✓ ${sampleChats.length} hội thoại chatbot mẫu`);

  console.log("✅ Seed hoàn tất!");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
