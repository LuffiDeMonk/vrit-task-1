"use client"

import {
  Fragment,
  isValidElement,
  type ReactNode,
  type ComponentType,
  type MouseEvent,
  type ComponentPropsWithoutRef,
} from "react"
import { ChevronRightIcon } from "lucide-react"
import {
  Breadcrumb as ShadcnBreadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from "@/components/ui/breadcrumb"
import { cn } from "@/lib/utils"

export interface BreadcrumbItemType {
  label: ReactNode
  href?: string
  onClick?: (event: MouseEvent<HTMLElement>) => void
  icon?: ReactNode | ComponentType<{ className?: string }>
  isCurrentPage?: boolean
  target?: string
  rel?: string
  className?: string
  linkClassName?: string
}

export interface BreadcrumbProps extends Omit<
  ComponentPropsWithoutRef<"nav">,
  "children"
> {
  items: BreadcrumbItemType[]
  icon?: ReactNode | ComponentType<{ className?: string }>
  separatorIcon?: ReactNode | ComponentType<{ className?: string }>
  maxItems?: number
  itemsBeforeCollapse?: number
  itemsAfterCollapse?: number
  listClassName?: string
}

function resolveIcon(
  iconProp?: ReactNode | ComponentType<{ className?: string }>
): ReactNode {
  if (!iconProp) return null
  if (isValidElement(iconProp)) return iconProp
  if (typeof iconProp === "function") {
    const IconComponent = iconProp as ComponentType<{
      className?: string
    }>
    return <IconComponent className="size-3.5" />
  }
  return iconProp as ReactNode
}

export function Breadcrumb({
  items,
  icon,
  separatorIcon,
  maxItems,
  itemsBeforeCollapse = 1,
  itemsAfterCollapse = 1,
  className,
  listClassName,
  ...props
}: BreadcrumbProps) {
  const resolvedSeparator = resolveIcon(separatorIcon) ?? resolveIcon(icon) ?? (
    <ChevronRightIcon className="size-3.5" />
  )

  const renderItemContent = (item: BreadcrumbItemType, index: number) => {
    const isLast = index === items.length - 1
    const isCurrent = item.isCurrentPage ?? isLast
    const itemIcon = resolveIcon(item.icon)

    if (isCurrent) {
      return (
        <BreadcrumbPage
          className={cn(
            "inline-flex items-center gap-1.5 font-medium text-foreground",
            item.linkClassName
          )}
        >
          {itemIcon}
          <span>{item.label}</span>
        </BreadcrumbPage>
      )
    }

    if (item.href || item.onClick) {
      return (
        <BreadcrumbLink
          href={item.href}
          onClick={item.onClick}
          target={item.target}
          rel={item.rel}
          className={cn(
            "inline-flex cursor-pointer items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground",
            item.linkClassName
          )}
        >
          {itemIcon}
          <span>{item.label}</span>
        </BreadcrumbLink>
      )
    }

    return (
      <BreadcrumbPage
        className={cn(
          "inline-flex items-center gap-1.5 text-muted-foreground",
          item.linkClassName
        )}
      >
        {itemIcon}
        <span>{item.label}</span>
      </BreadcrumbPage>
    )
  }

  const shouldCollapse = Boolean(
    maxItems &&
    items.length > maxItems &&
    itemsBeforeCollapse + itemsAfterCollapse < items.length
  )

  if (shouldCollapse) {
    const startItems = items.slice(0, itemsBeforeCollapse)
    const endItems = items.slice(items.length - itemsAfterCollapse)
    const startIndexOffset = items.length - itemsAfterCollapse

    return (
      <ShadcnBreadcrumb
        data-slot="shared-breadcrumb"
        className={cn("font-sans", className)}
        {...props}
      >
        <BreadcrumbList className={listClassName}>
          {startItems.map((item, idx) => (
            <Fragment key={item.href ?? `${item.label}-${idx}`}>
              <BreadcrumbItem className={item.className}>
                {renderItemContent(item, idx)}
              </BreadcrumbItem>
              <BreadcrumbSeparator>{resolvedSeparator}</BreadcrumbSeparator>
            </Fragment>
          ))}

          <BreadcrumbItem>
            <BreadcrumbEllipsis />
          </BreadcrumbItem>
          <BreadcrumbSeparator>{resolvedSeparator}</BreadcrumbSeparator>

          {endItems.map((item, idx) => {
            const actualIndex = startIndexOffset + idx
            const isLast = idx === endItems.length - 1
            return (
              <Fragment key={item.href ?? `${item.label}-${actualIndex}`}>
                <BreadcrumbItem className={item.className}>
                  {renderItemContent(item, actualIndex)}
                </BreadcrumbItem>
                {!isLast && (
                  <BreadcrumbSeparator>{resolvedSeparator}</BreadcrumbSeparator>
                )}
              </Fragment>
            )
          })}
        </BreadcrumbList>
      </ShadcnBreadcrumb>
    )
  }

  return (
    <ShadcnBreadcrumb
      data-slot="shared-breadcrumb"
      className={cn("font-sans", className)}
      {...props}
    >
      <BreadcrumbList className={listClassName}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <Fragment key={item.href ?? `${item.label}-${index}`}>
              <BreadcrumbItem className={item.className}>
                {renderItemContent(item, index)}
              </BreadcrumbItem>
              {!isLast && (
                <BreadcrumbSeparator>{resolvedSeparator}</BreadcrumbSeparator>
              )}
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </ShadcnBreadcrumb>
  )
}

export default Breadcrumb

export {
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
