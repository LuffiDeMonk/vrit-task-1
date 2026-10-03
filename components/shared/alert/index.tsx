"use client"

import * as React from "react"
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react"
import {
  Alert as ShadcnAlert,
  AlertDescription,
  AlertTitle,
  alertVariants,
  type AlertProps as ShadcnAlertProps,
} from "../../ui/alert"
import { cn } from "../../../lib/utils"
import { Button } from "../button"

export interface AlertProps extends ShadcnAlertProps {
  title?: string
  description?: string
  icon?: React.ReactNode
  onClose?: () => void
  dismissible?: boolean
}

const defaultIcons: Record<string, React.ReactNode> = {
  default: null,
  destructive: <AlertCircle className="size-4 shrink-0" aria-hidden="true" />,
  success: <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />,
  warning: <AlertTriangle className="size-4 shrink-0" aria-hidden="true" />,
  info: <Info className="size-4 shrink-0" aria-hidden="true" />,
}

export function Alert({
  title,
  description,
  icon,
  onClose,
  dismissible = false,
  variant = "default",
  size = "default",
  children,
  className,
  ref,
  ...props
}: AlertProps) {
  const [dismissed, setDismissed] = React.useState(false)

  if (dismissed) {
    return null
  }

  const resolvedIcon =
    icon !== undefined ? icon : defaultIcons[variant ?? "default"]
  const showCloseButton = Boolean(dismissible)

  const handleClose = () => {
    setDismissed(true)
    onClose?.()
  }

  return (
    <ShadcnAlert
      ref={ref}
      variant={variant}
      size={size}
      className={cn(resolvedIcon && "flex items-start gap-3", className)}
      {...props}
    >
      {resolvedIcon && (
        <div className="mt-0.5 shrink-0 text-current">{resolvedIcon}</div>
      )}
      <div className="min-w-0 flex-1">
        {title && <AlertTitle>{title}</AlertTitle>}
        {description && <AlertDescription>{description}</AlertDescription>}
        {children}
      </div>
      {showCloseButton && (
        <Button
          type="button"
          aria-label="Dismiss alert"
          onClick={handleClose}
          variant={"ghost"}
          size={"icon"}
          className="hover:bg-transparent"
        >
          <X className="size-4" />
        </Button>
      )}
    </ShadcnAlert>
  )
}

export { AlertTitle, AlertDescription, alertVariants }
export default Alert
