/**
 * DỮ LIỆU NHẬN DIỆN CỦA CHATBOT
 * ------------------------------------------------------------------
 * - Cụm từ KHÔNG dấu: khớp cả khi khách gõ có dấu lẫn không dấu.
 * - Cụm từ CÓ dấu: chỉ khớp đúng chữ có dấu (dùng khi bỏ dấu sẽ gây nhầm, VD "đỏ" vs "đồ").
 * - Câu hỏi – đáp tĩnh (thời gian giao hàng, bảo hành, chăm sóc...) nằm trong bảng ChatFaq,
 *   admin sửa tại /admin/chatbot/kien-thuc. File này chỉ chứa các ý định cần TRA DỮ LIỆU THẬT.
 * Xem tài liệu: docs/chatbot.md
 */

export type IntentId =
  | "greeting"
  | "thanks"
  | "bye"
  | "hours"
  | "shipping_fee"
  | "payment"
  | "how_to_order"
  | "order_status"
  | "address"
  | "contact"
  | "recommend"
  | "gift"
  | "promotion"
  | "catalog"
  | "product_info"
  | "faq"
  | "callback"
  | "fallback";

export const INTENT_LABEL: Record<IntentId, string> = {
  greeting: "Chào hỏi",
  thanks: "Cảm ơn",
  bye: "Tạm biệt",
  hours: "Giờ làm việc",
  shipping_fee: "Phí vận chuyển",
  payment: "Thanh toán",
  how_to_order: "Cách đặt hàng",
  order_status: "Tình trạng đơn hàng",
  address: "Địa chỉ cửa hàng",
  contact: "Liên hệ / gặp nhân viên",
  recommend: "Tư vấn chọn cây",
  gift: "Quà tặng",
  promotion: "Khuyến mãi",
  catalog: "Danh mục sản phẩm",
  product_info: "Giá / tồn kho sản phẩm",
  faq: "Câu hỏi thường gặp (FAQ)",
  callback: "Để lại SĐT gọi lại",
  fallback: "Chưa hiểu câu hỏi",
};

/** Cụm từ nhận diện cho từng ý định (trọng số mặc định 1; cụm nhiều từ tự cộng thêm điểm) */
export const INTENT_PHRASES: Partial<Record<IntentId, { phrases: string[]; weight?: number }>> = {
  greeting: { phrases: ["xin chao", "chao", "chao shop", "shop oi", "hello", "hi", "alo", "chao ban", "chao em", "hey"], weight: 0.6 },
  thanks: { phrases: ["cam on", "cam ơn", "thank", "thanks", "thank you", "tks", "ok cam on"], weight: 0.8 },
  bye: { phrases: ["tam biet", "bye", "bai bai", "hen gap lai"], weight: 0.8 },
  hours: {
    phrases: ["gio lam viec", "gio mo cua", "mo cua", "dong cua", "may gio", "thoi gian lam viec", "lam viec luc nao", "chu nhat", "ngay le", "con lam khong", "online khong", "ca lam"],
  },
  shipping_fee: {
    phrases: ["phi ship", "phi van chuyen", "phi giao hang", "tien ship", "ship bao nhieu", "mien phi ship", "freeship", "free ship", "mien phi van chuyen", "mien phi giao hang", "phi gui", "tinh phi ship", "ship"],
  },
  payment: {
    phrases: ["thanh toan", "chuyen khoan", "cod", "tra tien", "stk", "so tai khoan", "ngan hang", "quet ma", "qr", "tra sau", "tien mat"],
  },
  how_to_order: {
    phrases: ["dat hang", "mua hang", "mua nhu the nao", "cach mua", "dat nhu the nao", "order", "cach dat", "dat mua", "mua o dau", "huong dan mua", "huong dan dat"],
  },
  order_status: {
    phrases: ["don hang", "tra cuu", "kiem tra don", "tinh trang don", "trang thai don", "don cua toi", "don cua minh", "giao chua", "da giao chua", "ma don", "theo doi don", "don dang o dau", "bao gio nhan", "chua nhan duoc", "huy don"],
    weight: 1.2,
  },
  address: {
    phrases: ["dia chi", "cua hang o dau", "shop o dau", "ban do", "ghe shop", "mua truc tiep", "den xem", "xem cay truc tiep", "chi duong", "o dau vay"],
  },
  contact: {
    phrases: ["lien he", "hotline", "so dien thoai shop", "sdt shop", "zalo", "goi dien", "nhan vien", "nguoi that", "gap nguoi", "tu van vien", "facebook", "fanpage", "email"],
  },
  promotion: {
    phrases: ["khuyen mai", "giam gia", "sale", "ma giam", "uu dai", "voucher", "dang giam", "giam bao nhieu", "chuong trinh"],
  },
  catalog: {
    phrases: ["co nhung loai nao", "co nhung gi", "ban nhung gi", "danh muc", "san pham gi", "co loai nao", "co ban gi", "co nhung cay nao"],
  },
  recommend: {
    phrases: ["tu van", "goi y", "nen mua", "nen chon", "loai nao", "cay nao", "phu hop", "chon cay", "chon giup", "chon dum", "muon mua", "can mua", "cay gi"],
    weight: 1.1,
  },
  gift: {
    phrases: ["quà", "qua tang", "tang qua", "lam qua", "mon qua", "sinh nhat", "tang ban", "tang nguoi yeu", "ban gai", "ban trai", "dong nghiep", "khai truong", "valentine", "20 10", "8 3", "tang sep", "tang me", "tang co", "qua tet", "tan gia"],
    weight: 1.2,
  },
  product_info: {
    phrases: ["gia", "bao nhieu tien", "bao nhieu", "con hang", "het hang", "con khong", "co khong", "con ban", "gia sao"],
    weight: 0.5,
  },
};

