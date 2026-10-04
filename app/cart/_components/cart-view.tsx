"use client"

import Link from "next/link"
import { ArrowLeft, ShoppingBag } from "lucide-react"
import { AuthGuard } from "@/components/common/auth-guard"
import { CartItemRow } from "@/app/cart/_components/cart-item-row"
import { CartSummary } from "@/app/cart/_components/cart-summary"
import { CartEmptyState } from "@/app/cart/_components/cart-empty-state"
import { buttonVariants } from "@/components/shared/button"
import { useCart } from "@/hooks/use-cart"
import { cn } from "@/lib/utils"

function CartContent() {
  const {
    items,
    totalItems,
    totalPrice,
    updateQuantity,
    removeItem,
    clearCart,
    isHydrated,
  } = useCart()

  if (!isHydrated) {
    return (
      <div className="container mx-auto space-y-6 px-4 py-8 sm:px-6">
        <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
        <div className="h-64 w-full animate-pulse rounded-xl bg-muted" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Link
            href="/products"
            className={cn(
              buttonVariants({ variant: "ghost", size: "xs" }),
              "mb-2 -ml-2 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            )}
          >
            <ArrowLeft className="size-3.5" />
            <span>Continue Shopping</span>
          </Link>

          <h1 className="flex items-center gap-2.5 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            <ShoppingBag className="size-7 text-primary" />
            <span>Your Shopping Cart</span>
          </h1>
        </div>

        {totalItems > 0 && (
          <span className="text-xs text-muted-foreground">
            {totalItems} {totalItems === 1 ? "item" : "items"} in cart
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <CartEmptyState />
      ) : (
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
          <div className="space-y-3 lg:col-span-2">
            {items.map((item) => (
              <CartItemRow
                key={item.product.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}
          </div>

          <div className="lg:col-span-1">
            <CartSummary
              totalItems={totalItems}
              totalPrice={totalPrice}
              onClearCart={clearCart}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export function CartView() {
  return (
    <AuthGuard fallbackUrl="/login">
      <CartContent />
    </AuthGuard>
  )
}
