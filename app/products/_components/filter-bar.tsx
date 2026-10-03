"use client"

import React, { useState, useEffect } from "react"
import { Search, X, Filter, RotateCcw } from "lucide-react"
import { Input } from "@/components/shared/input"
import { Button } from "@/components/shared/button"
import { useDebounce } from "@/hooks/use-debounce"
import type { Category } from "@/types/product"

interface FilterBarProps {
  categories: Category[]
  currentCategory: string
  currentSearch: string
  currentMinPrice: number
  currentMaxPrice: number
  minPossiblePrice: number
  maxPossiblePrice: number
  activeFilterCount: number
  onCategoryChange: (category: string) => void
  onSearchChange: (search: string) => void
  onPriceRangeChange: (min: number, max: number) => void
  onResetFilters: () => void
}

export function FilterBar({
  categories,
  currentCategory,
  currentSearch,
  currentMinPrice,
  currentMaxPrice,
  minPossiblePrice,
  maxPossiblePrice,
  activeFilterCount,
  onCategoryChange,
  onSearchChange,
  onPriceRangeChange,
  onResetFilters,
}: FilterBarProps) {
  const [prevSearch, setPrevSearch] = useState(currentSearch)
  const [localSearch, setLocalSearch] = useState(currentSearch)
  if (prevSearch !== currentSearch) {
    setPrevSearch(currentSearch)
    setLocalSearch(currentSearch)
  }

  const debouncedSearch = useDebounce(localSearch, 300)

  const [prevMin, setPrevMin] = useState(currentMinPrice)
  const [prevMax, setPrevMax] = useState(currentMaxPrice)
  const [localMin, setLocalMin] = useState<string>(
    currentMinPrice === minPossiblePrice ? "" : String(currentMinPrice)
  )
  const [localMax, setLocalMax] = useState<string>(
    currentMaxPrice === maxPossiblePrice ? "" : String(currentMaxPrice)
  )

  if (prevMin !== currentMinPrice || prevMax !== currentMaxPrice) {
    setPrevMin(currentMinPrice)
    setPrevMax(currentMaxPrice)
    setLocalMin(
      currentMinPrice === minPossiblePrice ? "" : String(currentMinPrice)
    )
    setLocalMax(
      currentMaxPrice === maxPossiblePrice ? "" : String(currentMaxPrice)
    )
  }

  useEffect(() => {
    if (debouncedSearch !== currentSearch) {
      onSearchChange(debouncedSearch)
    }
  }, [debouncedSearch, currentSearch, onSearchChange])

  const handleApplyPrice = () => {
    const min = localMin ? parseFloat(localMin) : minPossiblePrice
    const max = localMax ? parseFloat(localMax) : maxPossiblePrice
    if (!isNaN(min) && !isNaN(max) && min <= max) {
      onPriceRangeChange(min, max)
    }
  }

  const handleClearSearch = () => {
    setLocalSearch("")
    onSearchChange("")
  }

  return (
    <div className="mb-6 flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-xs sm:p-5">
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search products by title or description..."
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
          />
        </div>

        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="shrink-0 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="size-3.5" />
            Reset Filters ({activeFilterCount})
          </Button>
        )}
      </div>

      <div>
        <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          <Filter className="size-3" />
          <span>Categories</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <Button
            key="category-all"
            type="button"
            variant={currentCategory === "all" ? "default" : "outline"}
            size="xs"
            onClick={() => onCategoryChange("all")}
            className="h-7 rounded-full px-3 text-xs capitalize"
          >
            All Categories
          </Button>
          {categories.map((category) => {
            const isSelected =
              currentCategory.toLowerCase() === category.toLowerCase()
            return (
              <Button
                key={category}
                type="button"
                variant={isSelected ? "default" : "outline"}
                size="xs"
                onClick={() => onCategoryChange(category)}
                className="h-7 rounded-full px-3 text-xs capitalize"
              >
                {category}
              </Button>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col justify-between gap-3 border-t border-border/50 pt-3 text-xs sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">Price Range:</span>
          <div className="flex items-center gap-1.5">
            <div className="w-24">
              <Input
                type="number"
                step="any"
                min={minPossiblePrice}
                max={maxPossiblePrice}
                placeholder={`${minPossiblePrice}`}
                value={localMin}
                onChange={(e) => setLocalMin(e.target.value)}
                onWheel={(e) => e.currentTarget.blur()}
                onKeyDown={(e) => e.key === "Enter" && handleApplyPrice()}
                startIcon={
                  <span className="text-xs text-muted-foreground">$</span>
                }
                className="h-8 text-xs"
              />
            </div>
            <span className="text-muted-foreground">to</span>
            <div className="w-24">
              <Input
                type="number"
                step="any"
                min={minPossiblePrice}
                max={maxPossiblePrice}
                placeholder={`${maxPossiblePrice}`}
                value={localMax}
                onChange={(e) => setLocalMax(e.target.value)}
                onWheel={(e) => e.currentTarget.blur()}
                onKeyDown={(e) => e.key === "Enter" && handleApplyPrice()}
                startIcon={
                  <span className="text-xs text-muted-foreground">$</span>
                }
                className="h-8 text-xs"
              />
            </div>
            <Button
              variant="secondary"
              size="xs"
              onClick={handleApplyPrice}
              className="h-8 px-3 text-xs"
            >
              Apply
            </Button>
          </div>
        </div>

        <span className="text-[11px] text-muted-foreground">
          Catalog range: ${minPossiblePrice} – ${maxPossiblePrice}
        </span>
      </div>
    </div>
  )
}
