import React from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  rate: number
  count?: number
  size?: "sm" | "md" | "lg"
  className?: string
  showText?: boolean
}

export function StarRating({
  rate,
  count,
  size = "sm",
  className,
  showText = true,
}: StarRatingProps) {
  const normalizedRate = Math.max(0, Math.min(5, rate || 0))
  const fullStars = Math.floor(normalizedRate)
  const hasHalfStar =
    normalizedRate - fullStars >= 0.4 && normalizedRate - fullStars < 0.9
  const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0))

  const sizeClasses = {
    sm: "size-3.5",
    md: "size-4",
    lg: "size-5",
  }

  const textClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }

  return (
    <div
      className={cn("inline-flex items-center gap-1.5", className)}
      aria-label={`Rating: ${normalizedRate} out of 5 stars`}
    >
      <div className="flex items-center text-amber-500">
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star
            key={`full-${i}`}
            className={cn(sizeClasses[size], "fill-amber-500 stroke-amber-500")}
          />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star
              className={cn(
                sizeClasses[size],
                "stroke-muted-foreground/40 text-muted-foreground/20"
              )}
            />
            <div className="absolute inset-0 w-[50%] overflow-hidden">
              <Star
                className={cn(
                  sizeClasses[size],
                  "fill-amber-500 stroke-amber-500"
                )}
              />
            </div>
          </div>
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star
            key={`empty-${i}`}
            className={cn(
              sizeClasses[size],
              "stroke-muted-foreground/30 text-muted/20"
            )}
          />
        ))}
      </div>

      {showText && (
        <span
          className={cn(
            "font-medium tracking-tight text-foreground/80",
            textClasses[size]
          )}
        >
          {normalizedRate.toFixed(1)}
          {count !== undefined && (
            <span className="ml-1 font-normal text-muted-foreground">
              ({count})
            </span>
          )}
        </span>
      )}
    </div>
  )
}
