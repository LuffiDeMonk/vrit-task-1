"use client"

import { Suspense } from "react"
import Link from "next/link"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { ChevronDown } from "lucide-react"
import { Dropdown } from "@/components/shared/dropdown"
import { cn } from "@/lib/utils"

function HeaderNavLinks() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get("category")

  const isAllProducts = pathname === "/products" && !currentCategory
  const isElectronics =
    pathname === "/products" && currentCategory === "electronics"
  const isJewelery = pathname === "/products" && currentCategory === "jewelery"

  return (
    <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
      <Link
        href="/products"
        className={cn(
          "transition-colors hover:text-foreground",
          isAllProducts
            ? "font-semibold text-foreground"
            : "text-muted-foreground"
        )}
      >
        All Products
      </Link>
      <Link
        href="/products?category=electronics"
        className={cn(
          "transition-colors hover:text-foreground",
          isElectronics
            ? "font-semibold text-foreground"
            : "text-muted-foreground"
        )}
      >
        Electronics
      </Link>
      <Link
        href="/products?category=jewelery"
        className={cn(
          "transition-colors hover:text-foreground",
          isJewelery ? "font-semibold text-foreground" : "text-muted-foreground"
        )}
      >
        Jewelery
      </Link>

      <Dropdown
        placement="bottomLeft"
        trigger={["click", "hover"]}
        menu={{
          items: [
            {
              key: "all",
              label: "All Categories",
              onClick: () => router.push("/products"),
            },
            { type: "divider" },
            {
              key: "electronics",
              label: "Electronics",
              onClick: () => router.push("/products?category=electronics"),
            },
            {
              key: "jewelery",
              label: "Jewelery",
              onClick: () => router.push("/products?category=jewelery"),
            },
            {
              key: "men-clothing",
              label: "Men's Clothing",
              onClick: () =>
                router.push("/products?category=men%27s%20clothing"),
            },
            {
              key: "women-clothing",
              label: "Women's Clothing",
              onClick: () =>
                router.push("/products?category=women%27s%20clothing"),
            },
          ],
        }}
      >
        <button
          type="button"
          aria-label="Browse categories menu"
          className={cn(
            "flex cursor-pointer items-center gap-1 transition-colors outline-none select-none hover:text-foreground",
            currentCategory && !isElectronics && !isJewelery
              ? "font-semibold text-foreground"
              : "text-muted-foreground"
          )}
        >
          <span>More</span>
          <ChevronDown className="size-3.5 opacity-70" />
        </button>
      </Dropdown>
    </nav>
  )
}

export function HeaderNav() {
  return (
    <Suspense
      fallback={
        <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
          <Link
            href="/products"
            className="transition-colors hover:text-foreground"
          >
            All Products
          </Link>
          <Link
            href="/products?category=electronics"
            className="transition-colors hover:text-foreground"
          >
            Electronics
          </Link>
          <Link
            href="/products?category=jewelery"
            className="transition-colors hover:text-foreground"
          >
            Jewelery
          </Link>
          <span className="flex items-center gap-1 opacity-60">
            More <ChevronDown className="size-3.5" />
          </span>
        </nav>
      }
    >
      <HeaderNavLinks />
    </Suspense>
  )
}
