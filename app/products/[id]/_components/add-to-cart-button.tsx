"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { ShoppingCart, Check, Minus, Plus, LogIn } from "lucide-react"
import { Button } from "@/components/shared/button"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import type { Product } from "@/types/product"

interface AddToCartButtonProps {
  product: Product
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [justAdded, setJustAdded] = useState(false)
  const { addItem } = useCart()
  const { isAuthenticated, isHydrated } = useAuth()

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1))
  }

  const handleIncrease = () => {
    setQuantity((prev) => Math.min(10, prev + 1))
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/products/${product.id}`)
      return
    }

    addItem(product, quantity)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2000)
  }

  const isSignInPrompt = isHydrated && !isAuthenticated

  const ctaIcon = justAdded ? (
    <Check className="size-4 animate-in zoom-in" />
  ) : isSignInPrompt ? (
    <LogIn className="size-4" />
  ) : (
    <ShoppingCart className="size-4" />
  )

  const ctaLabel = justAdded
    ? "Added to Cart!"
    : isSignInPrompt
      ? "Sign In to Add to Cart"
      : `Add to Cart (${quantity})`

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center rounded-lg border border-input bg-background p-1 shadow-2xs">
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={handleDecrease}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className="size-7"
            icon={<Minus className="size-3.5" />}
          />

          <span className="w-10 text-center text-sm font-semibold text-foreground tabular-nums">
            {quantity}
          </span>

          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={handleIncrease}
            disabled={quantity >= 10}
            aria-label="Increase quantity"
            className="size-7"
            icon={<Plus className="size-3.5" />}
          />
        </div>

        <Button
          type="button"
          size="lg"
          variant={justAdded ? "success" : "default"}
          onClick={handleAddToCart}
          icon={ctaIcon}
          iconPosition="left"
          className="flex-1 font-semibold shadow-xs"
        >
          {ctaLabel}
        </Button>
      </div>
    </div>
  )
}