/** Đặc điểm khách mô tả -> danh mục / từ khóa sản phẩm để gợi ý (dùng cho tư vấn chọn cây) */
export type Trait = {
  key: string;
  label: string; // hiển thị lại cho khách: "Mình gợi ý cây dễ chăm..."
  phrases: string[];
  categories: string[]; // slug danh mục được cộng điểm
  nameHints?: string[]; // từ khóa trong tên sản phẩm (không dấu) được cộng điểm
};

export const TRAITS: Trait[] = [
  {
    key: "easy",
    label: "dễ chăm, hợp người mới",
    phrases: ["de cham", "nguoi moi", "moi choi", "moi trong", "it cham", "luoi", "ban ron", "de song", "de trong", "khong co thoi gian", "it tuoi", "hay quen tuoi"],
    categories: ["sen-da-mini", "sen-da-kim-cuong", "xuong-rong"],
    nameHints: ["nau", "ngoc bich", "mong rong", "trung chim", "phat ba"],
  },
  {
    key: "shade",
    label: "chịu bóng, để trong nhà / văn phòng",
    phrases: ["chiu bong", "it nang", "thieu nang", "khong co nang", "van phong", "trong nha", "phong ngu", "ban lam viec", "phong lanh", "may lanh", "dieu hoa", "cong ty"],
    categories: ["sen-da-kim-cuong"],
    nameHints: ["mong rong", "kim cuong"],
  },
  {
    key: "hanging",
    label: "dáng rủ, trồng chậu treo",
    phrases: ["treo", "dang ru", "cay ru", "chau treo", "day dai", "ban cong treo", "chuoi ngoc"],
    categories: ["sen-da-chuoi-ngoc"],
  },
  {
    key: "colorful",
    label: "màu sắc nổi bật",
    phrases: ["mau do", "đỏ", "hồng", "tím", "mau hong", "mau tim", "mau sac", "len mau", "ruc ro", "noi bat", "vien do", "nhieu mau"],
    categories: ["sen-da-vien-do"],
    nameHints: ["lola", "hong phan", "ruby", "romeo", "vien do"],
  },
  {
    key: "flower",
    label: "xương rồng / cây ra hoa",
    phrases: ["xuong rong", "ra hoa", "co hoa", "no hoa", "hoa dep", "cay gai"],
    categories: ["xuong-rong"],
  },
  {
    key: "terrarium",
    label: "tiểu cảnh terrarium",
    phrases: ["tieu canh", "terrarium", "binh thuy tinh", "binh cau", "chuong thuy tinh", "sa mac"],
    categories: ["tieu-canh-terrarium"],
  },
  {
    key: "mini",
    label: "nhỏ xinh để bàn",
    phrases: ["mini", "nho xinh", "de ban", "nho gon", "ban hoc", "be xiu", "nho nho"],
    categories: ["sen-da-mini"],
  },
  {
    key: "pot",
    label: "chậu & phụ kiện",
    phrases: ["chau su", "chau dat nung", "chau trong", "chau dep", "mua chau", "ke go", "ke trung bay", "phu kien", "trang tri"],
    categories: ["chau-phu-kien"],
  },
  {
    key: "soil",
    label: "đất & phân bón",
    phrases: ["dat trong", "dat sen da", "phan bon", "gia the", "perlite", "da bot", "pumice", "tron dat"],
    categories: ["dat-phan-bon"],
  },
  {
    key: "gift",
    label: "làm quà tặng",
    phrases: ["quà", "qua tang", "tang qua", "lam qua", "mon qua", "sinh nhat", "tang ban", "tang nguoi yeu", "dong nghiep", "khai truong", "valentine", "tan gia"],
    categories: ["tieu-canh-terrarium", "chau-phu-kien"],
    nameHints: ["terrarium", "tuong", "chuong", "lola", "hong phan"],
  },
  {
    key: "rare",
    label: "giống hiếm, sưu tầm",
    phrases: ["hiem", "doc la", "suu tam", "cao cap", "dac biet", "doc dao"],
    categories: [],
    nameHints: ["truncata", "romeo", "chuoi ngoc day dai"],
  },
];

/** Từ quá chung, không dùng để nhận diện tên sản phẩm cụ thể */
export const GENERIC_PRODUCT_WORDS = new Set([
  "sen", "da", "xuong", "rong", "chau", "cay", "mini", "tieu", "canh", "dat", "1", "2", "3", "kg", "lit", "10cm", "40cm", "ngoc",
]);

/** Nút trả lời nhanh (khách bấm = gửi câu đó) */
export const QUICK_REPLIES = {
  welcome: ["🌱 Tư vấn chọn cây", "🎁 Quà tặng sen đá", "🚚 Phí ship bao nhiêu?", "📦 Tra cứu đơn hàng", "⏰ Giờ làm việc"],
  afterInfo: ["🌱 Tư vấn chọn cây", "📦 Tra cứu đơn hàng", "💬 Gặp nhân viên"],
  recommendAsk: ["Cây dễ chăm cho người mới", "Để bàn làm việc, ít nắng", "Treo ban công", "Màu sắc rực rỡ", "Dưới 100k"],
  afterRecommend: ["Dưới 50k", "Cây chịu bóng", "Làm quà tặng", "Cách chăm sóc sen đá"],
  gift: ["Quà dưới 300k", "Tiểu cảnh terrarium", "Có gói quà không?", "Mua số lượng nhiều"],
  order: ["Tôi không nhớ mã đơn", "💬 Gặp nhân viên"],
  fallback: ["🌱 Tư vấn chọn cây", "🚚 Phí ship bao nhiêu?", "📦 Tra cứu đơn hàng", "💬 Gặp nhân viên"],
} as const;
