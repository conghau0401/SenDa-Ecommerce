import { discountPercent, formatVND } from "@/lib/format";
import { cn } from "@/lib/utils";

export function Price({
  price,
  salePrice,
  size = "md",
  className,
}: {
  price: number;
  salePrice?: number | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const onSale = salePrice != null && salePrice < price;
  const main = onSale ? salePrice : price;
  return (
    <div className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-0.5", className)}>
      <span
        className={cn(
          "font-bold tracking-tight",
          onSale ? "text-sale" : "text-leaf-800",
          size === "sm" && "text-[15px]",
          size === "md" && "text-lg",
          size === "lg" && "text-2xl sm:text-3xl",
        )}
      >
        {formatVND(main)}
      </span>
      {onSale && (
        <>
          <span className={cn("text-muted line-through", size === "lg" ? "text-base" : "text-xs sm:text-sm")}>
            <span className="sr-only">Giá gốc </span>
            {formatVND(price)}
          </span>
          {size === "lg" && (
            <span className="rounded-full bg-sale/10 px-2 py-0.5 text-sm font-semibold text-sale">
              -{discountPercent(price, salePrice)}%
            </span>
          )}
        </>
      )}
    </div>
  );
}
