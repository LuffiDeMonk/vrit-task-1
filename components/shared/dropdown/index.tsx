"use client"

import {
  useMemo,
  isValidElement,
  type ReactNode,
  type ReactElement,
  type MouseEvent,
  type MouseEventHandler,
} from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button, type ButtonProps } from "@/components/shared/button"
import { Avatar, type AvatarProps } from "@/components/shared/avatar"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

export type DropdownPlacement =
  | "bottom"
  | "bottomLeft"
  | "bottomRight"
  | "bottomCenter"
  | "top"
  | "topLeft"
  | "topRight"
  | "topCenter"

export type DropdownTriggerMode = "click" | "hover"
export type DropdownTriggerType = DropdownTriggerMode

export interface DropdownMenuItemType {
  key: string
  label: ReactNode
  icon?: ReactNode
  disabled?: boolean
  danger?: boolean
  extra?: ReactNode
  children?: DropdownItemType[]
  onClick?: (info: {
    key: string
    domEvent: MouseEvent<HTMLElement>
  }) => void
  className?: string
  title?: string
  href?: string
}

export interface DropdownMenuDividerType {
  type: "divider"
  key?: string
  className?: string
}

export interface DropdownMenuGroupType {
  type: "group"
  key?: string
  label?: ReactNode
  children: DropdownItemType[]
  className?: string
}

export type DropdownItemType =
  DropdownMenuItemType | DropdownMenuDividerType | DropdownMenuGroupType

export interface DropdownMenuProps {
  items: DropdownItemType[]
  onClick?: (info: {
    key: string
    domEvent: MouseEvent<HTMLElement>
  }) => void
  className?: string
}

export interface DropdownProps {
  menu: DropdownMenuProps
  avatar?: AvatarProps | ReactElement
  trigger?: DropdownTriggerMode[]
  placement?: DropdownPlacement
  disabled?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  dropdownRender?: (originNode: ReactNode) => ReactNode
  overlayClassName?: string
  children?: ReactNode
  className?: string
  nativeButton?: boolean
}

function getPlacementProps(placement: DropdownPlacement = "bottomLeft"): {
  side: "bottom" | "top"
  align: "start" | "center" | "end"
} {
  switch (placement) {
    case "bottom":
    case "bottomCenter":
      return { side: "bottom", align: "center" }
    case "bottomRight":
      return { side: "bottom", align: "end" }
    case "bottomLeft":
      return { side: "bottom", align: "start" }
    case "top":
    case "topCenter":
      return { side: "top", align: "center" }
    case "topRight":
      return { side: "top", align: "end" }
    case "topLeft":
      return { side: "top", align: "start" }
    default:
      return { side: "bottom", align: "start" }
  }
}

