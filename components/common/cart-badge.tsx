"use client"

import React from "react"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { buttonVariants } from "@/components/shared/button"
import { cn } from "@/lib/utils"

export function CartBadge() {
  const { totalItems, isHydrated: cartHydrated } = useCart()
  const { isAuthenticated, isHydrated: authHydrated } = useAuth()

  const isReady = cartHydrated && authHydrated
  const targetHref =
    isReady && isAuthenticated ? "/cart" : "/login?redirect=/cart"

  return (
    <Link
      href={targetHref}
      className={cn(
        buttonVariants({ variant: "outline", size: "sm" }),
        "group relative h-8 gap-2 px-3 text-xs font-medium"
      )}
      title={
        isReady && isAuthenticated
          ? `View Shopping Cart (${totalItems} items)`
          : "Log in to view Shopping Cart"
      }
      aria-label={`Shopping cart with ${totalItems} items`}
    >
      <ShoppingCart className="size-4 transition-transform group-hover:scale-110" />
      <span className="hidden sm:inline">Cart</span>
      <span
        className={cn(
          "flex size-5 items-center justify-center rounded-full text-[11px] font-bold transition-all",
          totalItems > 0 && isAuthenticated
            ? "scale-100 bg-primary text-primary-foreground shadow-xs"
            : "scale-95 bg-muted text-muted-foreground"
        )}
      >
        {isReady && isAuthenticated ? totalItems : 0}
      </span>
    </Link>
  )
}
