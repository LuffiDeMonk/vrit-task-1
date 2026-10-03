import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/shared/badge"
import { StarRating } from "@/components/common/star-rating"
import { QuickAddToCart } from "@/components/common/quick-add-to-cart"
import type { Product } from "@/types/product"

interface ProductCardProps {
  product: Product
  priority?: boolean
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      <div>
        <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-white p-6">
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={priority}
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-2.5 left-2.5">
            <Badge
              variant="secondary"
              className="border bg-background/90 text-[11px] font-medium capitalize shadow-xs backdrop-blur-xs"
            >
              {product.category}
            </Badge>
          </div>
        </div>

        <div className="flex flex-col p-4">
          <div className="mb-2">
            <StarRating
              rate={product.rating?.rate}
              count={product.rating?.count}
              size="sm"
            />
          </div>

          <h3 className="line-clamp-2 text-sm font-semibold text-card-foreground transition-colors group-hover:text-primary">
            <Link
              href={`/products/${product.id}`}
              className="focus:outline-hidden"
            >
              <span className="absolute inset-0" aria-hidden="true" />
              {product.title}
            </Link>
          </h3>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-border/60 bg-muted/20 p-4 pt-3">
        <div>
          <span className="block text-xs text-muted-foreground">Price</span>
          <span className="text-base font-bold text-foreground">
            ${product.price.toFixed(2)}
          </span>
        </div>
        <QuickAddToCart product={product} />
      </div>
    </article>
  )
}
