"use client"

import { useMemo, useCallback } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import type { Product } from "@/types/product"
import { ITEMS_PER_PAGE } from "@/lib/constants"

interface UseProductFiltersProps {
  products: Product[]
}

export function useProductFilters({ products }: UseProductFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentCategory = searchParams.get("category") || "all"
  const currentSearch = searchParams.get("search") || ""
  const currentMinPriceStr = searchParams.get("minPrice")
  const currentMaxPriceStr = searchParams.get("maxPrice")
  const currentSort = searchParams.get("sort") || ""
  const currentPage = Math.max(1, parseInt(searchParams.get("page") || "1", 10))

  const { minPossiblePrice, maxPossiblePrice } = useMemo(() => {
    if (!products.length) return { minPossiblePrice: 0, maxPossiblePrice: 1000 }
    const prices = products.map((p) => p.price)
    return {
      minPossiblePrice: Math.floor(Math.min(...prices)),
      maxPossiblePrice: Math.ceil(Math.max(...prices)),
    }
  }, [products])

  const currentMinPrice = currentMinPriceStr
    ? parseFloat(currentMinPriceStr)
    : minPossiblePrice
  const currentMaxPrice = currentMaxPriceStr
    ? parseFloat(currentMaxPriceStr)
    : maxPossiblePrice

  const createQueryString = useCallback(
    (paramsToUpdate: Record<string, string | number | null>) => {
      const params = new URLSearchParams(searchParams.toString())

      Object.entries(paramsToUpdate).forEach(([key, value]) => {
        if (
          value === null ||
          value === undefined ||
          value === "" ||
          value === "all"
        ) {
          params.delete(key)
        } else {
          params.set(key, String(value))
        }
      })

      return params.toString()
    },
    [searchParams]
  )

  const updateFilters = useCallback(
    (updates: Record<string, string | number | null>, resetPage = true) => {
      const updatesWithPage = resetPage ? { ...updates, page: null } : updates
      const queryString = createQueryString(updatesWithPage)
      const targetUrl = queryString ? `${pathname}?${queryString}` : pathname
      router.push(targetUrl, { scroll: false })
    },
    [createQueryString, pathname, router]
  )

  const filteredProducts = useMemo(() => {
    const result = products.filter((product) => {
      if (
        currentCategory &&
        currentCategory !== "all" &&
        product.category.toLowerCase() !== currentCategory.toLowerCase()
      ) {
        return false
      }

      if (currentSearch.trim()) {
        const query = currentSearch.toLowerCase().trim()
        const matchesTitle = product.title.toLowerCase().includes(query)
        const matchesDesc = product.description.toLowerCase().includes(query)
        const matchesCategory = product.category.toLowerCase().includes(query)
        if (!matchesTitle && !matchesDesc && !matchesCategory) {
          return false
        }
      }

      if (product.price < currentMinPrice || product.price > currentMaxPrice) {
        return false
      }

      return true
    })

    if (currentSort === "asc") {
      result.sort((a, b) => a.id - b.id)
    } else if (currentSort === "desc") {
      result.sort((a, b) => b.id - a.id)
    } else if (currentSort === "price-asc") {
      result.sort((a, b) => a.price - b.price)
    } else if (currentSort === "price-desc") {
      result.sort((a, b) => b.price - a.price)
    }

    return result
  }, [
    products,
    currentCategory,
    currentSearch,
    currentMinPrice,
    currentMaxPrice,
    currentSort,
  ])

  const totalItems = filteredProducts.length
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE))
  const safeCurrentPage = Math.min(currentPage, totalPages)

  const paginatedProducts = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredProducts, safeCurrentPage])

  const setCategory = useCallback(
    (category: string) => updateFilters({ category }),
    [updateFilters]
  )

  const setSearch = useCallback(
    (search: string) => updateFilters({ search }),
    [updateFilters]
  )

  const setPriceRange = useCallback(
    (min: number, max: number) =>
      updateFilters({
        minPrice: min === minPossiblePrice ? null : min,
        maxPrice: max === maxPossiblePrice ? null : max,
      }),
    [updateFilters, minPossiblePrice, maxPossiblePrice]
  )

  const setSort = useCallback(
    (sort: string) => updateFilters({ sort }),
    [updateFilters]
  )

  const setPage = useCallback(
    (page: number) => updateFilters({ page: page <= 1 ? null : page }, false),
    [updateFilters]
  )

  const resetFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete("category")
    params.delete("search")
    params.delete("minPrice")
    params.delete("maxPrice")
    params.delete("page")
    const query = params.toString()
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
  }, [pathname, router, searchParams])

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (currentCategory && currentCategory !== "all") count++
    if (currentSearch.trim()) count++
    if (currentMinPriceStr || currentMaxPriceStr) count++
    return count
  }, [currentCategory, currentSearch, currentMinPriceStr, currentMaxPriceStr])

  return {
    currentCategory,
    currentSearch,
    currentMinPrice,
    currentMaxPrice,
    currentSort,
    minPossiblePrice,
    maxPossiblePrice,
    currentPage: safeCurrentPage,
    totalPages,
    totalItems,
    activeFilterCount,

    filteredProducts,
    paginatedProducts,

    setCategory,
    setSearch,
    setPriceRange,
    setSort,
    setPage,
    resetFilters,
  }
}
