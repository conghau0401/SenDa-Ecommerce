import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/ui";
import { ProductForm } from "@/components/admin/product-form";

export const metadata: Metadata = { title: "Thêm sản phẩm" };

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" }, select: { id: true, name: true } });
  return (
    <>
      <PageHeader title="Thêm sản phẩm" back={{ href: "/admin/san-pham", label: "Sản phẩm" }} />
      <ProductForm
        id={null}
        categories={categories}
        initial={{
          name: "",
          slug: "",
          sku: "",
          categoryId: "",
          price: "",
          salePrice: "",
          stock: "0",
          sortOrder: "0",
          shortDesc: "",
          description: "",
          careGuide: "",
          images: [],
          isActive: true,
          showOnHome: false,
          isFeatured: false,
          isNew: true,
          metaTitle: "",
          metaDescription: "",
        }}
      />
    </>
  );
}
