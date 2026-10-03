"use client"

import React, { useState } from "react"
import { SlidersHorizontal, Check } from "lucide-react"
import { Drawer } from "@/components/shared/drawer"
import { Button } from "@/components/shared/button"
import { Input } from "@/components/shared/input"
import { cn } from "@/lib/utils"
import type { Category } from "@/types/product"

interface AmazonFilterDrawerProps {
  open: boolean
  onClose: () => void
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

export function AmazonFilterDrawer({
  open,
  onClose,
  categories,
  currentCategory,
  currentMinPrice,
  currentMaxPrice,
  minPossiblePrice,
  maxPossiblePrice,
  activeFilterCount,
  onApplyFilters,
  onResetFilters,
}: AmazonFilterDrawerProps) {
  // Staged state for drawer
  const [drawerCategory, setDrawerCategory] = useState<string>(currentCategory)
  const [drawerMin, setDrawerMin] = useState<string>(
    currentMinPrice === minPossiblePrice ? "" : String(currentMinPrice)
  )
  const [drawerMax, setDrawerMax] = useState<string>(
    currentMaxPrice === maxPossiblePrice ? "" : String(currentMaxPrice)
  )

  // Sync when drawer opens
  const handleOpenSync = () => {
    setDrawerCategory(currentCategory)
    setDrawerMin(
      currentMinPrice === minPossiblePrice ? "" : String(currentMinPrice)
    )
    setDrawerMax(
      currentMaxPrice === maxPossiblePrice ? "" : String(currentMaxPrice)
    )
  }

  const handleApply = () => {
    const minParsed = drawerMin.trim() ? parseFloat(drawerMin) : minPossiblePrice
    const maxParsed = drawerMax.trim() ? parseFloat(drawerMax) : maxPossiblePrice
    const validMin = !isNaN(minParsed) ? minParsed : minPossiblePrice
    const validMax = !isNaN(maxParsed) ? maxParsed : maxPossiblePrice

    const clampedMin = Math.max(
      minPossiblePrice,
      Math.min(validMin, validMax)
    )
    const clampedMax = Math.max(
      minPossiblePrice,
      Math.max(validMin, validMax)
    )

    onApplyFilters({
      category: drawerCategory || "all",
      minPrice: clampedMin,
      maxPrice: clampedMax,
    })
    onClose()
  }

  const handleClearAll = () => {
    setDrawerCategory("all")
    setDrawerMin("")
    setDrawerMax("")
    onResetFilters()
    onClose()
  }

  const handlePricePreset = (min: number | null, max: number | null) => {
    setDrawerMin(min !== null ? String(min) : "")
    setDrawerMax(max !== null ? String(max) : "")
  }

  // Calculate active filter count staged in drawer
  const isCategoryFiltered =
    drawerCategory !== "all" && drawerCategory !== ""
  const parsedDrawerMin = drawerMin.trim()
    ? parseFloat(drawerMin)
    : minPossiblePrice
  const parsedDrawerMax = drawerMax.trim()
    ? parseFloat(drawerMax)
    : maxPossiblePrice
  const isPriceFiltered =
    (!isNaN(parsedDrawerMin) && parsedDrawerMin !== minPossiblePrice) ||
    (!isNaN(parsedDrawerMax) && parsedDrawerMax !== maxPossiblePrice)

  const drawerActiveCount =
    (isCategoryFiltered ? 1 : 0) + (isPriceFiltered ? 1 : 0)

  return (
    <Drawer
      open={open}
      onClose={onClose}
      onOpenChange={(isOpen) => {
        if (isOpen) {
          handleOpenSync()
        } else {
          onClose()
        }
      }}
      placement="bottom"
      height="90dvh"
      className="h-[90dvh] max-h-[92dvh]"
      title={
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-primary" />
          <span className="font-semibold text-foreground">Filters</span>
          {drawerActiveCount > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
              {drawerActiveCount}
            </span>
          )}
        </div>
      }
      extra={
        drawerActiveCount > 0 || activeFilterCount > 0 ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearAll}
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground hover:underline"
          >
            Clear All
          </Button>
        ) : null
      }
      footer={
        <div className="flex w-full items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearAll}
            className="flex-1 cursor-pointer"
          >
            Clear All
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleApply}
            className="flex-1 cursor-pointer font-semibold"
          >
            Apply Filters
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-6 py-2 pb-6">
        {/* 1. Categories */}
        <div>
          <p className="mb-2 text-xs font-bold tracking-wider text-foreground uppercase">
            Categories
          </p>
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => setDrawerCategory("all")}
              className={cn(
                "flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
                drawerCategory === "all" || !drawerCategory
                  ? "bg-primary/10 font-bold text-primary"
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
                    "flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm capitalize transition-colors",
                    isSelected
                      ? "bg-primary/10 font-bold text-primary"
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

        {/* 2. Price Range */}
        <div className="border-t border-border/50 pt-4">
          <p className="mb-2 text-xs font-bold tracking-wider text-foreground uppercase">
            Price Range
          </p>
          {/* Quick presets */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handlePricePreset(null, 25)}
              className="cursor-pointer rounded-md border border-border bg-card p-2 text-center text-muted-foreground hover:border-foreground"
            >
              Under $25
            </button>
            <button
              type="button"
              onClick={() => handlePricePreset(25, 50)}
              className="cursor-pointer rounded-md border border-border bg-card p-2 text-center text-muted-foreground hover:border-foreground"
            >
              $25 to $50
            </button>
            <button
              type="button"
              onClick={() => handlePricePreset(50, 100)}
              className="cursor-pointer rounded-md border border-border bg-card p-2 text-center text-muted-foreground hover:border-foreground"
            >
              $50 to $100
            </button>
            <button
              type="button"
              onClick={() => handlePricePreset(100, null)}
              className="cursor-pointer rounded-md border border-border bg-card p-2 text-center text-muted-foreground hover:border-foreground"
            >
              $100 & Above
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="drawer-min-price"
                className="mb-1 block text-[11px] font-medium text-muted-foreground"
              >
                Min Price ($)
              </label>
              <Input
                id="drawer-min-price"
                type="number"
                step="any"
                min={minPossiblePrice}
                max={maxPossiblePrice}
                placeholder={`${minPossiblePrice}`}
                value={drawerMin}
                onChange={(e) => setDrawerMin(e.target.value)}
                onWheel={(e) => e.currentTarget.blur()}
                startIcon={
                  <span className="text-xs text-muted-foreground">$</span>
                }
                className="h-9 text-xs"
              />
            </div>
            <div>
              <label
                htmlFor="drawer-max-price"
                className="mb-1 block text-[11px] font-medium text-muted-foreground"
              >
                Max Price ($)
              </label>
              <Input
                id="drawer-max-price"
                type="number"
                step="any"
                min={minPossiblePrice}
                max={maxPossiblePrice}
                placeholder={`${maxPossiblePrice}`}
                value={drawerMax}
                onChange={(e) => setDrawerMax(e.target.value)}
                onWheel={(e) => e.currentTarget.blur()}
                startIcon={
                  <span className="text-xs text-muted-foreground">$</span>
                }
                className="h-9 text-xs"
              />
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  )
}
