"use client"

import { useState } from "react"
import { RotateCcw, Filter, Check } from "lucide-react"
import { Button } from "@/components/shared/button"
import { Input } from "@/components/shared/input"
import { cn } from "@/lib/utils"
import type { Category } from "@/types/product"

interface AmazonSidebarProps {
  categories: Category[]
  currentCategory: string
  currentMinPrice: number
  currentMaxPrice: number
  minPossiblePrice: number
  maxPossiblePrice: number
  activeFilterCount: number
  onApplyFilters: (filters: {
    category: string
    minPrice: number
    maxPrice: number
  }) => void
  onResetFilters: () => void
}

export function AmazonSidebar({
  categories,
  currentCategory,
  currentMinPrice,
  currentMaxPrice,
  minPossiblePrice,
  maxPossiblePrice,
  activeFilterCount,
  onApplyFilters,
  onResetFilters,
}: AmazonSidebarProps) {
  // Staged state for desktop
  const [stagedCategory, setStagedCategory] = useState<string>(currentCategory)
  const [prevCategory, setPrevCategory] = useState<string>(currentCategory)
  if (prevCategory !== currentCategory) {
    setPrevCategory(currentCategory)
    setStagedCategory(currentCategory)
  }

  const [localMin, setLocalMin] = useState<string>(
    currentMinPrice === minPossiblePrice ? "" : String(currentMinPrice)
  )
  const [localMax, setLocalMax] = useState<string>(
    currentMaxPrice === maxPossiblePrice ? "" : String(currentMaxPrice)
  )
  const [prevMinPrice, setPrevMinPrice] = useState<number>(currentMinPrice)
  const [prevMaxPrice, setPrevMaxPrice] = useState<number>(currentMaxPrice)
  if (
    prevMinPrice !== currentMinPrice ||
    prevMaxPrice !== currentMaxPrice
  ) {
    setPrevMinPrice(currentMinPrice)
    setPrevMaxPrice(currentMaxPrice)
    setLocalMin(
      currentMinPrice === minPossiblePrice ? "" : String(currentMinPrice)
    )
    setLocalMax(
      currentMaxPrice === maxPossiblePrice ? "" : String(currentMaxPrice)
    )
  }

  // Parse staged price numbers
  const parsedMin = localMin.trim() ? parseFloat(localMin) : minPossiblePrice
  const parsedMax = localMax.trim() ? parseFloat(localMax) : maxPossiblePrice
  const validMin = !isNaN(parsedMin) ? parsedMin : minPossiblePrice
  const validMax = !isNaN(parsedMax) ? parsedMax : maxPossiblePrice
  const clampedMin = Math.max(
    minPossiblePrice,
    Math.min(validMin, validMax)
  )
  const clampedMax = Math.max(
    minPossiblePrice,
    Math.max(validMin, validMax)
  )

  // Pending change detection
  const hasCategoryChange =
    (stagedCategory || "all").toLowerCase() !== currentCategory.toLowerCase()
  const hasPriceChange =
    clampedMin !== currentMinPrice || clampedMax !== currentMaxPrice

  const hasPendingChanges = hasCategoryChange || hasPriceChange

  const handleApply = () => {
    onApplyFilters({
      category: stagedCategory || "all",
      minPrice: clampedMin,
      maxPrice: clampedMax,
    })
  }

  const handleReset = () => {
    setStagedCategory("all")
    setLocalMin("")
    setLocalMax("")
    onResetFilters()
  }

  return (
    <aside className="w-56 shrink-0 lg:w-64">
      <div className="sticky top-20 flex flex-col gap-5 rounded-xl border border-border bg-card p-4 shadow-xs">
        {/* Header / Staged Apply Action */}
        <div className="flex items-center justify-between border-b border-border/50 pb-3">
          <div className="flex items-center gap-1.5 font-bold text-foreground">
            <Filter className="size-4 text-primary" />
            <span className="text-sm">Filters</span>
          </div>

          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={handleReset}
              className="flex cursor-pointer items-center gap-1 text-xs text-muted-foreground hover:text-foreground hover:underline"
            >
              <RotateCcw className="size-3" />
              <span>Clear all</span>
            </button>
          )}
        </div>

        {/* Apply Filters Trigger on Desktop */}
        <Button
          type="button"
          onClick={handleApply}
          variant={hasPendingChanges ? "default" : "secondary"}
          size="sm"
          className="w-full cursor-pointer font-semibold shadow-xs transition-all"
        >
          <Filter className="size-3.5" />
          <span>Apply Filters</span>
          {hasPendingChanges && (
            <span className="size-2 animate-ping rounded-full bg-primary-foreground" />
          )}
        </Button>

        {/* 1. Categories */}
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-bold tracking-wider text-foreground uppercase">
            Categories
          </h4>
          <ul className="flex flex-col gap-1 text-xs">
            <li>
              <button
                type="button"
                onClick={() => setStagedCategory("all")}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-left transition-colors hover:bg-muted",
                  stagedCategory === "all" || !stagedCategory
                    ? "bg-primary/10 font-bold text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span>All Categories</span>
                {(stagedCategory === "all" || !stagedCategory) && (
                  <Check className="size-3.5 text-primary" />
                )}
              </button>
            </li>
            {categories.map((category) => {
              const isSelected =
                stagedCategory.toLowerCase() === category.toLowerCase()
              return (
                <li key={category}>
                  <button
                    type="button"
                    onClick={() => setStagedCategory(category)}
                    className={cn(
                      "flex w-full cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-left capitalize transition-colors hover:bg-muted",
                      isSelected
                        ? "bg-primary/10 font-bold text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span>{category}</span>
                    {isSelected && (
                      <Check className="size-3.5 text-primary" />
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        {/* 2. Price Range */}
        <div className="flex flex-col gap-2 border-t border-border/50 pt-3">
          <h4 className="text-xs font-bold tracking-wider text-foreground uppercase">
            Price Range
          </h4>

          {/* Min & Max inputs with Go button */}
          <div className="flex items-center gap-1.5 pt-1">
            <div className="min-w-0 flex-1">
              <Input
                id="sidebar-min-price"
                type="number"
                step="any"
                min={minPossiblePrice}
                max={maxPossiblePrice}
                placeholder="Min"
                value={localMin}
                onChange={(e) => setLocalMin(e.target.value)}
                onWheel={(e) => e.currentTarget.blur()}
                onKeyDown={(e) => e.key === "Enter" && handleApply()}
                startIcon={
                  <span className="text-xs text-muted-foreground">$</span>
                }
                className="h-8 text-xs"
              />
            </div>
            <span className="text-xs text-muted-foreground">to</span>
            <div className="min-w-0 flex-1">
              <Input
                id="sidebar-max-price"
                type="number"
                step="any"
                min={minPossiblePrice}
                max={maxPossiblePrice}
                placeholder="Max"
                value={localMax}
                onChange={(e) => setLocalMax(e.target.value)}
                onWheel={(e) => e.currentTarget.blur()}
                onKeyDown={(e) => e.key === "Enter" && handleApply()}
                startIcon={
                  <span className="text-xs text-muted-foreground">$</span>
                }
                className="h-8 text-xs"
              />
            </div>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={handleApply}
              className="h-8 cursor-pointer px-2.5 text-xs font-semibold shadow-xs hover:border-foreground"
            >
              Go
            </Button>
          </div>
        </div>
      </div>
    </aside>
  )
}
