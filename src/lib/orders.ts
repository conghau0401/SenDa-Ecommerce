import "server-only";
import { prisma } from "./prisma";

/** Dữ liệu đơn hàng hiển thị cho khách (trang cảm ơn, tra cứu) */
export async function getOrderForCustomer(where: { code: string; phone?: string }) {
  return prisma.order.findFirst({
    where: { code: where.code, ...(where.phone ? { phone: where.phone } : {}) },
    select: {
      code: true,
      customerName: true,
      phone: true,
      address: true,
      note: true,
      paymentMethod: true,
      status: true,
      subtotal: true,
      shippingFee: true,
      total: true,
      createdAt: true,
      updatedAt: true,
      items: {
        select: { productName: true, productImage: true, price: true, quantity: true, product: { select: { slug: true } } },
      },
    },
  });
}

export type CustomerOrder = NonNullable<Awaited<ReturnType<typeof getOrderForCustomer>>>;
