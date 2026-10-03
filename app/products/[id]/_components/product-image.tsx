"use client"

import React, { useState } from "react"
import Image from "next/image"
import { ImageOff } from "lucide-react"

interface ProductImageProps {
  src: string
  alt: string
}

export function ProductImage({ src, alt }: ProductImageProps) {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return (
      <div className="relative flex aspect-square w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-border bg-white p-8 text-muted-foreground shadow-xs">
        <ImageOff className="mb-2 size-12" />
        <span className="text-xs">Image unavailable</span>
      </div>
    )
  }

  return (
    <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-border bg-white p-6 shadow-xs">
      <Image
        src={src}
        alt={alt}
        fill
        priority
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-contain p-4 transition-transform duration-300 hover:scale-105"
        onError={() => setHasError(true)}
      />
    </div>
  )
}
