import { ProductListSkeleton } from "@/app/products/_components/product-list-skeleton"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto w-full px-3 py-3 sm:px-6 sm:py-5">
      {/* Breadcrumb Skeleton */}
      <div className="mb-3 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Skeleton className="h-3.5 w-10" />
        <span className="text-muted-foreground/40">/</span>
        <Skeleton className="h-3.5 w-20" />
      </div>

      <ProductListSkeleton />
    </div>
  )
}
