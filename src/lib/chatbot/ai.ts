import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "../prisma";
import { getSettings } from "../settings";
import { effectivePrice, formatVND } from "../format";
import type { BotReply } from "./types";

/**
 * Chế độ AI (tùy chọn): bật bằng CHATBOT_AI="on" trong .env.
 * Thông tin xác thực: ANTHROPIC_API_KEY (hoặc profile `ant auth login`).
 * Engine luật luôn chạy trước để tra dữ liệu thật; Claude chỉ diễn đạt lại câu trả lời
 * dựa trên kiến thức của shop. Lỗi/từ chối -> dùng câu trả lời của engine luật.
 */
export function isAiEnabled(): boolean {
  return process.env.CHATBOT_AI === "on";
}

const MODEL = process.env.CHATBOT_AI_MODEL || "claude-opus-5-5";

let client: Anthropic | null = null;
function getClient() {
  client ??= new Anthropic({ timeout: 25_000, maxRetries: 1 });
  return client;
}

/** System prompt: ổn định giữa các lượt (để prompt caching hoạt động) – không chứa thời gian/dữ liệu riêng của khách */
async function buildSystemPrompt(): Promise<string> {
  const [{ store, shipping, bank, social }, products, categories, faqs] = await Promise.all([
    getSettings(),
    prisma.product.findMany({
      where: { isActive: true, OR: [{ categoryId: null }, { category: { isActive: true } }] },
      orderBy: { id: "asc" },
      select: { name: true, slug: true, price: true, salePrice: true, stock: true, shortDesc: true, category: { select: { name: true } } },
    }),
    prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" }, select: { name: true, slug: true } }),
    prisma.chatFaq.findMany({ where: { isActive: true }, orderBy: { id: "asc" }, select: { question: true, answer: true } }),
  ]);

  const catalog = products
    .map((p) => {
      const stock = p.stock <= 0 ? "hết hàng" : p.stock <= 5 ? `còn ${p.stock}` : "còn hàng";
      return `- ${p.name} | ${formatVND(effectivePrice(p))}${p.salePrice != null ? ` (giá gốc ${formatVND(p.price)})` : ""} | ${stock} | ${p.category?.name ?? ""} | /san-pham/${p.slug} | ${p.shortDesc ?? ""}`;
    })
    .join("\n");

  return `Bạn là "Bé Sen", trợ lý chat của cửa hàng sen đá "${store.name}". Bạn trò chuyện với khách hàng trên website.

Phong cách: tiếng Việt, thân thiện, dễ thương (có thể dùng 1–2 emoji), xưng "mình" hoặc "Bé Sen", gọi khách là "bạn". Trả lời ngắn gọn (tối đa khoảng 120 từ), đi thẳng vào ý chính.

Nguyên tắc:
- Chỉ dùng thông tin trong phần KIẾN THỨC CỬA HÀNG và phần DỮ LIỆU ĐÃ TRA CỨU của từng lượt. Không bịa giá, chính sách, khuyến mãi hay thời gian giao hàng.
- Nếu không có thông tin để trả lời, nói thật là chưa rõ và gợi ý khách liên hệ hotline/Zalo hoặc để lại số điện thoại.
- Thông tin đơn hàng chỉ được nói khi có trong DỮ LIỆU ĐÃ TRA CỨU (đã xác minh bằng mã đơn + số điện thoại). Không bao giờ đoán trạng thái đơn.
- Khi nhắc sản phẩm, dùng liên kết markdown dạng [Tên sản phẩm](/san-pham/slug). Chỉ dùng đường dẫn có trong kiến thức.
- Định dạng được hỗ trợ: **đậm**, [liên kết](/duong-dan), xuống dòng, dòng bắt đầu bằng "- ". Không dùng tiêu đề (#), bảng hay khối code.
- Chủ đề ngoài phạm vi cửa hàng/cây cảnh: lịch sự từ chối ngắn gọn và quay lại hỗ trợ mua sắm.

KIẾN THỨC CỬA HÀNG
Thông tin: địa chỉ ${store.address || "(chưa cập nhật)"}; hotline ${store.phone || "(chưa có)"}; email ${store.email || "(chưa có)"}; giờ làm việc ${store.workingHours || "(chưa cập nhật)"}; Zalo ${social.zalo || "(chưa có)"}; Facebook ${social.facebook || "(chưa có)"}.
Phí ship: ${shipping.fee > 0 ? `${formatVND(shipping.fee)}/đơn` : "miễn phí"}${shipping.freeThreshold > 0 ? `; miễn phí cho đơn từ ${formatVND(shipping.freeThreshold)}` : ""}.
Thanh toán: COD${bank.accountNumber ? `; chuyển khoản ${bank.bankName || bank.bankId} STK ${bank.accountNumber} (${bank.accountName}), có mã QR sau khi đặt` : ""}.
Đặt hàng: không cần tài khoản; thêm vào giỏ -> Thanh toán -> nhập họ tên, SĐT, địa chỉ. Tra cứu đơn tại /tra-cuu-don-hang bằng SĐT + mã đơn (dạng SD261003-7K2F).

Danh mục:
${categories.map((c) => `- ${c.name}: /danh-muc/${c.slug}`).join("\n")}

Sản phẩm (tên | giá bán | tồn kho | danh mục | đường dẫn | mô tả):
${catalog}

Câu hỏi thường gặp:
${faqs.map((f) => `Hỏi: ${f.question}\nĐáp: ${f.answer}`).join("\n\n")}`;
}

