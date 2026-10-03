import React from "react"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { HeaderNav } from "@/components/common/header-nav"
import { ThemeToggle } from "@/components/common/theme-toggle"
import { CartBadge } from "@/components/common/cart-badge"
import { UserMenu } from "@/components/common/user-menu"

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md transition-colors">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link
          href="/products"
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-foreground transition-opacity hover:opacity-90"
        >
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
            <ShoppingBag className="size-5" />
          </div>
          <span>
            FakeStore{" "}
            <span className="font-normal text-muted-foreground">Direct</span>
          </span>
        </Link>

        <HeaderNav />

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <CartBadge />
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
