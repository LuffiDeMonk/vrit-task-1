"use client"

import React from "react"
import { ProductCard } from "@/components/common/product-card"
import { EmptyState } from "@/components/common/empty-state"
import { FilterBar } from "@/app/products/_components/filter-bar"
import { SortSelector } from "@/app/products/_components/sort-selector"
import { PaginationControls } from "@/app/products/_components/pagination-controls"
import { useProductFilters } from "@/hooks/use-product-filters"
import { ITEMS_PER_PAGE } from "@/lib/constants"
import type { Category, Product } from "@/types/product"

interface ProductGridProps {
  products: Product[]
  categories: Category[]
}

export function ProductGrid({ products, categories }: ProductGridProps) {
  const {
    currentCategory,
    currentSearch,
    currentMinPrice,
    currentMaxPrice,
    minPossiblePrice,
    maxPossiblePrice,
    currentPage,
    totalPages,
    totalItems,
    activeFilterCount,
    paginatedProducts,
    setCategory,
    setSearch,
    setPriceRange,
    setPage,
    resetFilters,
  } = useProductFilters({ products })

  return (
    <div>
      <FilterBar
        categories={categories}
        currentCategory={currentCategory}
        currentSearch={currentSearch}
        currentMinPrice={currentMinPrice}
        currentMaxPrice={currentMaxPrice}
        minPossiblePrice={minPossiblePrice}
        maxPossiblePrice={maxPossiblePrice}
        activeFilterCount={activeFilterCount}
        onCategoryChange={setCategory}
        onSearchChange={setSearch}
        onPriceRangeChange={setPriceRange}
        onResetFilters={resetFilters}
      />

      <div className="mb-4 flex items-center justify-between gap-4 border-b border-border/40 pb-2">
        <div className="text-xs text-muted-foreground">
          Found{" "}
          <span className="font-semibold text-foreground">{totalItems}</span>{" "}
          {totalItems === 1 ? "product" : "products"}
          {currentCategory !== "all" && (
            <span>
              {" "}
              in{" "}
              <strong className="text-foreground capitalize">
                {currentCategory}
              </strong>
            </span>
          )}
        </div>

        <SortSelector />
      </div>

      {paginatedProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {paginatedProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                priority={index < 4}
              />
            ))}
          </div>

          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setPage}
          />
        </>
      ) : (
        <EmptyState
          title="No matching products"
          description="Try relaxing your filters, checking for spelling errors in your search, or resetting all filters."
          actionLabel="Reset all filters"
          onAction={resetFilters}
        />
      )}
    </div>
  )
}
