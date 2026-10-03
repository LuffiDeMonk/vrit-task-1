import * as React from "react"
import type { ButtonHTMLAttributes, ReactNode } from "react"
import type { VariantProps } from "class-variance-authority"
import {
  Button as ShadcnButton,
  buttonVariants,
} from "../../../components/ui/button"
import { Spinner } from "../../../components/ui/spinner"
import { cn } from "../../../lib/utils"

export interface ButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  asChild?: boolean
  icon?: ReactNode
  iconPosition?: "left" | "right"
  startIcon?: ReactNode
  endIcon?: ReactNode
  children?: ReactNode
}

function isIconElement(element: ReactNode): boolean {
  if (!React.isValidElement(element)) return false
  if (element.type === "svg") return true

  const anyType = element.type as any
  if (typeof anyType === "string") return false

  if (typeof anyType === "function") {
    const name = anyType.displayName || anyType.name || ""
    if (
      name.toLowerCase().includes("icon") ||
      name.toLowerCase().includes("spinner")
    ) {
      return true
    }
  }

  if (typeof anyType === "object" && anyType !== null) {
    const name = anyType.displayName || anyType.name || ""
    if (name && typeof name === "string") {
      return true
    }
  }

  if (element.props && typeof element.props === "object") {
    const p = element.props as Record<string, any>
    if (
      p["data-icon"] ||
      p["aria-hidden"] === true ||
      p["aria-hidden"] === "true"
    ) {
      return true
    }
    if (
      typeof p.className === "string" &&
      (p.className.includes("lucide") || p.className.includes("icon"))
    ) {
      return true
    }
  }

  return false
}

function flattenChildren(children: ReactNode): ReactNode[] {
  const result: ReactNode[] = []
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === React.Fragment) {
      result.push(...flattenChildren((child.props as any).children))
    } else if (
      child !== null &&
      child !== undefined &&
      typeof child !== "boolean"
    ) {
      result.push(child)
    }
  })
  return result
}

export function Button({
  className,
  variant = "default",
  size = "default",
  loading = false,
  disabled,
  asChild = false,
  icon,
  iconPosition = "left",
  startIcon,
  endIcon,
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading

  const leftIcon = startIcon || (iconPosition === "left" ? icon : undefined)
  const rightIcon = endIcon || (iconPosition === "right" ? icon : undefined)
  const hasIconProp = Boolean(leftIcon || rightIcon)

  if (asChild) {
    return (
      <ShadcnButton
        variant={variant}
        size={size}
        className={className}
        disabled={isDisabled}
        aria-busy={loading}
        asChild
        {...props}
      >
        {children}
      </ShadcnButton>
    )
  }

  const renderContent = () => {
    if (hasIconProp) {
      return (
        <>
          {leftIcon &&
            (loading &&
            (leftIcon || (!rightIcon && iconPosition === "left")) ? (
              <Spinner className={cn("size-4 shrink-0", children && "mr-2")} />
            ) : (
              <span
                className={cn(
                  "inline-flex shrink-0 items-center justify-center",
                  children && "mr-2"
                )}
              >
                {leftIcon}
              </span>
            ))}
          {children}
          {rightIcon &&
            (loading && iconPosition === "right" ? (
              <Spinner className={cn("size-4 shrink-0", children && "ml-2")} />
            ) : (
              <span
                className={cn(
                  "inline-flex shrink-0 items-center justify-center",
                  children && "ml-2"
                )}
              >
                {rightIcon}
              </span>
            ))}
        </>
      )
    }

    if (loading) {
      const flat = flattenChildren(children)
      let replaced = false

      const processed = flat.map((child, idx) => {
        if (!replaced && isIconElement(child)) {
          replaced = true
          const childProps = (child as React.ReactElement).props as Record<
            string,
            any
          >
          const childClassName =
            typeof childProps?.className === "string"
              ? childProps.className
              : ""
          const marginMatch = childClassName.match(/\bm[rlebxyts]-\S+/g)
          const marginClass = marginMatch
            ? marginMatch.join(" ")
            : flat.length > 1
              ? "mr-2"
              : ""
          return (
            <Spinner
              key={`spinner-${idx}`}
              className={cn("size-4 shrink-0", marginClass)}
            />
          )
        }
        return child
      })

      if (replaced) {
        return processed
      }

      return (
        <>
          <Spinner className={cn("size-4 shrink-0", children && "mr-2")} />
          {children}
        </>
      )
    }

    return children
  }

  return (
    <ShadcnButton
      variant={variant}
      size={size}
      className={className}
      disabled={isDisabled}
      aria-busy={loading}
      {...props}
    >
      {renderContent()}
    </ShadcnButton>
  )
}

export { buttonVariants }
