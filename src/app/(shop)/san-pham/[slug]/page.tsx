import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, CircleAlert, HeartHandshake, PackageCheck, Truck, XCircle } from "lucide-react";
import { getProductBySlug, getRelatedProducts } from "@/lib/queries";
import { getSettings } from "@/lib/settings";
import { effectivePrice, discountPercent, formatVND } from "@/lib/format";
import { htmlToText, sanitizeHtml } from "@/lib/sanitize";
import { LOW_STOCK_THRESHOLD } from "@/lib/constants";
import { SITE_URL } from "@/lib/site";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductGallery } from "@/components/shop/product-gallery";
import { ProductPurchase } from "@/components/shop/product-purchase";
import { ProductTabs } from "@/components/shop/product-tabs";
import { ProductGrid } from "@/components/shop/product-grid";

export const revalidate = 300;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Không tìm thấy sản phẩm" };
  const description =
    product.metaDescription || product.shortDesc || htmlToText(product.description) || `Mua ${product.name} giá tốt.`;
  return {
    title: product.metaTitle || product.name,
    description,
    alternates: { canonical: `/san-pham/${product.slug}` },
    openGraph: {
      title: product.metaTitle || product.name,
      description,
      images: product.images.slice(0, 1).map((i) => ({ url: i.url, alt: i.alt ?? product.name })),
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [related, { shipping }] = await Promise.all([
    getRelatedProducts(product.id, product.categoryId),
    getSettings(),
  ]);

  const finalPrice = effectivePrice(product);
  const discount = discountPercent(product.price, product.salePrice);
  const inStock = product.stock > 0;
  const lowStock = inStock && product.stock <= LOW_STOCK_THRESHOLD;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku ?? undefined,
    image: product.images.map((i) => `${SITE_URL}${i.url}`),
    description: product.shortDesc || htmlToText(product.description, 300),
    category: product.category?.name,
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/san-pham/${product.slug}`,
      priceCurrency: "VND",
      price: finalPrice,
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <div className="container-page py-6 pb-28 sm:py-10 lg:pb-10">
      <Breadcrumbs
        items={[
          { label: "Sản phẩm", href: "/san-pham" },
          ...(product.category ? [{ label: product.category.name, href: `/danh-muc/${product.category.slug}` }] : []),
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-14">
        <ProductGallery
          images={product.images}
          name={product.name}
          badges={
            <>
              {discount > 0 && <Badge tone="sale">-{discount}%</Badge>}
              {product.isNew && <Badge tone="mint">Mới</Badge>}
            </>
          }
        />

        <div className="lg:py-2">
          {product.category && (
            <Link
              href={`/danh-muc/${product.category.slug}`}
              className="text-sm font-semibold tracking-wide text-leaf-600 uppercase hover:text-leaf-700"
            >
              {product.category.name}
            </Link>
          )}
          <h1 className="mt-1.5 text-3xl leading-tight font-bold tracking-tight text-leaf-900 sm:text-4xl">
            {product.name}
          </h1>
          {product.sku && <p className="mt-1.5 text-sm text-muted">Mã SP: {product.sku}</p>}

          <Price price={product.price} salePrice={product.salePrice} size="lg" className="mt-5" />

          <p className="mt-3 flex items-center gap-2 text-sm font-medium">
            {!inStock ? (
              <>
                <XCircle className="size-4 text-danger" aria-hidden />
                <span className="text-danger">Hết hàng</span>
              </>
            ) : lowStock ? (
              <>
                <CircleAlert className="size-4 text-warning" aria-hidden />
                <span className="text-warning">Sắp hết – chỉ còn {product.stock} sản phẩm</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="size-4 text-leaf-600" aria-hidden />
                <span className="text-leaf-700">Còn hàng</span>
              </>
            )}
          </p>

          {product.shortDesc && <p className="mt-5 text-[15px] leading-relaxed text-foreground/85">{product.shortDesc}</p>}

          <div className="mt-7">
            <ProductPurchase
              product={{
                productId: product.id,
                slug: product.slug,
                name: product.name,
                image: product.images[0]?.url ?? null,
                price: finalPrice,
                stock: product.stock,
              }}
              price={product.price}
              salePrice={product.salePrice}
            />
          </div>

          <ul className="mt-8 grid gap-3 rounded-2xl bg-leaf-50 p-5 text-sm sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            <li className="flex items-start gap-2.5">
              <Truck className="size-5 shrink-0 text-leaf-700" aria-hidden />
              <span>
                {shipping.freeThreshold > 0 ? <>Miễn phí ship từ <strong>{formatVND(shipping.freeThreshold)}</strong></> : "Giao hàng toàn quốc"}
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <PackageCheck className="size-5 shrink-0 text-leaf-700" aria-hidden />
              <span>Đóng gói chống sốc, cố định gốc</span>
            </li>
            <li className="flex items-start gap-2.5">
              <HeartHandshake className="size-5 shrink-0 text-leaf-700" aria-hidden />
              <span>Bảo hành cây 7 ngày</span>
            </li>
          </ul>
        </div>
      </div>

      <section className="mt-14 sm:mt-20">
        <ProductTabs
          tabs={[
            { key: "desc", label: "Mô tả sản phẩm", html: sanitizeHtml(product.description) },
            { key: "care", label: "Hướng dẫn chăm sóc", html: sanitizeHtml(product.careGuide) },
          ]}
        />
      </section>

      {related.length > 0 && (
        <section className="mt-16 sm:mt-24">
          <SectionHeading title="Có thể bạn cũng thích" href={product.category ? `/danh-muc/${product.category.slug}` : "/san-pham"} />
          <ProductGrid products={related} />
        </section>
      )}

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}
