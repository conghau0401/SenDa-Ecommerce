import { ProductGridSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container-page py-6 sm:py-10">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="mt-6 h-10 w-72" />
      <Skeleton className="mt-3 mb-8 h-4 w-96 max-w-full" />
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <Skeleton className="hidden h-[480px] rounded-card lg:block" />
        <div>
          <div className="mb-5 flex justify-between">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-10 w-44 rounded-full" />
          </div>
          <ProductGridSkeleton count={9} />
        </div>
      </div>
    </div>
  );
}
