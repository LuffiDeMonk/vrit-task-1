import type { HTMLAttributes, Ref } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border text-sm transition-all [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "border-border bg-card text-card-foreground",
        destructive:
          "border-destructive/30 bg-destructive/10 text-destructive dark:bg-destructive/15 [&>svg]:text-destructive",
        success:
          "border-green-200 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950/50 dark:text-green-300 [&>svg]:text-green-600 dark:[&>svg]:text-green-400",
        warning:
          "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-300 [&>svg]:text-amber-600 dark:[&>svg]:text-amber-400",
        info: "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300 [&>svg]:text-blue-600 dark:[&>svg]:text-blue-400",
      },
      size: {
        sm: "p-3 text-xs [&>svg]:size-3.5",
        default: "p-4 text-sm",
        lg: "p-5 text-base [&>svg]:size-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface AlertProps
  extends
    HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  ref?: Ref<HTMLDivElement>
}

export function Alert({
  className,
  variant = "default",
  size = "default",
  role,
  ref,
  ...props
}: AlertProps) {
  const defaultRole = variant === "destructive" ? "alert" : "status"

  return (
    <div
      ref={ref}
      role={role ?? defaultRole}
      data-slot="alert"
      className={cn(alertVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export interface AlertTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  ref?: Ref<HTMLHeadingElement>
}

export function AlertTitle({ className, ref, ...props }: AlertTitleProps) {
  return (
    <h5
      ref={ref}
      data-slot="alert-title"
      className={cn(
        "mb-1 leading-none font-semibold tracking-tight",
        className
      )}
      {...props}
    />
  )
}

export interface AlertDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  ref?: Ref<HTMLParagraphElement>
}

export function AlertDescription({
  className,
  ref,
  ...props }: AlertDescriptionProps) {
  return (
    <div
      ref={ref}
      data-slot="alert-description"
      className={cn("text-sm opacity-90 [&_p]:leading-relaxed", className)}
      {...props}
    />
  )
}

export { alertVariants }
