import { apiClient } from "@/lib/api/client"
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from "@/lib/api/mock-products"
import type { Category, Product, SortOrder } from "@/types/product"

function normalizeProduct(raw: Record<string, unknown>): Product {
  const rawRating = raw.rating
  const ratingRate =
    typeof rawRating === "number"
      ? rawRating
      : typeof (rawRating as { rate?: number })?.rate === "number"
        ? (rawRating as { rate: number }).rate
        : 4.5

  const rawReviews = raw.reviews
  const ratingCount =
    typeof (rawRating as { count?: number })?.count === "number"
      ? (rawRating as { count: number }).count
      : Array.isArray(rawReviews)
        ? Math.max(rawReviews.length * 12, 18)
        : 50

  const images = Array.isArray(raw.images) ? (raw.images as string[]) : []
  const thumbnail = typeof raw.thumbnail === "string" ? raw.thumbnail : ""
  const directImage = typeof raw.image === "string" ? raw.image : ""
  const finalImage = thumbnail || (images.length > 0 ? images[0] : directImage)

  return {
    id: Number(raw.id),
    title: String(raw.title || ""),
    price: Number(raw.price || 0),
    description: String(raw.description || ""),
    category: String(raw.category || "general"),
    image: finalImage,
    rating: {
      rate: Math.round(Number(ratingRate) * 10) / 10,
      count: Number(ratingCount),
    },
    stock: typeof raw.stock === "number" ? raw.stock : 50,
    brand: typeof raw.brand === "string" ? raw.brand : undefined,
    thumbnail: thumbnail || undefined,
    images: images.length > 0 ? images : undefined,
  }
}

export async function getProducts(
  sort?: SortOrder,
  limit?: number,
  fetchOptions?: { cache?: RequestCache; next?: { revalidate?: number } }
): Promise<Product[]> {
  const params: Record<string, string | number | undefined> = {}

  if (limit && limit > 0) {
    params.limit = limit
  }

  if (sort === "asc" || sort === "desc") {
    params.sort = sort
  }

  const result = await apiClient<Record<string, unknown>[]>("/products", {
    params,
    cache: fetchOptions?.cache ?? "no-store",
    next: fetchOptions?.next,
  })

  if (result.ok && Array.isArray(result.data) && result.data.length > 0) {
    return result.data.map(normalizeProduct)
  }

  console.warn(
    `[getProducts] Remote API returned status ${result.status} (${result.ok ? "empty" : result.message}). Using fallback mock data.`
  )

  let fallback = [...MOCK_PRODUCTS]
  if (sort === "desc") {
    fallback = fallback.sort((a, b) => b.id - a.id)
  } else if (sort === "asc") {
    fallback = fallback.sort((a, b) => a.id - b.id)
  } else if (sort === "price-desc") {
    fallback = fallback.sort((a, b) => b.price - a.price)
  } else if (sort === "price-asc") {
    fallback = fallback.sort((a, b) => a.price - b.price)
  }

  if (limit && limit > 0) {
    fallback = fallback.slice(0, limit)
  }

  return fallback
}

export async function getProduct(id: number): Promise<Product | null> {
  const result = await apiClient<Record<string, unknown>>(`/products/${id}`, {
    cache: "no-store",
  })

  if (result.ok && result.data && result.data.id) {
    return normalizeProduct(result.data)
  }

  console.warn(
    `[getProduct] Remote API returned status ${result.status}. Using fallback item.`
  )

  const fallbackItem = MOCK_PRODUCTS.find((p) => p.id === Number(id))
  return fallbackItem || null
}

export async function getCategories(): Promise<Category[]> {
  const result = await apiClient<Category[]>("/products/categories", {
    cache: "no-store",
  })

  if (result.ok && Array.isArray(result.data) && result.data.length > 0) {
    return result.data
  }

  return MOCK_CATEGORIES
}

export async function getProductsByCategory(
  category: string,
  sort?: SortOrder
): Promise<Product[]> {
  const params: Record<string, string | undefined> = {}
  if (sort === "asc" || sort === "desc") {
    params.sort = sort
  }

  const encodedCategory = encodeURIComponent(category)
  const result = await apiClient<Record<string, unknown>[]>(
    `/products/category/${encodedCategory}`,
    { params, cache: "no-store" }
  )

  if (result.ok && Array.isArray(result.data) && result.data.length > 0) {
    return result.data.map(normalizeProduct)
  }

  let fallback = MOCK_PRODUCTS.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  )
  if (sort === "desc") {
    fallback = fallback.sort((a, b) => b.price - a.price)
  } else if (sort === "asc") {
    fallback = fallback.sort((a, b) => a.price - b.price)
  }

  return fallback
}
