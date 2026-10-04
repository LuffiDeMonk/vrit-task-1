"use client"

import { useState, type MouseEvent } from "react"
import { useRouter } from "next/navigation"
import { ShoppingCart, Check } from "lucide-react"
import { Button } from "@/components/shared/button"
import { Tooltip } from "@/components/shared/tooltip"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"
import type { Product } from "@/types/product"

interface QuickAddToCartProps {
  product: Product
  fullWidth?: boolean
  className?: string
}

export function QuickAddToCart({
  product,
  fullWidth = false,
  className,
}: QuickAddToCartProps) {
  const router = useRouter()
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()
  const { isAuthenticated } = useAuth()

  const handleQuickAdd = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isAuthenticated) {
      router.push(`/login?redirect=/products`)
      return
    }

    addItem(product, 1)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  if (fullWidth) {
    return (
      <Button
        type="button"
        variant={added ? "success" : "default"}
        size="sm"
        onClick={handleQuickAdd}
        aria-label={`Add ${product.title} to cart`}
        className={cn(
          "w-full cursor-pointer font-medium shadow-xs transition-all",
          className
        )}
      >
        {added ? (
          <>
            <Check className="size-3.5 animate-in zoom-in" />
            <span>Added to Cart</span>
          </>
        ) : (
          <>
            <ShoppingCart className="size-3.5" />
            <span>Add to Cart</span>
          </>
        )}
      </Button>
    )
  }

  return (
    <Tooltip
      title={isAuthenticated ? "Quick add to cart" : "Login to add to cart"}
      placement="top"
    >
      <Button
        type="button"
        variant={added ? "success" : "outline"}
        size="xs"
        onClick={handleQuickAdd}
        aria-label={`Add ${product.title} to cart`}
        className={cn(
          "relative z-10 h-7 gap-1.5 px-2.5 text-xs font-medium",
          className
        )}
      >
        {added ? (
          <>
            <Check className="size-3.5 animate-in zoom-in" />
            <span>Added</span>
          </>
        ) : (
          <>
            <ShoppingCart className="size-3.5" />
            <span>Add</span>
          </>
        )}
      </Button>
    </Tooltip>
  )
}
