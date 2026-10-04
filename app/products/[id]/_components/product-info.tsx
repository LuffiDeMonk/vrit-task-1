import Link from "next/link"
import { Badge } from "@/components/shared/badge"
import { StarRating } from "@/components/common/star-rating"
import { buttonVariants } from "@/components/shared/button"
import { cn } from "@/lib/utils"
import type { Product } from "@/types/product"
import { AddToCartButton } from "./add-to-cart-button"

interface ProductInfoProps {
  product: Product
}

export function ProductInfo({ product }: ProductInfoProps) {
  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link
          href={`/products?category=${encodeURIComponent(product.category)}`}
        >
          <Badge
            variant="secondary"
            className="cursor-pointer px-3 py-1 text-xs font-semibold capitalize transition-colors hover:bg-secondary/80"
          >
            {product.category}
          </Badge>
        </Link>

        <div className="flex items-center gap-1.5">
          <StarRating
            rate={product.rating?.rate}
            count={product.rating?.count}
            size="md"
          />
        </div>
      </div>

      <h1 className="text-2xl leading-tight font-extrabold tracking-tight text-foreground sm:text-3xl">
        {product.title}
      </h1>

      <div className="flex items-baseline gap-4 border-b border-border/60 pb-4">
        <span className="text-3xl font-black text-foreground sm:text-4xl">
          ${product.price.toFixed(2)}
        </span>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
          <span className="flex size-2 animate-pulse rounded-full bg-emerald-500" />
          <span>In Stock</span>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
          Product Description
        </h2>
        <p className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
          {product.description}
        </p>
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex flex-col items-stretch gap-3 sm:flex-row">
          <div className="flex-1">
            <AddToCartButton product={product} />
          </div>

          <Link
            href="/products"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "h-10 shrink-0 gap-2"
            )}
          >
            <span>Continue Shopping</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
