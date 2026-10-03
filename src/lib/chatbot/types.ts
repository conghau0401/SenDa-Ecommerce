import type { IntentId } from "./knowledge";

export type ChatProductCard = {
  id: number;
  slug: string;
  name: string;
  price: number;
  salePrice: number | null;
  stock: number;
  image: string | null;
};

export type ChatPayload = {
  products?: ChatProductCard[];
  quickReplies?: string[];
  links?: { label: string; href: string }[];
};

/** Trạng thái hội thoại lưu trong ChatConversation.context */
export type ChatContext = {
  awaiting?: "order" | "callback" | null;
  orderCode?: string;
  orderPhone?: string;
  lastIntent?: IntentId;
};

export type BotReply = {
  text: string;
  intent: IntentId;
  source: "rule" | "faq" | "ai";
  answered: boolean;
  payload: ChatPayload;
  context: ChatContext;
  /** Thông tin bổ sung cho AI (đã xác thực), không hiển thị trực tiếp */
  facts?: string;
  faqId?: number;
};

/** Tin nhắn trả về client */
export type ChatMessageDTO = {
  id: number;
  role: "user" | "bot";
  content: string;
  payload: ChatPayload | null;
  createdAt: string;
};
