import "server-only";
import { prisma } from "../prisma";
import { getSettings, type Settings } from "../settings";
import { formatVND, effectivePrice } from "../format";
import { getOrderForCustomer } from "../orders";
import { checkRateLimit } from "../rate-limit";
import { ORDER_STATUS_LABEL, PAYMENT_METHOD_LABEL, type OrderStatus, type PaymentMethod } from "../constants";
import { GENERIC_PRODUCT_WORDS, INTENT_PHRASES, QUICK_REPLIES, TRAITS, type IntentId, type Trait } from "./knowledge";
import { extractBudget, extractOrderCode, extractPhone, hasPhrase, normalize, phraseScore, textForms, type Budget, type TextForms } from "./text";
import type { BotReply, ChatContext, ChatProductCard } from "./types";

/* ------------------------------------------------------------------ */
/* Dữ liệu dùng chung                                                  */
/* ------------------------------------------------------------------ */

const visibleProduct = { isActive: true, OR: [{ categoryId: null }, { category: { isActive: true } }] };

const productSelect = {
  id: true,
  slug: true,
  name: true,
  price: true,
  salePrice: true,
  stock: true,
  searchText: true,
  shortDesc: true,
  isFeatured: true,
  category: { select: { slug: true, name: true } },
  images: { select: { url: true }, orderBy: { sortOrder: "asc" as const }, take: 1 },
};

type ProductRow = Awaited<ReturnType<typeof loadProducts>>[number];

async function loadProducts() {
  return prisma.product.findMany({ where: visibleProduct, select: productSelect, orderBy: [{ isFeatured: "desc" }, { sortOrder: "asc" }] });
}

function toCard(p: ProductRow): ChatProductCard {
  return { id: p.id, slug: p.slug, name: p.name, price: p.price, salePrice: p.salePrice, stock: p.stock, image: p.images[0]?.url ?? null };
}

const reply = (r: Omit<BotReply, "context"> & { context?: ChatContext }, ctx: ChatContext): BotReply => ({
  ...r,
  context: { ...ctx, ...r.context, lastIntent: r.intent },
});

/* ------------------------------------------------------------------ */
/* Nhận diện ý định                                                    */
/* ------------------------------------------------------------------ */

type Candidate = { intent: IntentId; score: number; faqId?: number };

function scoreIntents(t: TextForms): Candidate[] {
  const out: Candidate[] = [];
  for (const [intent, def] of Object.entries(INTENT_PHRASES)) {
    const score = phraseScore(t, def!.phrases, def!.weight ?? 1);
    if (score > 0) out.push({ intent: intent as IntentId, score });
  }
  return out;
}

async function scoreFaqs(t: TextForms) {
  const faqs = await prisma.chatFaq.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } });
  return faqs
    .map((f) => {
      const keywords = f.keywords.split(",").map((k) => k.trim()).filter(Boolean);
      // FAQ cụ thể hơn ý định chung -> trọng số 1.3
      let score = phraseScore(t, keywords, 1.3);
      // Khớp gần nguyên văn câu hỏi mẫu -> cộng thêm
      if (normalize(f.question).length > 8 && t.plain.includes(normalize(f.question).replace(/\s*\?$/, ""))) score += 3;
      return { faq: f, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);
}

/**
 * Tìm sản phẩm được nhắc tên cụ thể (bỏ qua từ chung như "sen đá", "xương rồng").
 * Khách gõ CÓ dấu -> so khớp có dấu ("dưới" ≠ "Đuôi", "bị" ≠ "Bi"); gõ không dấu -> so khớp không dấu.
 */
function matchNamedProducts(t: TextForms, products: ProductRow[]): { items: ProductRow[]; exact: boolean } {
  const typedWithAccents = /[^\x00-\x7f]/.test(t.raw);
  const msgWords = new Set((typedWithAccents ? t.accented : t.plain).split(/[^\p{L}\p{N}]+/u).filter(Boolean));

  const scored = products
    .map((p) => {
      const words = p.name
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => !GENERIC_PRODUCT_WORDS.has(normalize(w)))
        .map((w) => (typedWithAccents ? w.normalize("NFC") : normalize(w)))
        .filter(Boolean);
      if (words.length === 0) return { p, ratio: 0, hits: 0 };
      const hits = words.filter((w) => msgWords.has(w)).length;
      // Khớp một phần: chỉ tính các từ đủ dài, tránh "bi", "ba"...
      const longHits = words.filter((w) => w.length > 2 && msgWords.has(w)).length;
      return { p, ratio: hits / words.length, hits: hits === words.length ? hits : longHits };
    })
    .filter((x) => x.hits > 0 && x.ratio >= 0.5)
    .sort((a, b) => b.ratio - a.ratio || b.hits - a.hits);
  if (scored.length === 0) return { items: [], exact: false };
  const best = scored[0].ratio;
  return { items: scored.filter((x) => x.ratio === best).map((x) => x.p).slice(0, 4), exact: best === 1 };
}

