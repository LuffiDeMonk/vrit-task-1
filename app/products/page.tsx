import React from "react"
import { getProducts, getCategories } from "@/lib/api/products"
import { ProductGrid } from "@/app/products/_components/product-grid"
import { Breadcrumb } from "@/components/shared/breadcrumb"
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

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "All Products", href: "/products" },
    ...(resolvedSearchParams.category && resolvedSearchParams.category !== "all"
      ? [
          {
            label:
              resolvedSearchParams.category.charAt(0).toUpperCase() +
              resolvedSearchParams.category.slice(1),
          },
        ]
      : []),
  ]

  return (
    <div className="container mx-auto w-full px-3 py-3 sm:px-6 sm:py-5">
      <div className="mb-3">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      <ProductGrid products={products} categories={categories} />
    </div>
  )
}
