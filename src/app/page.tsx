import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/settings";
import { formatVND } from "@/lib/format";

// Trang tạm để kiểm tra giai đoạn 1 (sẽ được thay bằng trang chủ thật ở giai đoạn 2)
export const dynamic = "force-dynamic";

export default async function Page() {
  const [settings, counts, products] = await Promise.all([
    getSettings(),
    Promise.all([prisma.category.count(), prisma.product.count(), prisma.post.count(), prisma.order.count()]),
    prisma.product.findMany({ take: 8, orderBy: { sortOrder: "asc" }, include: { images: { take: 1, orderBy: { sortOrder: "asc" } } } }),
  ]);
  const swatches = ["bg-leaf-50", "bg-leaf-100", "bg-leaf-300", "bg-leaf-500", "bg-leaf-700", "bg-leaf-900"];

  return (
    <main className="container-page py-12">
      <h1 className="text-3xl font-bold text-leaf-800">{settings.store.name} – Giai đoạn 1 ✓</h1>
      <p className="mt-2 text-muted">Tiếng Việt: Sen đá xinh xắn, ưa nắng nhẹ – ữ ỹ ặ ẩ đ</p>
      <p className="mt-4">
        Danh mục: {counts[0]} · Sản phẩm: {counts[1]} · Bài viết: {counts[2]} · Đơn hàng: {counts[3]}
      </p>
      <div className="mt-6 flex gap-2">
        {swatches.map((s) => (
          <div key={s} className={`size-14 rounded-xl shadow-soft ${s}`} title={s} />
        ))}
      </div>
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {products.map((p) => (
          <div key={p.id} className="overflow-hidden rounded-card bg-surface shadow-soft">
            <div className="relative aspect-square">
              <Image src={p.images[0].url} alt={p.name} fill sizes="25vw" className="object-cover" />
            </div>
            <div className="p-3 text-sm">
              <p className="font-medium">{p.name}</p>
              <p className="font-semibold text-leaf-700">{formatVND(p.salePrice ?? p.price)}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
