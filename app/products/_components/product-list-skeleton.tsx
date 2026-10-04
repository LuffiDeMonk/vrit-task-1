import { Skeleton } from "@/components/ui/skeleton"

export function ProductListSkeleton() {
  return (
    <div className="w-full">
      {/* 1. Header Search Bar & Results Banner (matches AmazonResultsHeader) */}
      <div className="mb-4 flex flex-col gap-3">
        {/* Search Input Row + Mobile Drawer Trigger */}
        <div className="flex items-center gap-2">
          <div className="flex h-10 flex-1 items-center rounded-md border border-border/60 bg-muted/20 px-3">
            <Skeleton className="size-4 shrink-0 rounded-full" />
            <Skeleton className="ml-2.5 h-3.5 w-60 max-w-[60%]" />
          </div>
          <Skeleton className="h-10 w-22 rounded-md md:hidden" />
        </div>

        {/* Results Count Banner + View Mode + Sort */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border/60 bg-muted/20 px-3.5 py-2.5 shadow-xs">
          <Skeleton className="h-4 w-40" />

          <div className="flex items-center gap-2">
            {/* View Mode icons */}
            <div className="flex items-center rounded-md border border-border/80 bg-background p-0.5 shadow-2xs">
              <Skeleton className="size-6 rounded-sm" />
              <Skeleton className="ml-0.5 size-6 rounded-sm" />
            </div>
            {/* Sort selector dropdown */}
            <Skeleton className="h-8 w-36 rounded-md" />
          </div>
        </div>
      </div>

      {/* 2. Main Layout: Left Sidebar + Right Products Area */}
      <div className="flex items-start gap-5">
        {/* Left: Desktop Sidebar Skeleton (matches AmazonSidebar) */}
        <aside className="hidden w-56 shrink-0 md:block lg:w-64">
          <div className="sticky top-20 flex flex-col gap-5 rounded-xl border border-border bg-card p-4 shadow-xs">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <div className="flex items-center gap-1.5">
                <Skeleton className="size-4 rounded-sm" />
                <Skeleton className="h-4 w-14" />
              </div>
            </div>

            {/* Apply Filters Button */}
            <Skeleton className="h-8 w-full rounded-md" />

            {/* Categories */}
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3 w-20" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-7 w-full rounded-md" />
                <Skeleton className="h-7 w-full rounded-md" />
                <Skeleton className="h-7 w-full rounded-md" />
                <Skeleton className="h-7 w-full rounded-md" />
                <Skeleton className="h-7 w-full rounded-md" />
              </div>
            </div>

            {/* Price Range */}
            <div className="flex flex-col gap-2 border-t border-border/50 pt-3">
              <Skeleton className="h-3 w-24" />
              <div className="flex items-center gap-1.5 pt-1">
                <Skeleton className="h-8 flex-1 rounded-md" />
                <span className="text-xs text-muted-foreground/40">to</span>
                <Skeleton className="h-8 flex-1 rounded-md" />
                <Skeleton className="h-8 w-9 rounded-md" />
              </div>
            </div>
          </div>
        </aside>

        {/* Right: Products Area */}
        <div className="min-w-0 flex-1">
          {/* Product Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-4 shadow-xs"
              >
                <div>
                  {/* Product Image Frame */}
                  <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-muted/30 p-4">
                    <Skeleton className="size-3/4 rounded-md" />
                  </div>

                  {/* Content */}
                  <div className="mt-3 flex flex-col gap-2">
                    {/* Category & Rating */}
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-20" />
                    </div>

                    {/* Title lines */}
                    <div className="space-y-1.5 pt-0.5">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>

                    {/* Price */}
                    <div className="mt-1">
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <div className="mt-4 pt-1">
                  <Skeleton className="h-9 w-full rounded-md" />
                </div>
              </div>
            ))}
          </div>

          {/* Pagination skeleton */}
          <div className="mt-8 flex justify-center">
            <Skeleton className="h-9 w-64 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  )
}
