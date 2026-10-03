"use client"

import React from "react"
import Link from "next/link"
import { LogIn, LogOut, ShoppingCart, Package, ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { buttonVariants } from "@/components/shared/button"
import { Avatar } from "@/components/shared/avatar"
import { Dropdown } from "@/components/shared/dropdown"
import { cn } from "@/lib/utils"

export function UserMenu() {
  const router = useRouter()
  const { user, isAuthenticated, isHydrated, logout } = useAuth()

  if (!isHydrated) {
    return <div className="h-8 w-16 animate-pulse rounded-md bg-muted/40" />
  }

  if (isAuthenticated && user) {
    return (
      <Dropdown
        placement="bottomRight"
        trigger={["click"]}
        menu={{
          items: [
            {
              key: "user-info",
              label: (
                <div className="flex flex-col px-0.5 py-0.5">
                  <span className="text-xs font-semibold text-foreground">
                    {user.username}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    Verified Member
                  </span>
                </div>
              ),
              disabled: true,
            },
            { type: "divider" },
            {
              key: "cart",
              label: "Shopping Cart",
              icon: <ShoppingCart className="size-4" />,
              onClick: () => router.push("/cart"),
            },
            {
              key: "products",
              label: "Browse Catalog",
              icon: <Package className="size-4" />,
              onClick: () => router.push("/products"),
            },
            { type: "divider" },
            {
              key: "logout",
              label: "Sign Out",
              icon: <LogOut className="size-4" />,
              danger: true,
              onClick: () => logout(),
            },
          ],
        }}
      >
        <button
          type="button"
          aria-label="User account menu"
          className="flex cursor-pointer items-center gap-2 rounded-full border border-border/50 bg-muted/60 p-1 pr-2.5 pl-1 text-xs font-medium text-foreground transition-colors outline-none hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Avatar
            name={user.username}
            className="size-6"
            fallbackClassName="bg-primary/15 text-primary text-[10px] font-bold"
          />
          <span className="max-w-[100px] truncate">{user.username}</span>
          <ChevronDown className="size-3 text-muted-foreground" />
        </button>
      </Dropdown>
    )
  }

  return (
    <Link
      href="/login"
      className={cn(
        buttonVariants({ variant: "default", size: "sm" }),
        "h-8 gap-1.5 text-xs font-medium"
      )}
    >
      <LogIn className="size-3.5" />
      <span>Sign In</span>
    </Link>
  )
}
