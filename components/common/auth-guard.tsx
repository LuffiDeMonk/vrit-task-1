"use client"

import React, { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Skeleton } from "@/components/ui/skeleton"

interface AuthGuardProps {
  children: React.ReactNode
  fallbackUrl?: string
}

export function AuthGuard({
  children,
  fallbackUrl = "/login",
}: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, isHydrated } = useAuth()

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      const redirectParam = encodeURIComponent(pathname)
      router.push(`${fallbackUrl}?redirect=${redirectParam}`)
    }
  }, [isAuthenticated, isHydrated, router, pathname, fallbackUrl])

  if (!isHydrated) {
    return (
      <div className="container mx-auto max-w-4xl space-y-6 px-4 py-12 sm:px-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto max-w-4xl space-y-6 px-4 py-12 sm:px-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  return <>{children}</>
}
