import React from "react"
import { Skeleton } from "@/components/ui/skeleton"

export function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6">
      <Skeleton className="mb-6 h-8 w-28 rounded-md" />

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
        <div className="flex aspect-square w-full items-center justify-center rounded-2xl border border-border bg-card p-8">
          <Skeleton className="size-3/4 rounded-xl" />
        </div>

        <div className="flex flex-col space-y-4">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-28 rounded-md" />
          <div className="space-y-2 border-t border-border pt-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="pt-6">
            <Skeleton className="h-11 w-44 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}
