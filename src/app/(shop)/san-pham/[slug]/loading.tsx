import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container-page py-6 sm:py-10" role="status" aria-label="Đang tải sản phẩm">
      <Skeleton className="h-4 w-64" />
      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-14">
        <div className="space-y-3">
          <Skeleton className="aspect-square rounded-[1.5rem]" />
          <div className="flex gap-2.5">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="size-20 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="space-y-4 lg:py-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-4/5" />
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-12 w-full rounded-full" />
        </div>
      </div>
    </div>
  );
}
