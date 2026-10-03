"use client"

import React, { useTransition } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { SlidersHorizontal } from "lucide-react"
import { Select, type SelectOption } from "@/components/shared/select"

const SORT_SELECT_OPTIONS: SelectOption[] = [
  { label: "Default Order", value: "default" },
  { label: "API Sort: Ascending (?sort=asc)", value: "asc" },
  { label: "API Sort: Descending (?sort=desc)", value: "desc" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
]

export function SortSelector() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const currentSort = searchParams.get("sort") || "default"

  const handleSortChange = (value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value && value !== "default") {
      params.set("sort", value)
    } else {
      params.delete("sort")
    }
    params.delete("page")

    startTransition(() => {
      const query = params.toString()
      router.push(query ? `${pathname}?${query}` : pathname)
    })
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1.5 text-xs font-medium whitespace-nowrap text-muted-foreground">
        <SlidersHorizontal className="size-3.5" />
        <span className="hidden sm:inline">Sort:</span>
      </div>

      <div className="relative w-44 sm:w-56">
        <Select
          options={SORT_SELECT_OPTIONS}
          value={currentSort}
          onValueChange={handleSortChange}
          placeholder="Default Order"
          disabled={isPending}
          className="h-8 min-h-8 rounded-lg border-border px-2.5 py-1 text-xs"
        />
        {isPending && (
          <span className="absolute -top-1 -right-1 z-10 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
          </span>
        )}
      </div>
    </div>
  )
}
