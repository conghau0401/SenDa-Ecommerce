"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSettings, calcShippingFee } from "@/lib/settings";
import { generateOrderCode } from "@/lib/order-code";
import { effectivePrice } from "@/lib/format";
import { checkoutSchema, lookupSchema, type CheckoutInput } from "@/lib/validators/order";
import { fieldErrors, type ActionResult } from "@/lib/validators/common";
import { rememberOrderCode } from "@/lib/recent-orders";
import { getOrderForCustomer, type CustomerOrder } from "@/lib/orders";

const visibleProduct = {
  isActive: true,
  OR: [{ categoryId: null }, { category: { isActive: true } }],
};

export type CartSnapshotItem = { productId: number; name: string; price: number; stock: number; image: string | null };

/** Giá/tồn kho mới nhất cho các sản phẩm trong giỏ (sản phẩm đã ẩn/xóa sẽ không có trong kết quả) */
export async function getCartSnapshot(productIds: number[]): Promise<CartSnapshotItem[]> {
  const ids = [...new Set(productIds.filter((n) => Number.isInteger(n) && n > 0))].slice(0, 100);
  if (ids.length === 0) return [];
  const products = await prisma.product.findMany({
    where: { ...visibleProduct, id: { in: ids } },
    select: {
      id: true,
      name: true,
      price: true,
      salePrice: true,
      stock: true,
      images: { select: { url: true }, orderBy: { sortOrder: "asc" }, take: 1 },
    },
  });
  return products.map((p) => ({
    productId: p.id,
    name: p.name,
    price: effectivePrice(p),
    stock: p.stock,
    image: p.images[0]?.url ?? null,
  }));
}

/** Lỗi nghiệp vụ trong transaction – để rollback và trả thông báo rõ ràng */
class OrderError extends Error {
  constructor(
    message: string,
    public stockIssues?: { productId: number; name: string; available: number }[],
  ) {
    super(message);
  }
}

export type PlaceOrderResult =
  | { ok: true; code: string }
  | {
      ok: false;
      message: string;
      errors?: Record<string, string>;
      stockIssues?: { productId: number; name: string; available: number }[];
    };

export async function placeOrder(input: CheckoutInput): Promise<PlaceOrderResult> {
  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, message: "Vui lòng kiểm tra lại thông tin", errors: fieldErrors(parsed.error) };
  }
  const data = parsed.data;

  // Gộp các dòng trùng sản phẩm
  const qtyById = new Map<number, number>();
  for (const it of data.items) qtyById.set(it.productId, (qtyById.get(it.productId) ?? 0) + it.quantity);

  const { shipping } = await getSettings();

  try {
    const order = await prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany({
        where: { ...visibleProduct, id: { in: [...qtyById.keys()] } },
        select: {
          id: true,
          slug: true,
          name: true,
          price: true,
          salePrice: true,
          stock: true,
          images: { select: { url: true }, orderBy: { sortOrder: "asc" }, take: 1 },
        },
      });
      const byId = new Map(products.map((p) => [p.id, p]));

      // Kiểm tra tồn tại + tồn kho trước để báo lỗi đầy đủ một lần
      const issues: { productId: number; name: string; available: number }[] = [];
      for (const [id, qty] of qtyById) {
        const p = byId.get(id);
        if (!p) issues.push({ productId: id, name: "Sản phẩm không còn kinh doanh", available: 0 });
        else if (p.stock < qty) issues.push({ productId: id, name: p.name, available: p.stock });
      }
      if (issues.length) throw new OrderError("Một số sản phẩm không đủ hàng", issues);

      // Trừ kho có điều kiện (stock >= qty) – an toàn khi nhiều người đặt cùng lúc
      for (const [id, qty] of qtyById) {
        const res = await tx.product.updateMany({
          where: { id, stock: { gte: qty } },
          data: { stock: { decrement: qty } },
        });
        if (res.count === 0) {
          const p = byId.get(id)!;
          throw new OrderError("Một số sản phẩm vừa hết hàng", [{ productId: id, name: p.name, available: 0 }]);
        }
      }

      // Giá luôn tính ở server
      const items = [...qtyById].map(([id, quantity]) => {
        const p = byId.get(id)!;
        return { productId: id, productName: p.name, productImage: p.images[0]?.url ?? null, price: effectivePrice(p), quantity };
      });
      const subtotal = items.reduce((s, it) => s + it.price * it.quantity, 0);
      const shippingFee = calcShippingFee(subtotal, shipping);

      let code = generateOrderCode();
      for (let i = 0; i < 5 && (await tx.order.findUnique({ where: { code }, select: { id: true } })); i++) {
        code = generateOrderCode();
      }

      const created = await tx.order.create({
        data: {
          code,
          customerName: data.customerName,
          phone: data.phone,
          address: data.address,
          note: data.note || null,
          paymentMethod: data.paymentMethod,
          status: "NEW",
          subtotal,
          shippingFee,
          total: subtotal + shippingFee,
          items: { create: items },
        },
        select: { code: true },
      });
      return { code: created.code, slugs: products.map((p) => p.slug) };
    });

    await rememberOrderCode(order.code);
    // Tồn kho đã đổi -> làm mới các trang có cache
    revalidatePath("/");
    for (const slug of order.slugs) revalidatePath(`/san-pham/${slug}`);

    return { ok: true, code: order.code };
  } catch (err) {
    if (err instanceof OrderError) return { ok: false, message: err.message, stockIssues: err.stockIssues };
    console.error("placeOrder", err);
    return { ok: false, message: "Không thể đặt hàng lúc này, vui lòng thử lại sau ít phút" };
  }
}

export async function lookupOrder(
  _prev: ActionResult<CustomerOrder> | null,
  formData: FormData,
): Promise<ActionResult<CustomerOrder>> {
  const parsed = lookupSchema.safeParse({ phone: formData.get("phone"), code: formData.get("code") });
  if (!parsed.success) return { ok: false, message: "Vui lòng kiểm tra lại thông tin", errors: fieldErrors(parsed.error) };

  const order = await getOrderForCustomer({ code: parsed.data.code, phone: parsed.data.phone });
  if (!order) {
    return { ok: false, message: "Không tìm thấy đơn hàng. Vui lòng kiểm tra lại số điện thoại và mã đơn." };
  }
  return { ok: true, data: order };
}
