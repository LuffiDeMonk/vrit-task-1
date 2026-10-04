import { notFound } from "next/navigation"
import { getProduct } from "@/lib/api/products"
import { ProductDetail } from "@/app/products/[id]/_components/product-detail"
import { ProductJsonLd } from "@/app/products/[id]/_components/product-json-ld"
import type { Metadata } from "next"

interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params
  const product = await getProduct(Number(id))

  if (!product) {
    return {
      title: "Product Not Found | FakeStore Direct",
    }
  }

  return {
    title: `${product.title} | FakeStore Direct`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.title,
      description: product.description.slice(0, 160),
      images: [{ url: product.image }],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const productId = Number(id)

  if (isNaN(productId) || productId <= 0) {
    notFound()
  }

  const product = await getProduct(productId)

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6">
      <ProductJsonLd product={product} />
      <ProductDetail product={product} />
    </div>
  )
}
