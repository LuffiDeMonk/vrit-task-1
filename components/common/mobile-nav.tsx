"use client"

import React, { Suspense, useState } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import {
  Menu,
  ShoppingBag,
  Package,
  Tv,
  Gem,
  Shirt,
  Sparkles,
  ShoppingCart,
  ChevronRight,
} from "lucide-react"
import { Drawer } from "@/components/shared/drawer"
import { Button } from "@/components/shared/button"
import { useCart } from "@/hooks/use-cart"
import { cn } from "@/lib/utils"

const CATEGORIES = [
  {
    name: "Electronics",
    slug: "electronics",
    icon: Tv,
  },
  {
    name: "Jewelery",
    slug: "jewelery",
    icon: Gem,
  },
  {
    name: "Men's Clothing",
    slug: "men's clothing",
    icon: Shirt,
  },
  {
    name: "Women's Clothing",
    slug: "women's clothing",
    icon: Sparkles,
  },
]

function MobileNavContent() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get("category")

  const { totalItems, isHydrated: cartHydrated } = useCart()

  const isAllProducts = pathname === "/products" && !currentCategory
  const isCart = pathname === "/cart"

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="size-9 cursor-pointer md:hidden"
        aria-label="Open mobile navigation menu"
      >
        <Menu className="size-5 text-foreground" />
      </Button>

      <Drawer
        open={open}
        onClose={handleClose}
        placement="right"
        width={320}
        title={
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
              <ShoppingBag className="size-4" />
            </div>
            <span className="font-bold tracking-tight text-foreground">
              FakeStore{" "}
              <span className="font-normal text-muted-foreground">Direct</span>
            </span>
          </div>
        }
        footer={
          <div className="flex w-full items-center justify-center text-xs text-muted-foreground">
            <span>© 2026 FakeStore Direct</span>
          </div>
        }
      >
        <div className="flex flex-col gap-6 py-2">
          {/* Main Menu Links */}
          <div className="flex flex-col gap-1">
            <p className="px-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Main Menu
            </p>

            <Link
              href="/products"
              onClick={handleClose}
              className={cn(
                "flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted",
                isAllProducts
                  ? "bg-primary/10 font-semibold text-primary"
                  : "text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <Package className="size-4 opacity-75" />
                <span>All Products</span>
              </div>
              <ChevronRight className="size-4 opacity-40" />
            </Link>

            <Link
              href="/cart"
              onClick={handleClose}
              className={cn(
                "flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted",
                isCart
                  ? "bg-primary/10 font-semibold text-primary"
                  : "text-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="size-4 opacity-75" />
                <span>Shopping Cart</span>
              </div>
              {cartHydrated && totalItems > 0 ? (
                <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                  {totalItems}
                </span>
              ) : (
                <ChevronRight className="size-4 opacity-40" />
              )}
            </Link>
          </div>

          {/* Categories */}
          <div className="flex flex-col gap-1">
            <p className="px-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Categories
            </p>

            {CATEGORIES.map((cat) => {
              const Icon = cat.icon
              const isActive =
                pathname === "/products" && currentCategory === cat.slug

              return (
                <Link
                  key={cat.slug}
                  href={`/products?category=${encodeURIComponent(cat.slug)}`}
                  onClick={handleClose}
                  className={cn(
                    "flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted",
                    isActive
                      ? "bg-primary/10 font-semibold text-primary"
                      : "text-foreground"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="size-4 opacity-75" />
                    <span>{cat.name}</span>
                  </div>
                  <ChevronRight className="size-4 opacity-40" />
                </Link>
              )
            })}
          </div>
        </div>
      </Drawer>
    </>
  )
}

export function MobileNav() {
  return (
    <Suspense
      fallback={
        <Button
          variant="ghost"
          size="icon"
          className="size-9 md:hidden"
          aria-label="Open mobile navigation menu"
          disabled
        >
          <Menu className="size-5 text-muted-foreground" />
        </Button>
      }
    >
      <MobileNavContent />
    </Suspense>
  )
}