/* ------------------------------------------------------------------ */
/* Tư vấn chọn cây                                                     */
/* ------------------------------------------------------------------ */

function detectTraits(t: TextForms): Trait[] {
  return TRAITS.filter((tr) => tr.phrases.some((p) => hasPhrase(t, p)));
}

function recommendProducts(products: ProductRow[], traits: Trait[], budget: Budget | null, limit = 4): ProductRow[] {
  const inBudget = (p: ProductRow) => {
    const price = effectivePrice(p);
    return (budget?.min == null || price >= budget.min) && (budget?.max == null || price <= budget.max);
  };
  // Không nêu đặc điểm -> chỉ gợi ý cây (bỏ chậu, đất)
  const plantOnly = (p: ProductRow) => traits.length > 0 || !["chau-phu-kien", "dat-phan-bon"].includes(p.category?.slug ?? "");
  return products
    .filter((p) => p.stock > 0 && inBudget(p) && plantOnly(p))
    .map((p) => {
      let score = p.isFeatured ? 0.5 : 0;
      for (const tr of traits) {
        if (p.category && tr.categories.includes(p.category.slug)) score += 2;
        if (tr.nameHints?.some((h) => p.searchText.includes(h))) score += 1.5;
      }
      return { p, score };
    })
    .filter((x) => traits.length === 0 || x.score >= 1.5)
    .sort((a, b) => b.score - a.score || effectivePrice(a.p) - effectivePrice(b.p))
    .slice(0, limit)
    .map((x) => x.p);
}

function budgetLabel(b: Budget | null): string {
  if (!b) return "";
  if (b.min != null && b.max != null) return `khoảng ${formatVND(b.min)} – ${formatVND(b.max)}`;
  if (b.max != null) return `dưới ${formatVND(b.max)}`;
  return `từ ${formatVND(b.min!)}`;
}

/* ------------------------------------------------------------------ */
/* Tra cứu đơn hàng                                                    */
/* ------------------------------------------------------------------ */

const STATUS_HINT: Record<OrderStatus, string> = {
  NEW: "Shop đã nhận đơn và sẽ gọi xác nhận sớm nhất.",
  CONFIRMED: "Shop đang chuẩn bị và đóng gói cây cho bạn.",
  SHIPPING: "Đơn đang trên đường giao, bạn để ý điện thoại nhé!",
  COMPLETED: "Đơn đã giao thành công. Cảm ơn bạn đã ủng hộ shop 💚",
  CANCELLED: "Đơn đã bị hủy. Nếu cần hỗ trợ, bạn liên hệ shop nhé.",
};

