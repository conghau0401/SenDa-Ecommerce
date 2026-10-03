import type { Metadata } from "next";
import { parseListingParams } from "@/lib/listing-params";
import { getCategoryBySlug } from "@/lib/queries";
import { ProductListing } from "@/components/shop/product-listing";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = parseListingParams(await searchParams);
  const title = params.q ? `Tìm kiếm "${params.q}"` : "Tất cả sản phẩm";
  return {
    title,
    description: "Sen đá, xương rồng, tiểu cảnh terrarium và phụ kiện trồng cây – giá tốt, giao tận nơi.",
    alternates: { canonical: "/san-pham" },
    // Trang kết quả tìm kiếm/lọc không cần index
    robots: params.q || params.min != null || params.max != null ? { index: false, follow: true } : undefined,
  };
}

export default async function ProductsPage({ searchParams }: Props) {
  const params = parseListingParams(await searchParams);
  const category = params.category ? await getCategoryBySlug(params.category) : null;

  return (
    <div className="container-page py-6 sm:py-10">
      <Breadcrumbs items={[{ label: "Sản phẩm", href: category ? "/san-pham" : undefined }, ...(category ? [{ label: category.name }] : [])]} />
      <header className="mt-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-leaf-900 sm:text-4xl">
          {params.q ? (
            <>
              Kết quả cho <span className="text-leaf-600">&ldquo;{params.q}&rdquo;</span>
            </>
          ) : (
            (category?.name ?? "Tất cả sản phẩm")
          )}
        </h1>
        <p className="mt-2 max-w-2xl text-muted">
          {category?.description ?? "Sen đá, xương rồng và tiểu cảnh xinh xắn – tuyển chọn kỹ, đóng gói cẩn thận."}
        </p>
      </header>
      <ProductListing params={params} basePath="/san-pham" />
    </div>
  );
}
