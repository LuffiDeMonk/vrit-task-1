"use client"

import type { ComponentProps, ReactNode } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Label as ShadcnLabel } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export const labelVariants = cva(
  "leading-none select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
  {
    variants: {
      variant: {
        default: "font-medium text-foreground",
        uppercase: "font-semibold tracking-wider text-foreground uppercase",
        muted: "font-medium text-muted-foreground",
        destructive: "font-medium text-destructive",
      },
      size: {
        xs: "text-xs",
        sm: "text-xs",
        default: "text-sm",
        lg: "text-base",
      },
    },
    compoundVariants: [
      {
        variant: "uppercase",
        size: "default",
        className: "text-xs",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface LabelProps
  extends
    ComponentProps<typeof ShadcnLabel>,
    VariantProps<typeof labelVariants> {
  required?: boolean
  optional?: boolean
  description?: ReactNode
}

export function Label({
  className,
  variant = "default",
  size = "default",
  required = false,
  optional = false,
  description,
  children,
  ref,
  ...props
}: LabelProps) {
  const labelContent = (
    <ShadcnLabel
      ref={ref}
      className={cn(labelVariants({ variant, size }), className)}
      {...props}
    >
      {children}
      {required && (
        <span
          className="ml-1 font-semibold text-destructive"
          aria-hidden="true"
        >
          *
        </span>
      )}
      {optional && (
        <span className="ml-1 text-xs font-normal tracking-normal text-muted-foreground normal-case">
          (optional)
        </span>
      )}
    </ShadcnLabel>
  )

  if (description) {
    return (
      <div className="space-y-1">
        {labelContent}
        <p className="text-xs font-normal text-muted-foreground">
          {description}
        </p>
      </div>
    )
  }

  return labelContent
}

export default Label
