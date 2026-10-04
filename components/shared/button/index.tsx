import {
  Children,
  isValidElement,
  type ButtonHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react"
import type { VariantProps } from "class-variance-authority"
import {
  Button as ShadcnButton,
  buttonVariants,
} from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

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
  if (!isValidElement(element)) return false
  if (element.type === "svg") return true

  const type = element.type as any
  const name =
    typeof type === "function"
      ? type.displayName || type.name || ""
      : typeof type === "object" && type !== null
        ? type.displayName || ""
        : ""

  if (/icon|spinner/i.test(name)) return true

  const props = element.props as Record<string, any> | undefined
  if (!props) return false

  return (
    Boolean(props["data-icon"]) ||
    (typeof props.className === "string" &&
      (props.className.includes("lucide") || props.className.includes("icon")))
  )
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
      const childrenArray = Children.toArray(children)
      let replaced = false

      const processed = childrenArray.map((child, idx) => {
        if (!replaced && isIconElement(child)) {
          replaced = true
          const childProps = (child as ReactElement).props as Record<
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
            : childrenArray.length > 1
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
