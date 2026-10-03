"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { ShoppingCart, Check } from "lucide-react"
import { Button } from "@/components/shared/button"
import { Tooltip } from "@/components/shared/tooltip"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import type { Product } from "@/types/product"

interface QuickAddToCartProps {
  product: Product
}

export function QuickAddToCart({ product }: QuickAddToCartProps) {
  const router = useRouter()
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()
  const { isAuthenticated } = useAuth()

  const handleQuickAdd = (e: React.MouseEvent) => {
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
        className="relative z-10 h-7 gap-1.5 px-2.5 text-xs font-medium"
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
