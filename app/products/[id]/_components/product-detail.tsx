import React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { buttonVariants } from "@/components/shared/button"
import { Breadcrumb } from "@/components/shared/breadcrumb"
import { ProductImage } from "@/app/products/[id]/_components/product-image"
import { ProductInfo } from "@/app/products/[id]/_components/product-info"
import { cn } from "@/lib/utils"
import type { Product } from "@/types/product"

interface ProductDetailProps {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    {
      label:
        product.category.charAt(0).toUpperCase() + product.category.slice(1),
      href: `/products?category=${encodeURIComponent(product.category)}`,
    },
    { label: product.title },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 border-b border-border/40 pb-2 sm:flex-row sm:items-center">
        <Breadcrumb items={breadcrumbItems} />
        <Link
          href="/products"
          className={cn(
            buttonVariants({ variant: "ghost", size: "sm" }),
            "gap-1.5 self-start text-xs text-muted-foreground hover:text-foreground sm:self-auto"
          )}
        >
          <ArrowLeft className="size-3.5" />
          <span>Back to Products</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2 lg:gap-12">
        <ProductImage src={product.image} alt={product.title} />
        <ProductInfo product={product} />
      </div>
    </div>
  )
}
