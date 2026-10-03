export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://fakestoreapi.com"

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

export const ITEMS_PER_PAGE = 8

export const DEFAULT_TIMEOUT_MS = 10000

export const SORT_OPTIONS = [
  { label: "Default Order", value: "" },
  { label: "API Sort: Ascending (?sort=asc)", value: "asc" },
  { label: "API Sort: Descending (?sort=desc)", value: "desc" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
] as const

export const SITE_CONFIG = {
  name: "FakeStore Direct",
  description:
    "Explore premium products with instant filtering, SSR performance, and modern Next.js architecture powered by Fake Store API.",
}

export const DEMO_CREDENTIALS = {
  username: "mor_2314",
  password: "83r5^_",
}
