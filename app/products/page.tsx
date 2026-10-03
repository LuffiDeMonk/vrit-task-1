import React from "react"
import { getProducts, getCategories } from "@/lib/api/products"
import { ProductGrid } from "@/app/products/_components/product-grid"
import type { SortOrder } from "@/types/product"

interface ProductsPageProps {
  searchParams: Promise<{
    sort?: string
    category?: string
    search?: string
    minPrice?: string
    maxPrice?: string
    page?: string
  }>
}

export const metadata = {
  title: "All Products | FakeStore Direct",
  description:
    "Explore our collection of electronics, jewelery, men's and women's clothing with real-time filters and server-side performance.",
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const resolvedSearchParams = await searchParams
  const sortParam = resolvedSearchParams.sort as SortOrder | undefined

  const [products, categories] = await Promise.all([
    getProducts(sortParam),
    getCategories(),
  ])

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Products Catalog
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse our catalog with instant category filtering, price ranges,
          search, and server-side sorting.
        </p>
      </div>

      <ProductGrid products={products} categories={categories} />
    </div>
  )
}
