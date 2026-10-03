import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartStore } from "@/types/cart"
import type { Product } from "@/types/product"

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isHydrated: false,

      addItem: (product: Product, quantity = 1) => {
        const safeQty = Math.max(1, Math.min(10, quantity))
        const items = get().items
        const existingIndex = items.findIndex(
          (i) => i.product.id === product.id
        )

        if (existingIndex > -1) {
          const updated = [...items]
          const newQty = Math.min(10, updated[existingIndex].quantity + safeQty)
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: newQty,
          }
          set({ items: updated })
        } else {
          set({ items: [...items, { product, quantity: safeQty }] })
        }
      },

      removeItem: (productId: number) => {
        set({ items: get().items.filter((i) => i.product.id !== productId) })
      },

      updateQuantity: (productId: number, quantity: number) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }
        const safeQty = Math.min(10, quantity)
        set({
          items: get().items.map((i) =>
            i.product.id === productId ? { ...i, quantity: safeQty } : i
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      setHydrated: (state: boolean) => set({ isHydrated: state }),
    }),
    {
      name: "fakestore-cart-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true)
      },
    }
  )
)
