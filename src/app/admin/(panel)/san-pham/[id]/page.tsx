import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/ui";
import { ProductForm } from "@/components/admin/product-form";
import { DeleteProductButton } from "@/components/admin/product-row-actions";

type Props = { params: Promise<{ id: string }> };

export const metadata: Metadata = { title: "Sửa sản phẩm" };

export default async function EditProductPage({ params }: Props) {
  const id = Number((await params).id);
  if (!Number.isInteger(id)) notFound();
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id }, include: { images: { orderBy: { sortOrder: "asc" } } } }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!product) notFound();

  return (
    <>
      <PageHeader
        title={product.name}
        description={`Cập nhật lần cuối ${product.updatedAt.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}`}
        back={{ href: "/admin/san-pham", label: "Sản phẩm" }}
        actions={<DeleteProductButton id={product.id} name={product.name} redirectTo="/admin/san-pham" />}
      />
      <ProductForm
        key={product.updatedAt.toISOString()}
        id={product.id}
        categories={categories}
        initial={{
          name: product.name,
          slug: product.slug,
          sku: product.sku ?? "",
          categoryId: product.categoryId ? String(product.categoryId) : "",
          price: String(product.price),
          salePrice: product.salePrice != null ? String(product.salePrice) : "",
          stock: String(product.stock),
          sortOrder: String(product.sortOrder),
          shortDesc: product.shortDesc ?? "",
          description: product.description,
          careGuide: product.careGuide,
          images: product.images.map((i) => ({ id: String(i.id), url: i.url, alt: i.alt ?? "" })),
          isActive: product.isActive,
          showOnHome: product.showOnHome,
          isFeatured: product.isFeatured,
          isNew: product.isNew,
          metaTitle: product.metaTitle ?? "",
          metaDescription: product.metaDescription ?? "",
        }}
      />
    </>
  );
}
