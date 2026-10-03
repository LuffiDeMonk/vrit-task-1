"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { useSearchParams, usePathname } from "next/navigation"
import type { Product } from "@/types/product"
import { ITEMS_PER_PAGE } from "@/lib/constants"

interface UseProductFiltersProps {
  products: Product[]
}

export function useProductFilters({ products }: UseProductFiltersProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const { minPossiblePrice, maxPossiblePrice } = useMemo(() => {
    if (!products.length) return { minPossiblePrice: 0, maxPossiblePrice: 1000 }
    const prices = products.map((p) => p.price)
    return {
      minPossiblePrice: Math.floor(Math.min(...prices)),
      maxPossiblePrice: Math.ceil(Math.max(...prices)),
    }
  }, [products])

  // Local state initialized from searchParams for INSTANT (0ms) UI updates
  const [currentCategory, setCategoryState] = useState<string>(
    () => searchParams.get("category") || "all"
  )
  const [currentSearch, setSearchState] = useState<string>(
    () => searchParams.get("search") || ""
  )
  const [currentMinPrice, setMinPriceState] = useState<number>(() => {
    const minParam = searchParams.get("minPrice")
    return minParam ? parseFloat(minParam) : minPossiblePrice
  })
  const [currentMaxPrice, setMaxPriceState] = useState<number>(() => {
    const maxParam = searchParams.get("maxPrice")
    return maxParam ? parseFloat(maxParam) : maxPossiblePrice
  })
  const [currentSort, setSortState] = useState<string>(
    () => searchParams.get("sort") || ""
  )
  const [currentMinRating, setMinRatingState] = useState<number>(() => {
    const ratingParam = searchParams.get("rating")
    return ratingParam ? parseFloat(ratingParam) : 0
  })
  const [currentPage, setPageState] = useState<number>(() =>
    Math.max(1, parseInt(searchParams.get("page") || "1", 10))
  )

  // Synchronize local state whenever searchParams changes externally (e.g. navbar links)
  useEffect(() => {
    const nextCategory = searchParams.get("category") || "all"
    const nextSearch = searchParams.get("search") || ""
    const nextMinParam = searchParams.get("minPrice")
    const nextMin = nextMinParam ? parseFloat(nextMinParam) : minPossiblePrice
    const nextMaxParam = searchParams.get("maxPrice")
    const nextMax = nextMaxParam ? parseFloat(nextMaxParam) : maxPossiblePrice
    const nextSort = searchParams.get("sort") || ""
    const nextRatingParam = searchParams.get("rating")
    const nextRating = nextRatingParam ? parseFloat(nextRatingParam) : 0
    const nextPage = Math.max(1, parseInt(searchParams.get("page") || "1", 10))

    setCategoryState(nextCategory)
    setSearchState(nextSearch)
    setMinPriceState(nextMin)
    setMaxPriceState(nextMax)
    setSortState(nextSort)
    setMinRatingState(nextRating)
    setPageState(nextPage)
  }, [searchParams, minPossiblePrice, maxPossiblePrice])

  // Synchronize with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window === "undefined") return
      const params = new URLSearchParams(window.location.search)
      const popCategory = params.get("category") || "all"
      const popSearch = params.get("search") || ""
      const popMin = params.get("minPrice")
        ? parseFloat(params.get("minPrice")!)
        : minPossiblePrice
      const popMax = params.get("maxPrice")
        ? parseFloat(params.get("maxPrice")!)
        : maxPossiblePrice
      const popSort = params.get("sort") || ""
      const popRating = params.get("rating")
        ? parseFloat(params.get("rating")!)
        : 0
      const popPage = Math.max(1, parseInt(params.get("page") || "1", 10))

      setCategoryState(popCategory)
      setSearchState(popSearch)
      setMinPriceState(popMin)
      setMaxPriceState(popMax)
      setSortState(popSort)
      setMinRatingState(popRating)
      setPageState(popPage)
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [minPossiblePrice, maxPossiblePrice])

  // Helper to instantly update URL bar in the background without triggering blocking RSC round-trips
  const syncUrl = useCallback(
    (paramsToUpdate: Record<string, string | number | null>) => {
      if (typeof window === "undefined") return

      const params = new URLSearchParams(
        window.location.search || searchParams.toString()
      )

      Object.entries(paramsToUpdate).forEach(([key, value]) => {
        if (
          value === null ||
          value === undefined ||
          value === "" ||
          value === "all" ||
          value === "default" ||
          value === 0
        ) {
          params.delete(key)
        } else {
          params.set(key, String(value))
        }
      })

      const queryString = params.toString()
      const targetUrl = queryString ? `${pathname}?${queryString}` : pathname
      window.history.replaceState(null, "", targetUrl)
    },
    [pathname, searchParams]
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

      if (currentMinRating > 0) {
        const rate = product.rating?.rate || 0
        if (rate < currentMinRating) {
          return false
        }
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
    } else if (currentSort === "rating-desc") {
      result.sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0))
    }

    return result
  }, [
    products,
    currentCategory,
    currentSearch,
    currentMinPrice,
    currentMaxPrice,
    currentMinRating,
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
    (category: string) => {
      const normalizedCategory = category || "all"
      setCategoryState(normalizedCategory)
      setPageState(1)
      syncUrl({ category: normalizedCategory, page: null })
    },
    [syncUrl]
  )

  const setSearch = useCallback(
    (search: string) => {
      setSearchState(search)
      setPageState(1)
      syncUrl({ search, page: null })
    },
    [syncUrl]
  )

  const setPriceRange = useCallback(
    (min: number, max: number) => {
      setMinPriceState(min)
      setMaxPriceState(max)
      setPageState(1)
      syncUrl({
        minPrice: min === minPossiblePrice ? null : min,
        maxPrice: max === maxPossiblePrice ? null : max,
        page: null,
      })
    },
    [syncUrl, minPossiblePrice, maxPossiblePrice]
  )

  const setMinRating = useCallback(
    (rating: number) => {
      const validRating = Math.max(0, Math.min(5, rating))
      setMinRatingState(validRating)
      setPageState(1)
      syncUrl({
        rating: validRating > 0 ? validRating : null,
        page: null,
      })
    },
    [syncUrl]
  )

  const applyFilters = useCallback(
    ({
      category,
      minPrice,
      maxPrice,
      minRating,
    }: {
      category?: string
      minPrice?: number
      maxPrice?: number
      minRating?: number
    }) => {
      const updates: Record<string, string | number | null> = { page: null }

      if (category !== undefined) {
        const normalizedCategory = category || "all"
        setCategoryState(normalizedCategory)
        updates.category = normalizedCategory
      }

      if (minPrice !== undefined) {
        setMinPriceState(minPrice)
        updates.minPrice = minPrice === minPossiblePrice ? null : minPrice
      }

      if (maxPrice !== undefined) {
        setMaxPriceState(maxPrice)
        updates.maxPrice = maxPrice === maxPossiblePrice ? null : maxPrice
      }

      if (minRating !== undefined) {
        const validRating = Math.max(0, Math.min(5, minRating))
        setMinRatingState(validRating)
        updates.rating = validRating > 0 ? validRating : null
      }

      setPageState(1)
      syncUrl(updates)
    },
    [syncUrl, minPossiblePrice, maxPossiblePrice]
  )

  const setSort = useCallback(
    (sort: string) => {
      setSortState(sort)
      setPageState(1)
      syncUrl({ sort, page: null })
    },
    [syncUrl]
  )

  const setPage = useCallback(
    (page: number) => {
      const validPage = Math.max(1, page)
      setPageState(validPage)
      syncUrl({ page: validPage <= 1 ? null : validPage })
    },
    [syncUrl]
  )

  const resetFilters = useCallback(() => {
    setCategoryState("all")
    setSearchState("")
    setMinPriceState(minPossiblePrice)
    setMaxPriceState(maxPossiblePrice)
    setMinRatingState(0)
    setPageState(1)

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(
        window.location.search || searchParams.toString()
      )
      params.delete("category")
      params.delete("search")
      params.delete("minPrice")
      params.delete("maxPrice")
      params.delete("rating")
      params.delete("page")
      const query = params.toString()
      const targetUrl = query ? `${pathname}?${query}` : pathname
      window.history.replaceState(null, "", targetUrl)
    }
  }, [minPossiblePrice, maxPossiblePrice, pathname, searchParams])

  const activeFilterCount = useMemo(() => {
    let count = 0
    if (currentCategory && currentCategory !== "all") count++
    if (currentSearch.trim()) count++
    if (
      currentMinPrice !== minPossiblePrice ||
      currentMaxPrice !== maxPossiblePrice
    ) {
      count++
    }
    if (currentMinRating > 0) count++
    return count
  }, [
    currentCategory,
    currentSearch,
    currentMinPrice,
    currentMaxPrice,
    currentMinRating,
    minPossiblePrice,
    maxPossiblePrice,
  ])

  return {
    currentCategory,
    currentSearch,
    currentMinPrice,
    currentMaxPrice,
    currentMinRating,
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
    setMinRating,
    applyFilters,
    setSort,
    setPage,
    resetFilters,
  }
}
