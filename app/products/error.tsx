"use client"

import { useEffect } from "react"
import { ErrorMessage } from "@/components/common/error-message"

export default function ProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Products route error:", error)
  }, [error])

  return (
    <div className="container mx-auto px-4 py-16 sm:px-6">
      <ErrorMessage
        title="Unable to load products"
        message={
          error.message ||
          "An unexpected error occurred while fetching products. Please try again."
        }
        onRetry={() => reset()}
      />
    </div>
  )
}
