import React from "react"
import { PackageSearch } from "lucide-react"
import { Button } from "@/components/shared/button"

interface EmptyStateProps {
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  icon?: React.ReactNode
}

export function EmptyState({
  title = "No products found",
  description = "We couldn't find any products matching your current filters or search term.",
  actionLabel = "Clear all filters",
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 p-8 text-center md:p-12">
      <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        {icon || <PackageSearch className="size-7" />}
      </div>
      <h3 className="text-lg font-semibold tracking-tight text-foreground">
        {title}
      </h3>
      <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
        {description}
      </p>
      {onAction && (
        <div className="mt-6">
          <Button variant="outline" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  )
}
