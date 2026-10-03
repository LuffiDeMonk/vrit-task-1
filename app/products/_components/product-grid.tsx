"use client"

import React, { useState } from "react"
import { ProductCard } from "@/components/common/product-card"
import { EmptyState } from "@/components/common/empty-state"
import { AmazonSidebar } from "@/app/products/_components/amazon-sidebar"
import { AmazonFilterDrawer } from "@/app/products/_components/amazon-filter-drawer"
import { AmazonResultsHeader } from "@/app/products/_components/amazon-results-header"
import { PaginationControls } from "@/app/products/_components/pagination-controls"
import { useProductFilters } from "@/hooks/use-product-filters"
import { ITEMS_PER_PAGE } from "@/lib/constants"
import type { Category, Product } from "@/types/product"

interface ProductGridProps {
  products: Product[]
  categories: Category[]
}

export function ProductGrid({ products, categories }: ProductGridProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false)

  const {
    currentCategory,
    currentSearch,
    currentMinPrice,
    currentMaxPrice,
    currentMinRating,
    currentSort,
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
    setMinRating,
    applyFilters,
    setSort,
    setPage,
    resetFilters,
  } = useProductFilters({ products })

  const startIndex = totalItems > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0
  const endIndex = Math.min(currentPage * ITEMS_PER_PAGE, totalItems)

  return (
    <div>
      <AmazonResultsHeader
        totalItems={totalItems}
        startIndex={startIndex}
        endIndex={endIndex}
        currentCategory={currentCategory}
        currentSearch={currentSearch}
        currentMinPrice={currentMinPrice}
        currentMaxPrice={currentMaxPrice}
        currentMinRating={currentMinRating}
        minPossiblePrice={minPossiblePrice}
        maxPossiblePrice={maxPossiblePrice}
        activeFilterCount={activeFilterCount}
        currentSort={currentSort}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onSearchChange={setSearch}
        onCategoryChange={setCategory}
        onPriceRangeChange={setPriceRange}
        onMinRatingChange={setMinRating}
        onSortChange={setSort}
        onResetFilters={resetFilters}
        onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
      />

      <div className="flex items-start gap-5">
        {/* Left: Desktop Amazon Sidebar */}
        <div className="hidden md:block">
          <AmazonSidebar
            categories={categories}
            currentCategory={currentCategory}
            currentMinPrice={currentMinPrice}
            currentMaxPrice={currentMaxPrice}
            minPossiblePrice={minPossiblePrice}
            maxPossiblePrice={maxPossiblePrice}
            activeFilterCount={activeFilterCount}
            onApplyFilters={applyFilters}
            onResetFilters={resetFilters}
          />
        </div>

        {/* Right: Products Area */}
        <div className="min-w-0 flex-1">
          {paginatedProducts.length > 0 ? (
            <>
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {paginatedProducts.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      priority={index < 4}
                      layout="grid"
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {paginatedProducts.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      priority={index < 4}
                      layout="list"
                    />
                  ))}
                </div>
              )}

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
              description="Try adjusting your filters, checking for spelling errors, or resetting all filters."
              actionLabel="Reset all filters"
              onAction={resetFilters}
            />
          )}
        </div>
      </div>

      {/* Small Screens Filters Bottom Sheet Drawer */}
      <AmazonFilterDrawer
        open={isMobileDrawerOpen}
        onClose={() => setIsMobileDrawerOpen(false)}
        categories={categories}
        currentCategory={currentCategory}
        currentMinPrice={currentMinPrice}
        currentMaxPrice={currentMaxPrice}
        minPossiblePrice={minPossiblePrice}
        maxPossiblePrice={maxPossiblePrice}
        activeFilterCount={activeFilterCount}
        onApplyFilters={applyFilters}
        onResetFilters={resetFilters}
      />
    </div>
  )
}
