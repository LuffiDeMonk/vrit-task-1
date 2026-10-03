export interface Rating {
  rate: number
  count: number
}

export interface Product {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: Rating
  stock?: number
  brand?: string
  thumbnail?: string
  images?: string[]
}

export type Category = string

export type SortOrder = "asc" | "desc" | "price-asc" | "price-desc"

export interface ProductFilters {
  category?: string
  search?: string
  minPrice?: number
  maxPrice?: number
  sort?: SortOrder
  page?: number
}
