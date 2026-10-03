"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { Trash2, Minus, Plus } from "lucide-react"
import { Button } from "@/components/shared/button"
import { Badge } from "@/components/shared/badge"
import { Tooltip } from "@/components/shared/tooltip"
import type { CartItem } from "@/types/cart"

interface CartItemRowProps {
  item: CartItem
  onUpdateQuantity: (productId: number, quantity: number) => void
  onRemove: (productId: number) => void
}

export function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemRowProps) {
  const { product, quantity } = item
  const lineTotal = product.price * quantity

  return (
    <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-border/80 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <Link
          href={`/products/${product.id}`}
          className="group relative flex size-18 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border/60 bg-white p-2 sm:size-20"
        >
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="80px"
            className="object-contain p-1 transition-transform group-hover:scale-105"
          />
        </Link>

        <div className="min-w-0 flex-1 space-y-1">
          <Badge
            variant="secondary"
            className="px-2 py-0.5 text-[10px] capitalize"
          >
            {product.category}
          </Badge>

          <h3 className="line-clamp-2 text-sm font-semibold text-foreground transition-colors hover:text-primary">
            <Link href={`/products/${product.id}`}>{product.title}</Link>
          </h3>

          <div className="text-xs text-muted-foreground">
            Unit Price:{" "}
            <span className="font-medium text-foreground">
              ${product.price.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-between gap-6 border-t border-border/40 pt-2 sm:w-auto sm:justify-end sm:border-t-0 sm:pt-0">
        <div className="flex items-center rounded-lg border border-input bg-background p-0.5 shadow-2xs">
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => onUpdateQuantity(product.id, quantity - 1)}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className="size-6 text-muted-foreground hover:text-foreground"
          >
            <Minus className="size-3" />
          </Button>

          <span className="w-8 text-center text-xs font-semibold text-foreground tabular-nums">
            {quantity}
          </span>

          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            onClick={() => onUpdateQuantity(product.id, quantity + 1)}
            disabled={quantity >= 10}
            aria-label="Increase quantity"
            className="size-6 text-muted-foreground hover:text-foreground"
          >
            <Plus className="size-3" />
          </Button>
        </div>

        <div className="min-w-[5rem] text-right">
          <span className="block text-xs text-muted-foreground sm:hidden">
            Total
          </span>
          <span className="text-sm font-bold text-foreground sm:text-base">
            ${lineTotal.toFixed(2)}
          </span>
        </div>

        <Tooltip title="Remove item" placement="top">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={() => onRemove(product.id)}
            aria-label={`Remove ${product.title} from cart`}
            className="size-8 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </Button>
        </Tooltip>
      </div>
    </div>
  )
}