async function handleOrder(t: TextForms, ctx: ChatContext, ip: string): Promise<BotReply> {
  const code = extractOrderCode(t.raw) ?? ctx.orderCode;
  const phone = extractPhone(t.raw) ?? ctx.orderPhone;

  if (!code || !phone) {
    const next: ChatContext = { awaiting: "order", orderCode: code, orderPhone: phone };
    const ask = !code && !phone
      ? "Bạn gửi giúp mình **mã đơn hàng** (VD: SD261003-7K2F) và **số điện thoại đặt hàng** để mình kiểm tra nhé 📦"
      : !code
        ? `Mình đã ghi nhận SĐT **${phone}**. Bạn gửi thêm **mã đơn hàng** (bắt đầu bằng SD, có trong tin nhắn/trang cảm ơn khi đặt) nhé!`
        : `Mình đã ghi nhận mã đơn **${code}**. Bạn gửi thêm **số điện thoại** dùng khi đặt hàng để xác minh nhé!`;
    return reply({ text: ask, intent: "order_status", source: "rule", answered: true, payload: { quickReplies: [...QUICK_REPLIES.order] }, context: next }, ctx);
  }

  // Chống dò mã đơn
  if (!checkRateLimit(`chat-order:${ip}`, 8, 15 * 60 * 1000).ok) {
    return reply(
      { text: "Bạn tra cứu hơi nhiều lần rồi 😅 Vui lòng thử lại sau ít phút hoặc dùng trang [Tra cứu đơn hàng](/tra-cuu-don-hang).", intent: "order_status", source: "rule", answered: true, payload: {}, context: { awaiting: null } },
      ctx,
    );
  }

  const order = await getOrderForCustomer({ code, phone });
  if (!order) {
    return reply(
      {
        text: `Mình chưa tìm thấy đơn **${code}** với SĐT **${phone}** 🤔 Bạn kiểm tra lại giúp mình nhé (mã đơn bắt đầu bằng SD, SĐT là số dùng khi đặt hàng).`,
        intent: "order_status",
        source: "rule",
        answered: true,
        payload: { quickReplies: ["💬 Gặp nhân viên"] },
        context: { awaiting: "order", orderCode: undefined, orderPhone: undefined },
      },
      ctx,
    );
  }

  const status = order.status as OrderStatus;
  const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);
  const text = [
    `Đơn **${order.code}** của bạn đang ở trạng thái: **${ORDER_STATUS_LABEL[status]}**.`,
    STATUS_HINT[status],
    `- ${itemCount} sản phẩm · Tổng **${formatVND(order.total)}**`,
    `- Thanh toán: ${PAYMENT_METHOD_LABEL[order.paymentMethod as PaymentMethod] ?? order.paymentMethod}`,
    `Xem chi tiết tại [Tra cứu đơn hàng](/tra-cuu-don-hang?ma=${order.code}).`,
  ].join("\n");
  return reply(
    {
      text,
      intent: "order_status",
      source: "rule",
      answered: true,
      payload: { quickReplies: [...QUICK_REPLIES.afterInfo] },
      context: { awaiting: null, orderCode: undefined, orderPhone: undefined },
      facts: `Đơn ${order.code} (đã xác minh bằng SĐT): trạng thái ${ORDER_STATUS_LABEL[status]}; ${itemCount} sản phẩm; tổng ${formatVND(order.total)}.`,
    },
    ctx,
  );
}

/* ------------------------------------------------------------------ */
/* Câu trả lời theo dữ liệu cài đặt                                    */
/* ------------------------------------------------------------------ */

function shippingText(s: Settings["shipping"]): string {
  const lines = [
    s.fee > 0 ? `Phí giao hàng đồng giá **${formatVND(s.fee)}**/đơn.` : "Shop đang **miễn phí giao hàng** cho mọi đơn 🎉",
  ];
  if (s.fee > 0 && s.freeThreshold > 0) lines.push(`🎉 **Miễn phí ship** cho đơn từ **${formatVND(s.freeThreshold)}**.`);
  lines.push("Thời gian giao: nội thành TP.HCM trong 24h, tỉnh khác 2–4 ngày.");
  return lines.join("\n");
}

function contactLines(store: Settings["store"], social: Settings["social"]): string {
  return [
    store.phone && `- Hotline: **${store.phone}**`,
    social.zalo && `- Zalo: [Nhắn Zalo](${social.zalo})`,
    social.facebook && `- Facebook: [Fanpage](${social.facebook})`,
    store.email && `- Email: ${store.email}`,
  ]
    .filter(Boolean)
    .join("\n");
}

/* ------------------------------------------------------------------ */
/* Engine                                                              */
/* ------------------------------------------------------------------ */

