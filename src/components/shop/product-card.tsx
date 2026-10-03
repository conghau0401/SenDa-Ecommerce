import Image from "next/image";
import Link from "next/link";
import type { ProductCardData } from "@/lib/queries";
import { discountPercent, effectivePrice } from "@/lib/format";
import { LOW_STOCK_THRESHOLD } from "@/lib/constants";
import { Badge } from "../ui/badge";
import { Price } from "../ui/price";
import { QuickAddButton } from "../cart/quick-add-button";

export function ProductCard({ product, priority }: { product: ProductCardData; priority?: boolean }) {
  const [img, hoverImg] = product.images;
  const discount = discountPercent(product.price, product.salePrice);
  const outOfStock = product.stock <= 0;
  const href = `/san-pham/${product.slug}`;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-card bg-surface shadow-soft ring-1 ring-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <Link href={href} className="relative block aspect-square overflow-hidden bg-sand" tabIndex={-1} aria-hidden>
        {img ? (
          <>
            <Image
              src={img.url}
              alt={img.alt || product.name}
              fill
              priority={priority}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {hoverImg && (
              <Image
                src={hoverImg.url}
                alt=""
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            )}
          </>
        ) : null}
        {outOfStock && <div className="absolute inset-0 bg-white/50" />}
      </Link>

      <div className="pointer-events-none absolute top-2.5 left-2.5 flex flex-col items-start gap-1.5">
        {discount > 0 && <Badge tone="sale">-{discount}%</Badge>}
        {product.isNew && <Badge tone="mint">Mới</Badge>}
        {outOfStock && <Badge tone="dark">Hết hàng</Badge>}
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        {product.category && <p className="mb-1 text-xs text-muted">{product.category.name}</p>}
        <h3 className="line-clamp-2 text-sm leading-snug font-semibold text-foreground sm:text-[15px]">
          <Link href={href} className="after:absolute after:inset-0 after:content-[''] hover:text-leaf-700 focus-visible:outline-none">
            {product.name}
          </Link>
        </h3>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2.5">
          <div>
            <Price price={product.price} salePrice={product.salePrice} size="sm" />
            {!outOfStock && product.stock <= LOW_STOCK_THRESHOLD && (
              <p className="mt-0.5 text-xs font-medium text-warning">Chỉ còn {product.stock}</p>
            )}
          </div>
          {!outOfStock && (
            <QuickAddButton
              product={{
                productId: product.id,
                slug: product.slug,
                name: product.name,
                image: img?.url ?? null,
                price: effectivePrice(product),
                stock: product.stock,
              }}
            />
          )}
        </div>
      </div>
    </article>
  );
}
