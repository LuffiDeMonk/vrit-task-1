import React from "react"
import { Skeleton } from "@/components/ui/skeleton"

export function ProductListSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-4 rounded-xl border border-border bg-card p-5">
        <Skeleton className="h-9 w-full rounded-md" />
        <div className="flex gap-2">
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-7 w-20 rounded-full" />
          <Skeleton className="h-7 w-28 rounded-full" />
          <Skeleton className="h-7 w-24 rounded-full" />
        </div>
      </div>

      <div className="flex items-center justify-between border-b border-border/40 pb-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-28 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col space-y-3 rounded-xl border border-border bg-card p-4"
          >
            <Skeleton className="aspect-square w-full rounded-lg" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex items-center justify-between border-t border-border/60 pt-3">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
