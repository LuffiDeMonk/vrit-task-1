"use client"

import React, { useState, useEffect } from "react"
import {
  Search,
  X,
  SlidersHorizontal,
  LayoutGrid,
  List as ListIcon,
  RotateCcw,
} from "lucide-react"
import { Input } from "@/components/shared/input"
import { Button } from "@/components/shared/button"
import { SortSelector } from "@/app/products/_components/sort-selector"
import { useDebounce } from "@/hooks/use-debounce"
import { cn } from "@/lib/utils"

interface AmazonResultsHeaderProps {
  totalItems: number
  startIndex: number
  endIndex: number
  currentCategory: string
  currentSearch: string
  currentMinPrice: number
  currentMaxPrice: number
  currentMinRating: number
  minPossiblePrice: number
  maxPossiblePrice: number
  activeFilterCount: number
  currentSort: string
  viewMode: "grid" | "list"
  onViewModeChange: (mode: "grid" | "list") => void
  onSearchChange: (search: string) => void
  onCategoryChange: (category: string) => void
  onPriceRangeChange: (min: number, max: number) => void
  onMinRatingChange: (rating: number) => void
  onSortChange: (sort: string) => void
  onResetFilters: () => void
  onOpenMobileDrawer: () => void
}

export function AmazonResultsHeader({
  totalItems,
  startIndex,
  endIndex,
  currentCategory,
  currentSearch,
  currentMinPrice,
  currentMaxPrice,
  currentMinRating,
  minPossiblePrice,
  maxPossiblePrice,
  activeFilterCount,
  currentSort,
  viewMode,
  onViewModeChange,
  onSearchChange,
  onCategoryChange,
  onPriceRangeChange,
  onMinRatingChange,
  onSortChange,
  onResetFilters,
  onOpenMobileDrawer,
}: AmazonResultsHeaderProps) {
  const [localSearch, setLocalSearch] = useState(currentSearch)
  const [prevSearch, setPrevSearch] = useState(currentSearch)

  if (prevSearch !== currentSearch) {
    setPrevSearch(currentSearch)
    setLocalSearch(currentSearch)
  }

  const debouncedSearch = useDebounce(localSearch, 300)

  useEffect(() => {
    if (debouncedSearch !== currentSearch) {
      onSearchChange(debouncedSearch)
    }
  }, [debouncedSearch, currentSearch, onSearchChange])

  const handleClearSearch = () => {
    setLocalSearch("")
    onSearchChange("")
  }

  const isPriceFiltered =
    currentMinPrice !== minPossiblePrice ||
    currentMaxPrice !== maxPossiblePrice

  return (
    <div className="mb-4 flex flex-col gap-3">
      {/* Top Search Input & Mobile Drawer Trigger */}
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search products by title, keyword, or category..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            startIcon={<Search className="size-4 text-muted-foreground" />}
            endIcon={
              localSearch ? (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="cursor-pointer rounded-full p-0.5 text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="size-3.5" />
                </button>
              ) : null
            }
            preventSqlInjection
            className="h-10 text-sm"
          />
        </div>

        {/* Small Screen Filters Trigger Button */}
        <Button
          type="button"
          variant={activeFilterCount > 0 ? "default" : "outline"}
          size="sm"
          onClick={onOpenMobileDrawer}
          className="relative h-10 shrink-0 cursor-pointer gap-1.5 px-3 md:hidden"
          aria-label="Open filter options drawer"
        >
          <SlidersHorizontal className="size-4" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-background text-[11px] font-bold text-foreground">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      {/* Amazon Results Count Banner + View Mode + Sort */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border/60 bg-muted/20 px-3.5 py-2.5 shadow-xs">
        {/* Left: Amazon Results Count Summary */}
        <div className="text-xs text-muted-foreground">
          {totalItems > 0 ? (
            <span>
              {startIndex}-{endIndex} of{" "}
              <strong className="font-semibold text-foreground">
                {totalItems}
              </strong>{" "}
              {totalItems === 1 ? "result" : "results"}
            </span>
          ) : (
            <span>0 results</span>
          )}

          {currentCategory !== "all" && currentCategory && (
            <span>
              {" "}
              for{" "}
              <strong className="font-bold text-[#C7511F] capitalize dark:text-amber-500">
                &ldquo;{currentCategory}&rdquo;
              </strong>
            </span>
          )}

          {currentSearch.trim() && (
            <span>
              {" "}
              for{" "}
              <strong className="font-bold text-[#C7511F] dark:text-amber-500">
                &ldquo;{currentSearch}&rdquo;
              </strong>
            </span>
          )}
        </div>

        {/* Right: View Toggle + Amazon Sort */}
        <div className="flex items-center gap-2">
          {/* View Mode Toggle: Grid vs List */}
          <div className="flex items-center rounded-md border border-border/80 bg-background p-0.5 shadow-2xs">
            <button
              type="button"
              onClick={() => onViewModeChange("grid")}
              className={cn(
                "cursor-pointer rounded-sm p-1 text-muted-foreground transition-colors hover:text-foreground",
                viewMode === "grid" &&
                  "bg-muted text-foreground font-semibold shadow-2xs"
              )}
              aria-label="Grid view"
              title="Grid view"
            >
              <LayoutGrid className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange("list")}
              className={cn(
                "cursor-pointer rounded-sm p-1 text-muted-foreground transition-colors hover:text-foreground",
                viewMode === "list" &&
                  "bg-muted text-foreground font-semibold shadow-2xs"
              )}
              aria-label="List view"
              title="List view"
            >
              <ListIcon className="size-4" />
            </button>
          </div>

          {/* Sort Selector */}
          <SortSelector
            value={currentSort || "default"}
            onValueChange={onSortChange}
          />
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="text-xs font-semibold text-muted-foreground">
            Active filters:
          </span>

          {currentCategory !== "all" && currentCategory && (
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium text-foreground shadow-2xs">
              <span className="capitalize">{currentCategory}</span>
              <button
                type="button"
                onClick={() => onCategoryChange("all")}
                className="cursor-pointer text-muted-foreground hover:text-foreground"
                aria-label="Remove category filter"
              >
                <X className="size-3" />
              </button>
            </span>
          )}

          {currentMinRating > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium text-foreground shadow-2xs">
              <span>{currentMinRating}★ & Up</span>
              <button
                type="button"
                onClick={() => onMinRatingChange(0)}
                className="cursor-pointer text-muted-foreground hover:text-foreground"
                aria-label="Remove rating filter"
              >
                <X className="size-3" />
              </button>
            </span>
          )}

          {isPriceFiltered && (
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium text-foreground shadow-2xs">
              <span>
                ${currentMinPrice} - ${currentMaxPrice}
              </span>
              <button
                type="button"
                onClick={() =>
                  onPriceRangeChange(minPossiblePrice, maxPossiblePrice)
                }
                className="cursor-pointer text-muted-foreground hover:text-foreground"
                aria-label="Remove price filter"
              >
                <X className="size-3" />
              </button>
            </span>
          )}

          {currentSearch.trim() && (
            <span className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium text-foreground shadow-2xs">
              <span>&ldquo;{currentSearch}&rdquo;</span>
              <button
                type="button"
                onClick={handleClearSearch}
                className="cursor-pointer text-muted-foreground hover:text-foreground"
                aria-label="Clear search filter"
              >
                <X className="size-3" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={onResetFilters}
            className="ml-1 inline-flex cursor-pointer items-center gap-1 text-xs text-[#007185] hover:text-[#C7511F] hover:underline dark:text-sky-400"
          >
            <RotateCcw className="size-3" />
            <span>Clear all</span>
          </button>
        </div>
      )}
    </div>
  )
}
