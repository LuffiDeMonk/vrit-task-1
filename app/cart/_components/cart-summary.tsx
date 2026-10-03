"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  ShieldCheck,
  Truck,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
} from "lucide-react"
import { Button, buttonVariants } from "@/components/shared/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

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
          <span className="flex items-center gap-1.5">
            <Truck className="size-3.5" />
            Express Shipping
          </span>
          <span className="text-xs font-semibold text-emerald-600 uppercase dark:text-emerald-400">
            Free
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
          className="w-full font-bold shadow-xs"
        >
          {isCheckedOut ? (
            <span className="flex items-center gap-2">
              <CheckCircle2 className="size-4 animate-in zoom-in" />
              Order Placed Successfully!
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <span>Proceed to Checkout</span>
              <ArrowRight className="size-4" />
            </span>
          )}
        </Button>

        <div className="flex items-center justify-between pt-1">
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={onClearCart}
            className="gap-1 px-2 text-xs text-muted-foreground hover:text-destructive"
          >
            <RotateCcw className="size-3" />
            Clear Cart
          </Button>

          <Link
            href="/products"
            className={cn(
              buttonVariants({ variant: "link", size: "xs" }),
              "text-xs text-muted-foreground hover:text-foreground"
            )}
          >
            Continue Shopping
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-border/40 pt-4 text-[11px] text-muted-foreground">
        <ShieldCheck className="size-4 shrink-0 text-emerald-600" />
        <span>Secure client-side checkout simulation. No charge made.</span>
      </div>
    </Card>
  )
}