/**
 * Viết lại câu trả lời bằng Claude. Trả về null nếu lỗi/từ chối -> dùng câu trả lời của engine luật.
 */
export async function aiRewrite(
  history: { role: "user" | "bot"; content: string }[],
  userMessage: string,
  rule: BotReply,
): Promise<string | null> {
  try {
    const system = await buildSystemPrompt();

    // Lịch sử gần nhất (bắt đầu bằng lượt của khách)
    const recent = history.slice(-10);
    while (recent.length && recent[0].role !== "user") recent.shift();
    const messages: Anthropic.Beta.BetaMessageParam[] = recent.map((m) => ({
      role: m.role === "user" ? "user" : "assistant",
      content: m.content,
    }));

    const looked = [
      `Ý định nhận diện: ${rule.intent}`,
      rule.facts ? `Dữ liệu tra cứu:\n${rule.facts}` : null,
      `Câu trả lời mẫu của hệ thống (đúng dữ liệu, bạn có thể diễn đạt lại tự nhiên hơn):\n${rule.text}`,
      rule.payload.products?.length ? "Lưu ý: giao diện sẽ hiển thị thẻ sản phẩm ngay dưới câu trả lời, không cần liệt kê lại toàn bộ chi tiết." : null,
    ]
      .filter(Boolean)
      .join("\n\n");

    messages.push({
      role: "user",
      content: `${userMessage}\n\n<du_lieu_da_tra_cuu>\n${looked}\n</du_lieu_da_tra_cuu>`,
    });

    const response = await getClient().beta.messages.create({
      model: MODEL,
      max_tokens: 1024, // câu trả lời chat ngắn
      output_config: { effort: "low" },
      system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
      messages,
      // Nếu bị bộ lọc an toàn từ chối, tự chạy lại trên model dự phòng do Anthropic khuyến nghị
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
    });

    if (response.stop_reason === "refusal") return null;
    const text = response.content
      .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();
    return text || null;
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) console.warn("chatbot AI: rate limited");
    else if (err instanceof Anthropic.AuthenticationError) console.warn("chatbot AI: thiếu hoặc sai ANTHROPIC_API_KEY");
    else if (err instanceof Anthropic.APIError) console.warn(`chatbot AI: API error ${err.status}`);
    else console.warn("chatbot AI:", (err as Error).message);
    return null;
  }
}