/** dryRun: thử trong admin – không ghi thống kê, không tạo liên hệ */
export async function answerMessage(message: string, ctx: ChatContext, opts: { ip: string; dryRun?: boolean }): Promise<BotReply> {
  const t = textForms(message);
  const [settings, products] = await Promise.all([getSettings(), loadProducts()]);
  const { store, shipping, bank, social } = settings;

  // 1. Đang chờ SĐT để gọi lại
  if (ctx.awaiting === "callback") {
    const phone = extractPhone(message);
    if (phone && !opts.dryRun) {
      await prisma.contact.create({
        data: { name: "Khách từ chatbot", contact: phone, message: `[Chatbot] Khách để lại SĐT nhờ gọi tư vấn. Tin nhắn: "${message.slice(0, 300)}"` },
      });
      return reply(
        { text: `Cảm ơn bạn! Mình đã chuyển SĐT **${phone}** cho nhân viên, shop sẽ gọi lại trong giờ làm việc (${store.workingHours || "sớm nhất"}) nhé 💚`, intent: "callback", source: "rule", answered: true, payload: {}, context: { awaiting: null } },
        ctx,
      );
    }
  }

  // 2. Khách không nhớ mã đơn
  if ((ctx.awaiting === "order" || hasPhrase(t, "ma don")) && ["khong nho", "quen ma", "mat ma", "khong biet ma", "khong co ma"].some((p) => hasPhrase(t, p))) {
    return reply(
      {
        text: `Không sao ạ! Mã đơn có trong **trang cảm ơn** sau khi đặt hàng (bắt đầu bằng SD...). Nếu không tìm thấy, bạn gọi hotline${store.phone ? ` **${store.phone}**` : ""} và đọc số điện thoại đặt hàng, nhân viên sẽ kiểm tra giúp bạn nhé 📞`,
        intent: "order_status",
        source: "rule",
        answered: true,
        payload: { quickReplies: ["💬 Gặp nhân viên"] },
        context: { awaiting: null },
      },
      ctx,
    );
  }

  // 3. Có mã đơn trong câu, hoặc đang chờ thông tin đơn và khách gửi SĐT/mã
  const orderCode = extractOrderCode(message);
  const phoneInMsg = extractPhone(message);
  if (orderCode || (ctx.awaiting === "order" && (phoneInMsg || orderCode))) {
    return handleOrder(t, ctx, opts.ip);
  }

  // 4. Chấm điểm ý định + FAQ
  const intents = scoreIntents(t);
  const faqs = await scoreFaqs(t);
  const namedMatch = matchNamedProducts(t, products);
  const traits = detectTraits(t);
  const budget = extractBudget(t);

  const bestIntent = intents.sort((a, b) => b.score - a.score)[0];
  const bestFaq = faqs[0];
  const intentScore = bestIntent?.score ?? 0;
  const faqScore = bestFaq?.score ?? 0;

  // Hỏi về sản phẩm cụ thể (giá, còn hàng) – khi nhắc đúng tên, hoặc nhắc một phần tên mà không đang nhờ tư vấn/chọn quà
  const wantsAdvice = traits.length > 0 || !!budget || intents.some((i) => i.intent === "recommend" || i.intent === "gift");
  // Khớp đủ tên -> trả lời sản phẩm; khớp một phần -> chỉ khi không có FAQ / nhu cầu tư vấn
  const named = namedMatch.exact ? namedMatch.items : !wantsAdvice && !bestFaq ? namedMatch.items : [];
  if (named.length > 0 && faqScore < 2 && !["shipping_fee", "order_status", "hours", "payment", "address"].includes(bestIntent?.intent ?? "")) {
    const lines = named.map((p) => {
      const price = effectivePrice(p);
      const sale = p.salePrice != null && p.salePrice < p.price ? ` (giá gốc ~~${formatVND(p.price)}~~)` : "";
      const stock = p.stock <= 0 ? "tạm hết hàng" : p.stock <= 5 ? `chỉ còn ${p.stock} chậu` : "còn hàng";
      return `- **${p.name}**: ${formatVND(price)}${sale} – ${stock}`;
    });
    return reply(
      {
        text: `${named.length > 1 ? "Mình tìm thấy các sản phẩm:" : "Thông tin sản phẩm:"}\n${lines.join("\n")}`,
        intent: "product_info",
        source: "rule",
        answered: true,
        payload: { products: named.map(toCard), quickReplies: ["🚚 Phí ship bao nhiêu?", "Cách chăm sóc sen đá"] },
        facts: lines.join("\n"),
      },
      ctx,
    );
  }

  // FAQ thắng khi điểm cao hơn (hoặc bằng) ý định chung
  if (bestFaq && faqScore >= Math.max(1.3, intentScore)) {
    if (!opts.dryRun) void prisma.chatFaq.update({ where: { id: bestFaq.faq.id }, data: { hitCount: { increment: 1 } } }).catch(() => {});
    return reply(
      {
        text: bestFaq.faq.answer,
        intent: "faq",
        source: "faq",
        answered: true,
        faqId: bestFaq.faq.id,
        payload: { quickReplies: [...QUICK_REPLIES.afterInfo] },
      },
      { ...ctx, awaiting: null },
    );
  }

  // Có đặc điểm/ngân sách mà không rõ ý định khác -> coi như nhờ tư vấn
  let intent: IntentId = bestIntent?.intent ?? "fallback";
  if ((intent === "fallback" || intent === "product_info" || intent === "greeting") && (traits.length > 0 || budget)) intent = "recommend";
  if (intent === "recommend" && traits.some((tr) => tr.key === "gift") && !intents.some((i) => i.intent === "recommend" && i.score > 1.5)) intent = "gift";

  switch (intent) {
    case "greeting":
      return reply(
        { text: `Chào bạn 👋 Mình là **Bé Sen** – trợ lý của ${store.name}. Mình có thể tư vấn chọn cây, quà tặng, phí ship hay kiểm tra đơn hàng giúp bạn. Bạn cần gì nè?`, intent, source: "rule", answered: true, payload: { quickReplies: [...QUICK_REPLIES.welcome] } },
        ctx,
      );
    case "thanks":
      return reply({ text: "Không có gì ạ 🥰 Bạn cần thêm gì cứ nhắn Bé Sen nhé!", intent, source: "rule", answered: true, payload: { quickReplies: [...QUICK_REPLIES.afterInfo] } }, ctx);
    case "bye":
      return reply({ text: "Chúc bạn một ngày thật xanh 🌿 Hẹn gặp lại!", intent, source: "rule", answered: true, payload: {} }, ctx);

    case "hours":
      return reply(
        {
          text: store.workingHours
            ? `Shop làm việc **${store.workingHours}** ⏰\nĐơn đặt online được nhận 24/7, ngoài giờ shop sẽ xác nhận vào sáng hôm sau nhé!`
            : "Đơn đặt online được nhận 24/7, shop sẽ xác nhận trong giờ làm việc nhé!",
          intent,
          source: "rule",
          answered: true,
          payload: { quickReplies: [...QUICK_REPLIES.afterInfo] },
          facts: `Giờ làm việc: ${store.workingHours}`,
        },
        ctx,
      );

    case "shipping_fee":
      return reply({ text: shippingText(shipping), intent, source: "rule", answered: true, payload: { quickReplies: ["Bao lâu thì nhận được hàng?", "🌱 Tư vấn chọn cây"] }, facts: shippingText(shipping) }, ctx);

    case "payment": {
      const text = [
        "Shop hỗ trợ 2 hình thức thanh toán:",
        "- **COD** – trả tiền mặt khi nhận hàng",
        bank.accountNumber
          ? `- **Chuyển khoản**: ${bank.bankName || bank.bankId} – STK **${bank.accountNumber}** – ${bank.accountName}. Sau khi đặt hàng sẽ có mã QR điền sẵn số tiền & nội dung.`
          : null,
      ]
        .filter(Boolean)
        .join("\n");
      return reply({ text, intent, source: "rule", answered: true, payload: { quickReplies: ["Cách đặt hàng", "🚚 Phí ship bao nhiêu?"] }, facts: text }, ctx);
    }

    case "how_to_order":
      return reply(
        {
          text: "Đặt hàng chỉ mất 1 phút, **không cần tạo tài khoản**:\n- Chọn cây → bấm **Thêm vào giỏ** (hoặc **Mua ngay**)\n- Mở giỏ hàng → **Thanh toán**\n- Nhập họ tên, SĐT, địa chỉ → chọn COD hoặc chuyển khoản → **Đặt hàng**\nShop sẽ gọi xác nhận đơn sớm nhất. Xem [tất cả sản phẩm](/san-pham) nhé!",
          intent,
          source: "rule",
          answered: true,
          payload: { quickReplies: ["🌱 Tư vấn chọn cây", "Thanh toán thế nào?"] },
        },
        ctx,
      );

    case "order_status":
      return handleOrder(t, ctx, opts.ip);

    case "address":
      return reply(
        {
          text: store.address
            ? `📍 Cửa hàng ở **${store.address}**\n${store.workingHours ? `Mở cửa: ${store.workingHours}\n` : ""}Xem bản đồ tại trang [Liên hệ](/lien-he).`
            : "Bạn xem thông tin cửa hàng tại trang [Liên hệ](/lien-he) nhé!",
          intent,
          source: "rule",
          answered: true,
          payload: {},
          facts: `Địa chỉ: ${store.address}`,
        },
        ctx,
      );

    case "contact":
      return reply(
        {
          text: `Bạn có thể liên hệ nhân viên qua:\n${contactLines(store, social)}\nHoặc để lại **số điện thoại** ngay tại đây, shop sẽ gọi lại cho bạn 📞`,
          intent,
          source: "rule",
          answered: true,
          payload: {},
          context: { awaiting: "callback" },
        },
        ctx,
      );

    case "promotion": {
      const onSale = products.filter((p) => p.salePrice != null && p.salePrice < p.price && p.stock > 0).slice(0, 4);
      const text = [
        onSale.length ? "Các sản phẩm đang **giảm giá** 🔥" : "Hiện chưa có sản phẩm giảm giá.",
        shipping.freeThreshold > 0 ? `Ngoài ra shop **miễn phí ship** cho đơn từ **${formatVND(shipping.freeThreshold)}** nhé!` : "",
      ]
        .filter(Boolean)
        .join("\n");
      return reply({ text, intent, source: "rule", answered: true, payload: { products: onSale.map(toCard), quickReplies: ["🌱 Tư vấn chọn cây"] } }, ctx);
    }

    case "catalog": {
      const cats = await prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" }, select: { name: true, slug: true } });
      return reply(
        {
          text: `Shop có các nhóm sản phẩm:\n${cats.map((c) => `- [${c.name}](/danh-muc/${c.slug})`).join("\n")}\nBạn thích loại nào để mình tư vấn kỹ hơn?`,
          intent,
          source: "rule",
          answered: true,
          payload: { quickReplies: [...QUICK_REPLIES.recommendAsk] },
        },
        ctx,
      );
    }

    case "gift":
    case "recommend": {
      const isGift = intent === "gift";
      const giftTraits = isGift && !traits.some((tr) => tr.key === "gift") ? [...traits, TRAITS.find((tr) => tr.key === "gift")!] : traits;
      if (giftTraits.length === 0 && !budget) {
        return reply(
          {
            text: "Bé Sen tư vấn ngay nè 🌱 Bạn cho mình biết thêm: cây để ở đâu (bàn làm việc, ban công...), bạn thích màu gì, hay ngân sách khoảng bao nhiêu?",
            intent,
            source: "rule",
            answered: true,
            payload: { quickReplies: [...QUICK_REPLIES.recommendAsk] },
          },
          ctx,
        );
      }
      let picks = recommendProducts(products, giftTraits, budget);
      let relaxed = false;
      if (picks.length === 0 && budget) {
        picks = recommendProducts(products, giftTraits, null); // bỏ điều kiện giá nếu không có kết quả
        relaxed = true;
      }
      const criteria = [...giftTraits.map((tr) => tr.label), budgetLabel(budget)].filter(Boolean).join(", ");
      const intro = isGift
        ? `Gợi ý quà tặng${criteria ? ` (${criteria})` : ""} 🎁 Shop **gói quà & viết thiệp miễn phí**, bạn ghi lời chúc ở phần Ghi chú khi đặt nhé!`
        : `Với tiêu chí **${criteria}**, Bé Sen gợi ý:`;
      const text = picks.length
        ? `${intro}${relaxed ? `\n(Chưa có sản phẩm ${budgetLabel(budget)} phù hợp, mình gợi ý mẫu gần nhất nhé)` : ""}`
        : "Hiện mình chưa tìm được sản phẩm khớp hết tiêu chí 😢 Bạn thử nới ngân sách hoặc xem [tất cả sản phẩm](/san-pham) nhé!";
      return reply(
        {
          text,
          intent,
          source: "rule",
          answered: picks.length > 0,
          payload: { products: picks.map(toCard), quickReplies: [...(isGift ? QUICK_REPLIES.gift : QUICK_REPLIES.afterRecommend)] },
          facts: picks.map((p) => `${p.name} – ${formatVND(effectivePrice(p))} – /san-pham/${p.slug}`).join("\n"),
        },
        ctx,
      );
    }

    case "product_info": {
      // Hỏi giá chung chung, không nêu tên sản phẩm
      const prices = products.map(effectivePrice);
      return reply(
        {
          text: `Sản phẩm của shop có giá từ **${formatVND(Math.min(...prices))}** đến **${formatVND(Math.max(...prices))}**. Bạn cho mình biết tên cây hoặc nhu cầu để mình báo giá cụ thể nhé!`,
          intent,
          source: "rule",
          answered: true,
          payload: { quickReplies: [...QUICK_REPLIES.recommendAsk] },
        },
        ctx,
      );
    }

    default:
      return reply(
        {
          text: "Xin lỗi, Bé Sen chưa hiểu ý bạn lắm 🥺 Bạn có thể hỏi về **phí ship, thời gian giao hàng, tư vấn chọn cây, quà tặng, tình trạng đơn hàng**... hoặc chọn nhanh bên dưới nhé!",
          intent: "fallback",
          source: "rule",
          answered: false,
          payload: { quickReplies: [...QUICK_REPLIES.fallback] },
        },
        ctx,
      );
  }
}