export function Dropdown({
  menu,
  avatar,
  trigger = ["click"],
  placement = "bottomLeft",
  disabled = false,
  open,
  onOpenChange,
  dropdownRender,
  overlayClassName,
  children,
  className,
  nativeButton: nativeButtonProp,
}: DropdownProps) {
  const { side, align } = getPlacementProps(placement)
  const isHover = trigger.includes("hover")

  let triggerElement: ReactNode = children
  if (avatar) {
    if (isValidElement(avatar)) {
      triggerElement = avatar
    } else {
      triggerElement = <Avatar {...avatar} />
    }
  }

  const isElement = isValidElement(triggerElement)

  const isNativeButton = useMemo(() => {
    if (nativeButtonProp !== undefined) return nativeButtonProp
    if (avatar) return false
    if (!isElement) {
      return true
    }
    const elem = triggerElement as ReactElement
    const type = elem.type
    if (typeof type === "string") {
      return type === "button"
    }
    const name =
      (type as any)?.displayName ||
      (type as any)?.name ||
      (type as any)?._context?.displayName ||
      ""
    const lower = name.toLowerCase()
    if (
      lower.includes("avatar") ||
      lower.includes("icon") ||
      lower.includes("svg") ||
      lower.includes("card") ||
      lower.includes("badge") ||
      lower.includes("tag")
    ) {
      return false
    }
    return true
  }, [nativeButtonProp, avatar, isElement, triggerElement])

  const renderItems = (items: DropdownItemType[]) => {
    return items.map((item, index) => {
      if ("type" in item && item.type === "divider") {
        return (
          <DropdownMenuSeparator
            key={item.key || `divider-${index}`}
            className={item.className}
          />
        )
      }

      if ("type" in item && item.type === "group") {
        return (
          <DropdownMenuGroup
            key={item.key || `group-${index}`}
            className={item.className}
          >
            {item.label && <DropdownMenuLabel>{item.label}</DropdownMenuLabel>}
            {renderItems(item.children)}
          </DropdownMenuGroup>
        )
      }

      const menuItem = item as DropdownMenuItemType

      if (menuItem.children && menuItem.children.length > 0) {
        return (
          <DropdownMenuSub key={menuItem.key}>
            <DropdownMenuSubTrigger
              disabled={menuItem.disabled}
              className={cn("cursor-pointer", menuItem.className)}
            >
              {menuItem.icon && (
                <span className="mr-1.5 inline-flex shrink-0 items-center justify-center">
                  {menuItem.icon}
                </span>
              )}
              <span className="grow">{menuItem.label}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className={overlayClassName}>
              {renderItems(menuItem.children)}
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        )
      }

      return (
        <DropdownMenuItem
          key={menuItem.key}
          data-key={menuItem.key}
          data-action={menuItem.key === "logout" ? "logout" : undefined}
          render={menuItem.href ? <a href={menuItem.href} /> : undefined}
          disabled={menuItem.disabled}
          variant={menuItem.danger ? "destructive" : "default"}
          className={cn("cursor-pointer", menuItem.className)}
          onClick={(domEvent) => {
            if (menuItem.disabled) return
            menuItem.onClick?.({ key: menuItem.key, domEvent })
            menu.onClick?.({ key: menuItem.key, domEvent })
          }}
        >
          {menuItem.icon && (
            <span className="mr-1.5 inline-flex shrink-0 items-center justify-center">
              {menuItem.icon}
            </span>
          )}
          <span className="grow">{menuItem.label}</span>
          {menuItem.extra && (
            <DropdownMenuShortcut>{menuItem.extra}</DropdownMenuShortcut>
          )}
        </DropdownMenuItem>
      )
    })
  }

  const menuNode = (
    <div className={cn("flex flex-col gap-0.5", menu.className)}>
      {renderItems(menu.items)}
    </div>
  )

  const content = dropdownRender ? dropdownRender(menuNode) : menuNode

  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger
        disabled={disabled}
        openOnHover={isHover}
        nativeButton={isNativeButton}
        className={cn("cursor-pointer select-none", className)}
        render={isElement ? (triggerElement as ReactElement) : undefined}
      >
        {!isElement ? triggerElement : undefined}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side={side}
        align={align}
        className={cn("min-w-40 p-1.5", overlayClassName)}
      >
        {content}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export interface DropdownButtonProps extends Omit<ButtonProps, "onClick"> {
  menu: DropdownMenuProps
  trigger?: DropdownTriggerMode[]
  placement?: DropdownPlacement
  icon?: ReactNode
  overlayClassName?: string
  dropdownRender?: (menuNode: ReactNode) => ReactNode
  onOpenChange?: (open: boolean) => void
  open?: boolean
  onClick?: MouseEventHandler<HTMLButtonElement>
}

export function DropdownButton({
  children,
  menu,
  trigger = ["click"],
  placement = "bottomRight",
  disabled = false,
  loading = false,
  onClick,
  icon,
  className,
  variant = "default",
  size = "default",
  open,
  onOpenChange,
  overlayClassName,
  dropdownRender,
  ...buttonProps
}: DropdownButtonProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg shadow-xs [&>button:first-child]:rounded-r-none [&>button:last-child]:rounded-l-none [&>button:last-child]:border-l [&>button:last-child]:border-l-foreground/15",
        className
      )}
    >
      <Button
        variant={variant}
        size={size}
        disabled={disabled}
        loading={loading}
        onClick={onClick}
        {...buttonProps}
      >
        {children}
      </Button>
      <Dropdown
        menu={menu}
        trigger={trigger}
        placement={placement}
        disabled={disabled || loading}
        open={open}
        onOpenChange={onOpenChange}
        overlayClassName={overlayClassName}
        dropdownRender={dropdownRender}
      >
        <Button
          variant={variant}
          size={size}
          disabled={disabled || loading}
          aria-label="Open menu"
          className="px-2"
        >
          {icon || <ChevronDown className="size-4" />}
        </Button>
      </Dropdown>
    </div>
  )
}

Dropdown.Button = DropdownButton
Dropdown.Trigger = DropdownMenuTrigger

export { DropdownMenuTrigger as DropdownTrigger }
