"use client"

import { useState, useEffect } from "react"
import {
  Search,
  X,
  Filter,
  RotateCcw,
  SlidersHorizontal,
  Check,
} from "lucide-react"
import { Input } from "@/components/shared/input"
import { Button } from "@/components/shared/button"
import { Drawer } from "@/components/shared/drawer"
import { useDebounce } from "@/hooks/use-debounce"
import { cn } from "@/lib/utils"
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
  onApplyFilters?: (filters: {
    category: string
    minPrice: number
    maxPrice: number
  }) => void
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
  onApplyFilters,
  onResetFilters,
}: FilterBarProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Desktop staged category (applied only when clicking "Apply Filters")
  const [stagedCategory, setStagedCategory] = useState<string>(currentCategory)
  const [prevCategory, setPrevCategory] = useState<string>(currentCategory)

  if (prevCategory !== currentCategory) {
    setPrevCategory(currentCategory)
    setStagedCategory(currentCategory)
  }

  const [prevSearch, setPrevSearch] = useState(currentSearch)
  const [localSearch, setLocalSearch] = useState(currentSearch)
  if (prevSearch !== currentSearch) {
    setPrevSearch(currentSearch)
    setLocalSearch(currentSearch)
  }

  const debouncedSearch = useDebounce(localSearch, 300)

  // Desktop price filter inputs
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

  // Drawer staged filter states (only applied when user clicks "View Results")
  const [drawerCategory, setDrawerCategory] = useState<string>(currentCategory)
  const [drawerMin, setDrawerMin] = useState<string>(
    currentMinPrice === minPossiblePrice ? "" : String(currentMinPrice)
  )
  const [drawerMax, setDrawerMax] = useState<string>(
    currentMaxPrice === maxPossiblePrice ? "" : String(currentMaxPrice)
  )

  const handleOpenDrawer = () => {
    setDrawerCategory(stagedCategory)
    setDrawerMin(
      currentMinPrice === minPossiblePrice ? "" : String(currentMinPrice)
    )
    setDrawerMax(
      currentMaxPrice === maxPossiblePrice ? "" : String(currentMaxPrice)
    )
    setIsDrawerOpen(true)
  }

  const handleCloseDrawer = () => {
    setDrawerCategory(stagedCategory)
    setDrawerMin(
      currentMinPrice === minPossiblePrice ? "" : String(currentMinPrice)
    )
    setDrawerMax(
      currentMaxPrice === maxPossiblePrice ? "" : String(currentMaxPrice)
    )
    setIsDrawerOpen(false)
  }

  const handleDrawerReset = () => {
    setDrawerCategory("all")
    setDrawerMin("")
    setDrawerMax("")
  }

  const handleApplyDrawerFilters = () => {
    const nextCategory = drawerCategory || "all"

    const minParsed = drawerMin.trim()
      ? parseFloat(drawerMin)
      : minPossiblePrice
    const maxParsed = drawerMax.trim()
      ? parseFloat(drawerMax)
      : maxPossiblePrice

    const validMin = !isNaN(minParsed) ? minParsed : minPossiblePrice
    const validMax = !isNaN(maxParsed) ? maxParsed : maxPossiblePrice

    const finalMin = Math.min(validMin, validMax)
    const finalMax = Math.max(validMin, validMax)

    const clampedMin = Math.max(minPossiblePrice, finalMin)
    const clampedMax = Math.max(minPossiblePrice, finalMax)

    if (onApplyFilters) {
      onApplyFilters({
        category: nextCategory,
        minPrice: clampedMin,
        maxPrice: clampedMax,
      })
    } else {
      if (nextCategory !== currentCategory) {
        onCategoryChange(nextCategory)
      }
      if (clampedMin !== currentMinPrice || clampedMax !== currentMaxPrice) {
        onPriceRangeChange(clampedMin, clampedMax)
      }
    }

    setStagedCategory(nextCategory)
    setLocalMin(clampedMin === minPossiblePrice ? "" : String(clampedMin))
    setLocalMax(clampedMax === maxPossiblePrice ? "" : String(clampedMax))
    setIsDrawerOpen(false)
  }

  const handleApplyDesktopFilters = () => {
    const nextCategory = stagedCategory || "all"

    const minParsed = localMin.trim() ? parseFloat(localMin) : minPossiblePrice
    const maxParsed = localMax.trim() ? parseFloat(localMax) : maxPossiblePrice

    const validMin = !isNaN(minParsed) ? minParsed : minPossiblePrice
    const validMax = !isNaN(maxParsed) ? maxParsed : maxPossiblePrice

    const finalMin = Math.min(validMin, validMax)
    const finalMax = Math.max(validMin, validMax)

    const clampedMin = Math.max(minPossiblePrice, finalMin)
    const clampedMax = Math.max(minPossiblePrice, finalMax)

    if (onApplyFilters) {
      onApplyFilters({
        category: nextCategory,
        minPrice: clampedMin,
        maxPrice: clampedMax,
      })
    } else {
      if (nextCategory !== currentCategory) {
        onCategoryChange(nextCategory)
      }
      if (clampedMin !== currentMinPrice || clampedMax !== currentMaxPrice) {
        onPriceRangeChange(clampedMin, clampedMax)
      }
    }
  }

  // Detect pending unapplied filter changes on desktop
  const parsedDesktopMin = localMin.trim()
    ? parseFloat(localMin)
    : minPossiblePrice
  const parsedDesktopMax = localMax.trim()
    ? parseFloat(localMax)
    : maxPossiblePrice
  const validDesktopMin = !isNaN(parsedDesktopMin)
    ? parsedDesktopMin
    : minPossiblePrice
  const validDesktopMax = !isNaN(parsedDesktopMax)
    ? parsedDesktopMax
    : maxPossiblePrice
  const clampedDesktopMin = Math.max(
    minPossiblePrice,
    Math.min(validDesktopMin, validDesktopMax)
  )
  const clampedDesktopMax = Math.max(
    minPossiblePrice,
    Math.max(validDesktopMin, validDesktopMax)
  )

  const hasPendingCategoryChange =
    (stagedCategory || "all").toLowerCase() !== currentCategory.toLowerCase()
  const hasPendingPriceChange =
    clampedDesktopMin !== currentMinPrice ||
    clampedDesktopMax !== currentMaxPrice
  const hasPendingDesktopChanges =
    hasPendingCategoryChange || hasPendingPriceChange

  // Calculate active filter count for the drawer in real-time
  const isDrawerCategoryFiltered =
    drawerCategory !== "all" && drawerCategory !== ""
  const parsedDrawerMin = drawerMin.trim()
    ? parseFloat(drawerMin)
    : minPossiblePrice
  const parsedDrawerMax = drawerMax.trim()
    ? parseFloat(drawerMax)
    : maxPossiblePrice
  const isDrawerPriceFiltered =
    (!isNaN(parsedDrawerMin) && parsedDrawerMin !== minPossiblePrice) ||
    (!isNaN(parsedDrawerMax) && parsedDrawerMax !== maxPossiblePrice)
  const drawerActiveFilterCount =
    (isDrawerCategoryFiltered ? 1 : 0) + (isDrawerPriceFiltered ? 1 : 0)

  useEffect(() => {
    if (debouncedSearch !== currentSearch) {
      onSearchChange(debouncedSearch)
    }
  }, [debouncedSearch, currentSearch, onSearchChange])

  const handleClearSearch = () => {
    setLocalSearch("")
    onSearchChange("")
  }

  const handleResetAll = () => {
    setStagedCategory("all")
    setLocalSearch("")
    setLocalMin("")
    setLocalMax("")
    setDrawerCategory("all")
    setDrawerMin("")
    setDrawerMax("")
    onResetFilters()
  }

  const isPriceFiltered =
    currentMinPrice !== minPossiblePrice || currentMaxPrice !== maxPossiblePrice

  return (
    <div className="mb-6 flex flex-col gap-3 rounded-xl border border-border bg-card p-3.5 shadow-xs sm:p-5">
      {/* Search Input Bar + Filter Trigger for Mobile / Reset for Desktop */}
      <div className="flex items-center gap-2 sm:gap-3">
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

        {/* Small screens Filter Drawer Button */}
        <Button
          type="button"
          variant={activeFilterCount > 0 ? "default" : "outline"}
          size="sm"
          onClick={handleOpenDrawer}
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

        {/* Desktop Reset Button */}
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetAll}
            className="hidden shrink-0 gap-1.5 text-xs text-muted-foreground hover:text-foreground md:flex"
          >
            <RotateCcw className="size-3.5" />
            Reset Filters ({activeFilterCount})
          </Button>
        )}
      </div>

      {/* Quick Active Filter Chips on Mobile */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-1 md:hidden">
          {currentCategory !== "all" && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              <span className="capitalize">{currentCategory}</span>
              <button
                type="button"
                onClick={() => {
                  setStagedCategory("all")
                  setDrawerCategory("all")
                  onCategoryChange("all")
                }}
                className="cursor-pointer hover:opacity-75"
                aria-label="Remove category filter"
              >
                <X className="size-3" />
              </button>
            </span>
          )}
          {isPriceFiltered && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              ${currentMinPrice} - ${currentMaxPrice}
              <button
                type="button"
                onClick={() =>
                  onPriceRangeChange(minPossiblePrice, maxPossiblePrice)
                }
                className="cursor-pointer hover:opacity-75"
                aria-label="Remove price filter"
              >
                <X className="size-3" />
              </button>
            </span>
          )}
          <button
            type="button"
            onClick={handleResetAll}
            className="ml-1 cursor-pointer text-xs text-muted-foreground underline hover:text-foreground"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Desktop Filters (Hidden on small screens) */}
      <div className="hidden flex-col gap-4 border-t border-border/50 pt-3 md:flex">
        {/* Categories */}
        <div>
          <div className="mb-2 flex items-center justify-between text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            <div className="flex items-center gap-1.5">
              <Filter className="size-3" />
              <span>Categories</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <Button
              key="category-all"
              type="button"
              variant={stagedCategory === "all" ? "default" : "outline"}
              size="xs"
              onClick={() => setStagedCategory("all")}
              className="h-7 cursor-pointer rounded-full px-3 text-xs capitalize"
            >
              All Categories
            </Button>
            {categories.map((category) => {
              const isSelected =
                stagedCategory.toLowerCase() === category.toLowerCase()
              return (
                <Button
                  key={category}
                  type="button"
                  variant={isSelected ? "default" : "outline"}
                  size="xs"
                  onClick={() => setStagedCategory(category)}
                  className="h-7 cursor-pointer rounded-full px-3 text-xs capitalize"
                >
                  {category}
                </Button>
              )
            })}
          </div>
        </div>

        {/* Price Range & Apply Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/50 pt-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-foreground">Price Range:</span>
            <div className="flex flex-wrap items-center gap-1.5">
              <div className="w-20 shrink-0 sm:w-24">
                <Input
                  id="desktop-filter-min-price"
                  type="number"
                  step="any"
                  min={minPossiblePrice}
                  max={maxPossiblePrice}
                  placeholder={`${minPossiblePrice}`}
                  value={localMin}
                  onChange={(e) => setLocalMin(e.target.value)}
                  onWheel={(e) => e.currentTarget.blur()}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleApplyDesktopFilters()
                  }
                  startIcon={
                    <span className="text-xs text-muted-foreground">$</span>
                  }
                  className="h-8 text-xs"
                />
              </div>
              <span className="text-muted-foreground">to</span>
              <div className="w-20 shrink-0 sm:w-24">
                <Input
                  id="desktop-filter-max-price"
                  type="number"
                  step="any"
                  min={minPossiblePrice}
                  max={maxPossiblePrice}
                  placeholder={`${maxPossiblePrice}`}
                  value={localMax}
                  onChange={(e) => setLocalMax(e.target.value)}
                  onWheel={(e) => e.currentTarget.blur()}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleApplyDesktopFilters()
                  }
                  startIcon={
                    <span className="text-xs text-muted-foreground">$</span>
                  }
                  className="h-8 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeFilterCount > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={handleResetAll}
                className="h-8 cursor-pointer gap-1.5 px-2.5 text-xs text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="size-3.5" />
                <span>Reset</span>
              </Button>
            )}
            <Button
              type="button"
              variant={hasPendingDesktopChanges ? "default" : "secondary"}
              size="xs"
              onClick={handleApplyDesktopFilters}
              className="h-8 cursor-pointer gap-1.5 px-4 text-xs font-semibold shadow-xs"
            >
              <Filter className="size-3.5" />
              <span>Apply Filters</span>
              {hasPendingDesktopChanges && (
                <span className="size-1.5 rounded-full bg-primary-foreground" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Small Screens Filters Drawer */}
      <Drawer
        open={isDrawerOpen}
        onClose={handleCloseDrawer}
        onOpenChange={(open) => {
          if (open) {
            handleOpenDrawer()
          } else {
            handleCloseDrawer()
          }
        }}
        placement="bottom"
        height="90dvh"
        className="h-[90dvh] max-h-[92dvh]"
        title={
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-primary" />
            <span className="font-semibold text-foreground">
              Filter Products
            </span>
            {drawerActiveFilterCount > 0 && (
              <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                {drawerActiveFilterCount}
              </span>
            )}
          </div>
        }
        extra={
          drawerActiveFilterCount > 0 ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDrawerReset}
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            >
              Reset
            </Button>
          ) : null
        }
        footer={
          <div className="flex w-full items-center gap-2">
            {(drawerActiveFilterCount > 0 || activeFilterCount > 0) && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDrawerReset}
                className="flex-1 cursor-pointer"
              >
                Clear All
              </Button>
            )}
            <Button
              variant="default"
              size="sm"
              onClick={handleApplyDrawerFilters}
              className="flex-1 cursor-pointer font-medium"
            >
              View Results
            </Button>
          </div>
        }
      >
        <div className="flex flex-col gap-6 py-2">
          {/* Categories Section */}
          <div>
            <p className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Categories
            </p>
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => setDrawerCategory("all")}
                className={cn(
                  "flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm transition-colors",
                  drawerCategory === "all" || !drawerCategory
                    ? "bg-primary/10 font-semibold text-primary"
                    : "text-foreground hover:bg-muted"
                )}
              >
                <span>All Categories</span>
                {(drawerCategory === "all" || !drawerCategory) && (
                  <Check className="size-4 text-primary" />
                )}
              </button>
              {categories.map((category) => {
                const isSelected =
                  drawerCategory.toLowerCase() === category.toLowerCase()
                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setDrawerCategory(category)}
                    className={cn(
                      "flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm capitalize transition-colors",
                      isSelected
                        ? "bg-primary/10 font-semibold text-primary"
                        : "text-foreground hover:bg-muted"
                    )}
                  >
                    <span>{category}</span>
                    {isSelected && <Check className="size-4 text-primary" />}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Price Range Section */}
          <div>
            <p className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Price Range
            </p>
            <div className="flex flex-col gap-3 rounded-lg border border-border bg-muted/20 p-3 sm:p-3.5">
              <div className="grid w-full min-w-0 grid-cols-2 items-end gap-2.5 sm:gap-3">
                <div className="min-w-0">
                  <label
                    htmlFor="mobile-filter-min-price"
                    className="mb-1.5 block text-[11px] font-medium text-muted-foreground"
                  >
                    Min Price ($)
                  </label>
                  <Input
                    id="mobile-filter-min-price"
                    type="number"
                    step="any"
                    min={minPossiblePrice}
                    max={maxPossiblePrice}
                    placeholder={`${minPossiblePrice}`}
                    value={drawerMin}
                    onChange={(e) => setDrawerMin(e.target.value)}
                    onWheel={(e) => e.currentTarget.blur()}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleApplyDrawerFilters()
                    }
                    startIcon={
                      <span className="text-xs text-muted-foreground">$</span>
                    }
                    className="h-9 text-xs sm:h-8"
                  />
                </div>
                <div className="min-w-0">
                  <label
                    htmlFor="mobile-filter-max-price"
                    className="mb-1.5 block text-[11px] font-medium text-muted-foreground"
                  >
                    Max Price ($)
                  </label>
                  <Input
                    id="mobile-filter-max-price"
                    type="number"
                    step="any"
                    min={minPossiblePrice}
                    max={maxPossiblePrice}
                    placeholder={`${maxPossiblePrice}`}
                    value={drawerMax}
                    onChange={(e) => setDrawerMax(e.target.value)}
                    onWheel={(e) => e.currentTarget.blur()}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleApplyDrawerFilters()
                    }
                    startIcon={
                      <span className="text-xs text-muted-foreground">$</span>
                    }
                    className="h-9 text-xs sm:h-8"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  )
}
