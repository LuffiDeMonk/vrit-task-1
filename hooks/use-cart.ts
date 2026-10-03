"use client"

import { useMemo } from "react"
import { useCartStore } from "@/stores/cart-store"

export function useCart() {
  const items = useCartStore((state) => state.items)
  const isHydrated = useCartStore((state) => state.isHydrated)
  const addItem = useCartStore((state) => state.addItem)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const clearCart = useCartStore((state) => state.clearCart)

  const { totalItems, totalPrice } = useMemo(() => {
    if (!isHydrated) {
      return { totalItems: 0, totalPrice: 0 }
    }
    const count = items.reduce((sum, item) => sum + item.quantity, 0)
    const price = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    )
    return {
      totalItems: count,
      totalPrice: Math.round(price * 100) / 100,
    }
  }, [items, isHydrated])

  return {
    items: isHydrated ? items : [],
    isHydrated,
    totalItems,
    totalPrice,
    formattedTotalPrice: `$${totalPrice.toFixed(2)}`,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  }
}
