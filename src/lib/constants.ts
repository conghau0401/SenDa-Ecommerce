export const ORDER_STATUSES = ["NEW", "CONFIRMED", "SHIPPING", "COMPLETED", "CANCELLED"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  NEW: "Mới",
  CONFIRMED: "Đã xác nhận",
  SHIPPING: "Đang giao",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
};

/** Các bước chuyển trạng thái hợp lệ */
export const ORDER_STATUS_FLOW: Record<OrderStatus, OrderStatus[]> = {
  NEW: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["SHIPPING", "CANCELLED"],
  SHIPPING: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

export const PAYMENT_METHODS = ["COD", "BANK_TRANSFER"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  COD: "Thanh toán khi nhận hàng (COD)",
  BANK_TRANSFER: "Chuyển khoản ngân hàng",
};

export const POST_STATUSES = ["DRAFT", "PUBLISHED"] as const;
export type PostStatus = (typeof POST_STATUSES)[number];

export const PRODUCTS_PER_PAGE = 12;
export const LOW_STOCK_THRESHOLD = 5;
