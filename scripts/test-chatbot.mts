/**
 * Kiểm thử nhanh chatbot: chạy các câu hỏi mẫu và so với ý định mong đợi.
 * Dùng sau khi thêm/sửa từ khóa (src/lib/chatbot/knowledge.ts) hoặc kiến thức trong admin.
 *
 *   npm run chatbot:test
 *
 * Thêm ca kiểm thử: thêm dòng [câu hỏi, ý định mong đợi, (tùy chọn) chuỗi phải có trong câu trả lời/tên sản phẩm].
 * Ý định: xem IntentId trong src/lib/chatbot/knowledge.ts ("faq" = trả lời từ bộ kiến thức).
 */
import { answerMessage } from "../src/lib/chatbot/engine";
import { prisma } from "../src/lib/prisma";

const CASES: [question: string, intent: string, mustContain?: string][] = [
  // Chào hỏi
  ["xin chào shop", "greeting"],
  ["cảm ơn nhé", "thanks"],
  // Vận chuyển
  ["Phí ship bao nhiêu?", "shipping_fee", "Miễn phí ship"],
  ["phi van chuyen the nao", "shipping_fee"],
  ["bao lâu thì nhận được hàng", "faq", "24 giờ"],
  ["ship ra Hà Nội mất mấy ngày", "faq", "2–4 ngày"],
  ["có giao toàn quốc không", "faq", "toàn quốc"],
  ["có giao hỏa tốc không", "faq", "hỏa tốc"],
  // Cửa hàng / thanh toán / đặt hàng
  ["shop mở cửa mấy giờ", "hours"],
  ["chủ nhật có làm việc không", "hours"],
  ["thanh toán thế nào", "payment", "COD"],
  ["có cod không", "payment"],
  ["cách đặt hàng", "how_to_order"],
  ["shop ở đâu", "address"],
  ["gặp nhân viên", "contact"],
  ["shop bán những gì", "catalog"],
  ["có khuyến mãi gì không", "promotion"],
  // Tư vấn chọn cây
  ["tư vấn giúp mình cây dễ chăm", "recommend"],
  ["cây để bàn làm việc ít nắng", "recommend", "Móng Rồng"],
  ["muốn mua cây treo ban công", "recommend", "Chuỗi Ngọc"],
  ["cây màu đỏ dưới 100k", "recommend"],
  ["Dưới 50k", "recommend"],
  ["duoi 50k", "recommend"],
  ["tu van cay de cham duoi 100k", "recommend"],
  // Quà tặng
  ["mình muốn tặng quà sinh nhật bạn gái", "gift"],
  ["Quà dưới 300k", "gift"],
  ["qua tang khai truong khoang 300k", "gift", "Tiểu Cảnh"],
  ["có gói quà không", "faq", "gói quà"],
  ["mua 50 chậu làm quà cưới", "faq", "số lượng"],
  // Sản phẩm cụ thể
  ["sen đá lola giá bao nhiêu", "product_info", "Lola"],
  ["chuỗi ngọc bi còn hàng không", "product_info", "Chuỗi Ngọc Bi"],
  ["xương rồng bánh sinh nhật bao nhiêu tiền", "product_info", "Bánh Sinh Nhật"],
  // Chăm sóc (FAQ)
  ["Cách chăm sóc sen đá", "faq"],
  ["tưới nước bao lâu 1 lần", "faq", "khô mới tưới"],
  ["sen đá bị úng nước", "faq", "úng"],
  ["cây bị rụng lá", "faq"],
  ["cay bi rung la", "faq"],
  ["làm sao cho sen đá lên màu", "faq"],
  ["đất trồng sen đá", "faq"],
  ["để trong phòng máy lạnh được không", "faq"],
  // Chính sách
  ["bảo hành thế nào", "faq", "7 ngày"],
  ["cây bị dập khi nhận", "faq"],
  ["tôi muốn hủy đơn", "faq"],
  // Đơn hàng
  ["kiểm tra đơn hàng giúp mình", "order_status"],
  ["shop có bán hạt giống không", "faq", "hạt giống"],
  // Câu vô nghĩa -> phải báo chưa hiểu (để admin thấy và bổ sung)
  ["asdkjh qwe", "fallback"],
];

let pass = 0;
for (const [q, expected, must] of CASES) {
  const r = await answerMessage(q, {}, { ip: "test", dryRun: true });
  const haystack = `${r.text} ${r.payload.products?.map((p) => p.name).join(" ") ?? ""}`;
  const ok = r.intent === expected && (!must || haystack.includes(must));
  if (ok) pass++;
  console.log(`${ok ? "✓" : "✗"} [${r.intent}${ok ? "" : ` ≠ ${expected}`}] ${q}${ok ? "" : `\n    → ${r.text.split("\n")[0].slice(0, 100)}`}`);
}
console.log(`\n${pass}/${CASES.length} ca đạt`);
await prisma.$disconnect();
if (pass !== CASES.length) process.exit(1);
