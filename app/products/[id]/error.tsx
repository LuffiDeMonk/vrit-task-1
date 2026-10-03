"use client"

import React, { useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, RefreshCw, AlertCircle } from "lucide-react"
import { Button, buttonVariants } from "@/components/shared/button"
import { cn } from "@/lib/utils"

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Product detail error:", error)
  }, [error])

  return (
    <div className="container mx-auto flex flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
      <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertCircle className="size-7" />
      </div>
      <h1 className="text-xl font-bold tracking-tight text-foreground">
        Unable to load product
      </h1>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {error.message ||
          "An error occurred while fetching details for this product."}
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Button
          variant="default"
          size="sm"
          onClick={() => reset()}
          className="gap-2"
        >
          <RefreshCw className="size-3.5" />
          <span>Try Again</span>
        </Button>
        <Link
          href="/products"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "gap-2"
          )}
        >
          <ArrowLeft className="size-3.5" />
          <span>All Products</span>
        </Link>
      </div>
    </div>
  )
}
