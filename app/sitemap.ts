import type { MetadataRoute } from "next"
import { getProducts } from "@/lib/api/products"
import { SITE_URL } from "@/lib/constants"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts(undefined, undefined, {
    cache: "force-cache",
    next: { revalidate: 86400 },
  })

  const productUrls: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/products/${product.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...productUrls,
  ]
}
