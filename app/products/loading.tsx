import React from "react"
import { ProductListSkeleton } from "@/app/products/_components/product-list-skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6">
      <div className="mb-6 space-y-1">
        <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-72 animate-pulse rounded-md bg-muted" />
      </div>
      <ProductListSkeleton />
    </div>
  )
}
