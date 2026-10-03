import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Phone } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/format";
import { Card, PageHeader } from "@/components/admin/ui";
import { OrderStatusBadge, OrderTimeline } from "@/components/order/order-status";
import { OrderItemsSummary, OrderShippingInfo } from "@/components/order/order-details";
import { OrderNoteForm, OrderStatusActions } from "@/components/admin/order-actions";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = Number((await params).id);
  const order = Number.isInteger(id) ? await prisma.order.findUnique({ where: { id }, select: { code: true } }) : null;
  return { title: order ? `Đơn ${order.code}` : "Đơn hàng" };
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        select: { productName: true, productImage: true, price: true, quantity: true, product: { select: { slug: true } } },
      },
    },
  });
  if (!order) notFound();

  return (
    <>
      <PageHeader
        title={`Đơn ${order.code}`}
        description={
          <span className="flex flex-wrap items-center gap-2">
            <OrderStatusBadge status={order.status} /> Đặt lúc {formatDateTime(order.createdAt)} · cập nhật{" "}
            {formatDateTime(order.updatedAt)}
          </span>
        }
        back={{ href: "/admin/don-hang", label: "Đơn hàng" }}
        actions={
          <a
            href={`tel:${order.phone}`}
            className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-surface px-4 text-sm font-medium hover:bg-leaf-50"
          >
            <Phone className="size-4" aria-hidden /> Gọi khách
          </a>
        }
      />

      <div className="grid items-start gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <Card title="Xử lý đơn hàng">
            <OrderTimeline status={order.status} />
            <div className="mt-6 border-t border-border pt-5">
              <OrderStatusActions id={order.id} status={order.status} />
            </div>
          </Card>
          <Card title="Sản phẩm">
            <OrderItemsSummary order={order} />
          </Card>
        </div>
        <div className="space-y-6">
          <Card title="Khách hàng & giao hàng">
            <OrderShippingInfo order={order} />
          </Card>
          <Card title="Ghi chú nội bộ" description="Khách hàng không thấy ghi chú này">
            <OrderNoteForm id={order.id} initial={order.internalNote ?? ""} />
          </Card>
        </div>
      </div>
    </>
  );
}
