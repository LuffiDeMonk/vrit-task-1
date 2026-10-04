"use client"

import { useState } from "react"
import { Button } from "@/components/shared/button"
import { Card } from "@/components/ui/card"

interface CartSummaryProps {
  totalItems: number
  totalPrice: number
  onClearCart: () => void
}

export function CartSummary({
  totalItems,
  totalPrice,
  onClearCart,
}: CartSummaryProps) {
  const [isCheckedOut, setIsCheckedOut] = useState(false)

  const handleCheckout = () => {
    setIsCheckedOut(true)
    setTimeout(() => {
      onClearCart()
      setIsCheckedOut(false)
    }, 2500)
  }

  return (
    <Card className="sticky top-20 space-y-5 border-border bg-card p-5 shadow-sm sm:p-6">
      <h2 className="text-base font-bold tracking-tight text-foreground">
        Order Summary
      </h2>

      <div className="space-y-3 text-xs sm:text-sm">
        <div className="flex justify-between text-muted-foreground">
          <span>Items Subtotal ({totalItems})</span>
          <span className="font-semibold text-foreground">
            ${totalPrice.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between text-muted-foreground">
          <span>Estimated Sales Tax</span>
          <span className="font-semibold text-foreground">$0.00</span>
        </div>

        <div className="flex items-baseline justify-between border-t border-border/60 pt-3">
          <span className="text-sm font-bold text-foreground">
            Estimated Total
          </span>
          <span className="text-xl font-extrabold text-foreground">
            ${totalPrice.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <Button
          size="lg"
          variant={isCheckedOut ? "success" : "default"}
          onClick={handleCheckout}
          disabled={isCheckedOut || totalItems === 0}
          className="w-full font-bold"
        >
          {isCheckedOut ? "Order Placed Successfully!" : "Proceed to Checkout"}
        </Button>

        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onClearCart}
          disabled={isCheckedOut || totalItems === 0}
          className="w-full font-medium text-muted-foreground hover:border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
        >
          Clear Cart
        </Button>
      </div>
    </Card>
  )
}
