"use client"

import { useId } from "react"

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../../../components/ui/input-group"
import { Label } from "../label"
import { cn } from "../../../lib/utils"

import type { ChangeEvent, ComponentProps, ReactNode } from "react"

export interface InputProps extends ComponentProps<typeof InputGroupInput> {
  label?: ReactNode
  labelClassName?: string
  labelVariant?: "default" | "uppercase" | "muted"
  error?: string
  helperText?: string
  startIcon?: ReactNode
  endIcon?: ReactNode
  preventSqlInjection?: boolean
  sqlInjectionPatterns?: RegExp[]
}

const DEFAULT_SQL_PATTERNS: RegExp[] = [
  /\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|TRUNCATE|EXEC|EXECUTE)\b/gi,
  /--|\/\*|\*\/|;/g,
  /\b(OR|AND)\b\s+['"]?[^'"]*['"]?\s*=\s*['"]?[^'"]*['"]?/gi,
]

export function sanitizeSqlInjection(
  value: string,
  extraPatterns: RegExp[] = []
): string {
  return [...DEFAULT_SQL_PATTERNS, ...extraPatterns].reduce(
    (result, pattern) => result.replace(pattern, ""),
    value
  )
}

export function Input({
  className,
  type = "text",
  label,
  labelClassName,
  labelVariant = "default",
  error,
  helperText,
  startIcon,
  endIcon,
  preventSqlInjection = false,
  sqlInjectionPatterns = [],
  onChange,
  id,
  ...props
}: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const errorId = error ? `${inputId}-error` : undefined
  const helperId = helperText ? `${inputId}-helper` : undefined

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (type === "number" && /[eE]/.test(event.target.value)) {
      event.target.value = event.target.value.replace(/[eE]/g, "")
    }

    if (preventSqlInjection) {
      const sanitized = sanitizeSqlInjection(
        event.target.value,
        sqlInjectionPatterns
      )
      if (sanitized !== event.target.value) {
        event.target.value = sanitized
      }
    }

    onChange?.(event)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (type === "number") {
      if (event.key === "e" || event.key === "E" || event.key === "+") {
        event.preventDefault()
      }
      if (
        props.min !== undefined &&
        Number(props.min) >= 0 &&
        event.key === "-"
      ) {
        event.preventDefault()
      }
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault()
      }
    }
    props.onKeyDown?.(event)
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    if (type === "number") {
      const text = event.clipboardData.getData("text")
      const isNonNegative = props.min !== undefined && Number(props.min) >= 0
      const invalidRegex = isNonNegative ? /[eE+-]/ : /[eE+]/
      if (invalidRegex.test(text)) {
        event.preventDefault()
      }
    }
    props.onPaste?.(event)
  }

  const controlProps = {
    id: inputId,
    type,
    "aria-invalid": error ? true : undefined,
    "aria-describedby":
      [errorId, helperId].filter(Boolean).join(" ") || undefined,
    onChange: handleChange,
    onKeyDown: handleKeyDown,
    onPaste: handlePaste,
    ...props,
  }

  return (
    <div className="w-full">
      {label && (
        <Label
          htmlFor={inputId}
          variant={labelVariant}
          className={cn("mb-2 block", labelClassName)}
        >
          {label}
        </Label>
      )}

      <InputGroup className={className}>
        {startIcon && (
          <InputGroupAddon align="inline-start">{startIcon}</InputGroupAddon>
        )}
        <InputGroupInput {...controlProps} />
        {endIcon && (
          <InputGroupAddon align="inline-end">{endIcon}</InputGroupAddon>
        )}
      </InputGroup>

      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-1.5 text-xs font-medium text-destructive"
        >
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={helperId} className="mt-1.5 text-xs text-muted-foreground">
          {helperText}
        </p>
      )}
    </div>
  )
}
