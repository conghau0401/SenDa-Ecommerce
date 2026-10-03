import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { parseListingParams } from "@/lib/listing-params";
import { getCategoryBySlug } from "@/lib/queries";
import { ProductListing } from "@/components/shop/product-listing";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Không tìm thấy danh mục" };
  return {
    title: category.name,
    description: category.description ?? `Mua ${category.name.toLowerCase()} đẹp, giá tốt, giao tận nơi.`,
    alternates: { canonical: `/danh-muc/${category.slug}` },
    openGraph: category.image ? { images: [{ url: category.image }] } : undefined,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const listingParams = { ...parseListingParams(await searchParams), category: category.slug };

  return (
    <div className="container-page py-6 sm:py-10">
      <Breadcrumbs items={[{ label: "Sản phẩm", href: "/san-pham" }, { label: category.name }]} />
      <header className="mt-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-leaf-900 sm:text-4xl">{category.name}</h1>
        {category.description && <p className="mt-2 max-w-2xl text-muted">{category.description}</p>}
      </header>
      <ProductListing params={listingParams} basePath={`/danh-muc/${category.slug}`} />
    </div>
  );
}
