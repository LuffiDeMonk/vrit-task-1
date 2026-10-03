"use client"

import * as React from "react"
import { ChevronDown, X } from "lucide-react"

import {
  Combobox,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
} from "../../ui/combobox"

import { Badge } from "../badge"
import { Label } from "../label"
import { cn } from "../../../lib/utils"

export interface SelectOption {
  label: string
  value: string
  disabled?: boolean
}

export type SelectValue = string | null

export interface BaseSelectProps {
  options: SelectOption[]
  placeholder?: string
  label?: string
  disabled?: boolean
  className?: string
  searchable?: boolean
  error?: string
  helperText?: string
}

export interface SingleSelectProps extends BaseSelectProps {
  mode?: "single"
  multiple?: false
  value?: SelectValue
  onValueChange?: (value: SelectValue) => void
  maxSelected?: never
}

export interface MultiSelectProps extends BaseSelectProps {
  mode: "multiple"
  multiple?: true
  value?: string[]
  onValueChange?: (value: string[]) => void
  maxSelected?: number
}

export type SelectProps = SingleSelectProps | MultiSelectProps

export function Select(props: SelectProps) {
  const isMultiple =
    props.mode === "multiple" ||
    ("multiple" in props &&
      Boolean((props as unknown as { multiple?: boolean }).multiple))

  const multiProps = isMultiple
    ? (props as unknown as MultiSelectProps)
    : undefined
  const singleProps = !isMultiple
    ? (props as unknown as SingleSelectProps)
    : undefined

  const {
    options,
    placeholder = isMultiple ? "Select items" : "Select an option",
    label,
    disabled = false,
    className,
    searchable = false,
    error,
    helperText,
  } = props

  const anchorRef = useComboboxAnchor()
  const [searchQuery, setSearchQuery] = React.useState("")

  const filteredOptions = React.useMemo(() => {
    if (!searchable || !searchQuery) return options
    return options.filter((o) =>
      o.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [options, searchable, searchQuery])

  const multiValues =
    isMultiple && Array.isArray(props.value) ? props.value : []

  const selectedOptions = isMultiple
    ? options.filter((opt) => multiValues.includes(opt.value))
    : []

  const handleRemove = (valToRemove: string) => {
    if (!isMultiple || !multiProps?.onValueChange) return
    const nextValues = multiValues.filter((v) => v !== valToRemove)
    multiProps.onValueChange(nextValues)
  }

  const handleClearAll = () => {
    if (!isMultiple || !multiProps?.onValueChange) return
    multiProps.onValueChange([])
  }

  const comboboxValue = isMultiple ? multiValues : (singleProps?.value ?? "")

  const handleValueChange = (newVal: any) => {
    if (isMultiple) {
      const arr = Array.isArray(newVal) ? newVal : []
      const max = multiProps?.maxSelected
      if (max && arr.length > max) return
      multiProps?.onValueChange?.(arr)
    } else {
      const singleVal = newVal === "" || newVal === undefined ? null : newVal
      singleProps?.onValueChange?.(singleVal)
    }
  }

  return (
    <div className="flex w-full flex-col">
      {label && <Label className="mb-2">{label}</Label>}

      <Combobox
        multiple={isMultiple as any}
        value={comboboxValue as any}
        onValueChange={handleValueChange as any}
        items={filteredOptions}
      >
        {isMultiple ? (
          <ComboboxChips
            ref={anchorRef}
            className={cn(
              "flex min-h-10 w-full items-center justify-between gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-left text-sm shadow-2xs transition-colors",
              "focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/50 focus-within:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error &&
                "border-destructive focus-within:border-destructive focus-within:ring-destructive/20",
              className
            )}
          >
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.5">
              {selectedOptions.map((opt) => (
                <Badge key={opt.value} variant="secondary" className="gap-1">
                  {opt.label}
                  <button
                    type="button"
                    aria-label={`Remove ${opt.label}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemove(opt.value)
                    }}
                    className="ml-1 cursor-pointer rounded-sm opacity-50 hover:opacity-100 focus:ring-2 focus:ring-ring focus:outline-none"
                    disabled={disabled}
                  >
                    <X className="size-3" />
                  </button>
                </Badge>
              ))}
              <ComboboxChipsInput
                placeholder={selectedOptions.length === 0 ? placeholder : ""}
                disabled={disabled}
              />
            </div>
            <div className="flex shrink-0 items-center gap-1">
              {selectedOptions.length > 0 && (
                <button
                  type="button"
                  aria-label="Clear all selections"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClearAll()
                  }}
                  className="cursor-pointer rounded-sm p-0.5 opacity-50 hover:opacity-100 focus:ring-2 focus:ring-ring focus:outline-none"
                  disabled={disabled}
                >
                  <X className="size-4" />
                </button>
              )}
              <ChevronDown className="pointer-events-none size-4 text-muted-foreground" />
            </div>
          </ComboboxChips>
        ) : (
          <ComboboxTrigger
            className={cn(
              "flex min-h-10 w-full items-center justify-between gap-2 rounded-lg border border-input bg-background px-3 py-2 text-left text-sm text-foreground",
              "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error &&
                "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/20",
              className
            )}
            disabled={disabled}
          >
            <ComboboxValue placeholder={placeholder}>
              {(val: any) => {
                const targetVal =
                  val !== undefined && val !== null && val !== ""
                    ? val
                    : singleProps?.value
                const opt = options.find(
                  (o) => String(o.value) === String(targetVal)
                )
                if (!opt) {
                  return (
                    <span className="truncate text-xs font-normal text-muted-foreground sm:text-sm">
                      {placeholder}
                    </span>
                  )
                }
                return (
                  <span className="truncate text-xs font-medium text-foreground sm:text-sm">
                    {opt.label}
                  </span>
                )
              }}
            </ComboboxValue>
          </ComboboxTrigger>
        )}

        <ComboboxContent anchor={isMultiple ? anchorRef : undefined}>
          {searchable && !isMultiple && (
            <ComboboxInput
              placeholder={placeholder}
              showTrigger={false}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          )}
          <ComboboxList>
            <ComboboxEmpty>No options found</ComboboxEmpty>
            {filteredOptions.map((opt) => (
              <ComboboxItem
                key={opt.value}
                value={opt.value}
                disabled={opt.disabled}
              >
                {opt.label}
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      {error && (
        <p role="alert" className="mt-1.5 text-xs font-medium text-destructive">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="mt-1.5 text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  )
}

export default Select
