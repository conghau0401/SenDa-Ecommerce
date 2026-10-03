import { getActiveCategories, getProducts } from "@/lib/queries";
import { listingQuery, type ListingParams } from "@/lib/listing-params";
import { ProductGrid } from "./product-grid";
import { ActiveFilterChips, ProductFilters, SortSelect } from "./product-filters";
import { Pagination } from "../ui/pagination";
import { EmptyState } from "../ui/empty-state";
import { ButtonLink } from "../ui/button";

/** Danh sách sản phẩm + bộ lọc – dùng cho /san-pham và /danh-muc/[slug] */
export async function ProductListing({ params, basePath }: { params: ListingParams; basePath: string }) {
  const [categories, result] = await Promise.all([
    getActiveCategories(),
    getProducts({
      q: params.q,
      categorySlug: params.category,
      minPrice: params.min,
      maxPrice: params.max,
      sort: params.sort,
      page: params.page,
    }),
  ]);

  // Trang danh mục: category nằm trong path, không đưa vào query string
  const hrefParams: ListingParams = basePath.startsWith("/danh-muc/") ? { ...params, category: undefined } : params;
  const filterCategories = categories.map((c) => ({ name: c.name, slug: c.slug, count: c._count.products }));

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <ProductFilters categories={filterCategories} params={params} basePath={basePath} />

      <div className="min-w-0">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted" aria-live="polite">
            <span className="font-semibold text-foreground">{result.total}</span> sản phẩm
          </p>
          <SortSelect params={hrefParams} basePath={basePath} />
        </div>
        <div className="mb-5 empty:hidden">
          <ActiveFilterChips params={hrefParams} basePath={basePath} />
        </div>

        {result.items.length > 0 ? (
          <>
            <ProductGrid products={result.items} className="lg:grid-cols-3" priorityCount={3} />
            <Pagination
              page={result.page}
              totalPages={result.totalPages}
              makeHref={(page) => `${basePath}${listingQuery({ ...hrefParams, page })}`}
            />
          </>
        ) : (
          <EmptyState
            title="Không tìm thấy sản phẩm phù hợp"
            description="Thử bỏ bớt bộ lọc hoặc tìm với từ khóa khác (có thể gõ không dấu, VD: sen da)."
            action={
              <ButtonLink href="/san-pham" variant="outline">
                Xem tất cả sản phẩm
              </ButtonLink>
            }
          />
        )}
      </div>
    </div>
  );
}
