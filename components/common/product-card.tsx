import React from "react"
import Image from "next/image"
import Link from "next/link"
import { StarRating } from "@/components/common/star-rating"
import { QuickAddToCart } from "@/components/common/quick-add-to-cart"
import type { Product } from "@/types/product"

interface ProductCardProps {
  product: Product
  priority?: boolean
  layout?: "grid" | "list"
}

export function ProductCard({
  product,
  priority = false,
  layout = "grid",
}: ProductCardProps) {
  if (layout === "list") {
    return (
      <article className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-4 shadow-xs transition-all hover:border-primary/40 hover:shadow-md sm:flex-row sm:gap-5">
        {/* Left Image Column - Clean with NO badges */}
        <div className="relative flex aspect-square w-full shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white p-4 sm:h-48 sm:w-48">
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, 192px"
            priority={priority}
            className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Right Info Column */}
        <div className="flex flex-1 flex-col justify-between pt-3 sm:pt-0">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="capitalize">{product.category}</span>
              {product.rating && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <StarRating
                      rate={product.rating.rate}
                      size="sm"
                      showText={false}
                    />
                    <span className="font-medium text-foreground">
                      {product.rating.rate.toFixed(1)}
                    </span>
                    <span>({product.rating.count} reviews)</span>
                  </div>
                </>
              )}
            </div>

            <h3 className="line-clamp-2 text-base font-semibold text-foreground transition-colors group-hover:text-primary">
              <Link
                href={`/products/${product.id}`}
                className="focus:outline-hidden"
              >
                {product.title}
              </Link>
            </h3>

            {product.description && (
              <p className="line-clamp-2 text-xs text-muted-foreground">
                {product.description}
              </p>
            )}

            <div className="mt-1">
              <span className="text-xl font-bold text-foreground">
                ${product.price.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end sm:mt-2">
            <div className="w-full sm:w-44">
              <QuickAddToCart product={product} fullWidth />
            </div>
          </div>
        </div>
      </article>
    )
  }

  // Grid Layout
  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-4 shadow-xs transition-all hover:border-primary/40 hover:shadow-md">
      <div>
        {/* Product Image Frame - Clean with NO badges */}
        <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-white p-4">
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={priority}
            className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="mt-3 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="capitalize">{product.category}</span>
            {product.rating && (
              <div className="flex items-center gap-1">
                <StarRating
                  rate={product.rating.rate}
                  size="sm"
                  showText={false}
                />
                <span className="font-medium text-foreground">
                  {product.rating.rate.toFixed(1)}
                </span>
                <span>({product.rating.count})</span>
              </div>
            )}
          </div>

          <h3 className="line-clamp-2 text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
            <Link
              href={`/products/${product.id}`}
              className="focus:outline-hidden"
            >
              {product.title}
            </Link>
          </h3>

          <div className="mt-1">
            <span className="text-lg font-bold text-foreground">
              ${product.price.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Project Theme Add to Cart Button */}
      <div className="mt-4 pt-1">
        <QuickAddToCart product={product} fullWidth />
      </div>
    </article>
  )
}
