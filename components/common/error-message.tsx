import React from "react"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/shared/button"

interface ErrorMessageProps {
  title?: string
  message?: string
  onRetry?: () => void
  className?: string
}

export function ErrorMessage({
  title = "Something went wrong",
  message = "Failed to load product information. Please check your connection and try again.",
  onRetry,
  className,
}: ErrorMessageProps) {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 p-6 text-center text-foreground md:p-10 ${
        className || ""
      }`}
    >
      <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertCircle className="size-6" />
      </div>
      <h3 className="text-base font-semibold text-destructive">{title}</h3>
      <p className="mt-1 max-w-md text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="mt-4 gap-1.5"
        >
          <RefreshCw className="size-3.5" />
          Try Again
        </Button>
      )}
    </div>
  )
}
