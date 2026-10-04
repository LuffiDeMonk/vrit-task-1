import Link from "next/link"
import { ShoppingBag, ArrowRight } from "lucide-react"
import { buttonVariants } from "@/components/shared/button"
import { cn } from "@/lib/utils"

export function CartEmptyState() {
  return (
    <div className="my-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 p-8 text-center sm:p-14">
      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <ShoppingBag className="size-8" />
      </div>
      <h2 className="text-xl font-bold tracking-tight text-foreground">
        Your shopping cart is empty
      </h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        Looks like you haven&apos;t added any items to your cart yet. Explore
        our catalog to find products you like.
      </p>
      <div className="mt-6">
        <Link
          href="/products"
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "gap-2"
          )}
        >
          <span>Explore Catalog</span>
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  )
}
