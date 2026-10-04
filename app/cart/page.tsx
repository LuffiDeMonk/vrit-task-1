import { CartView } from "@/app/cart/_components/cart-view"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shopping Cart | FakeStore Direct",
  description: "Review and manage the items in your shopping cart.",
  robots: {
    index: false,
    follow: false,
  },
}

export default function CartPage() {
  return <CartView />
}
