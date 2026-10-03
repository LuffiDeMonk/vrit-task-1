"use client"

import React from "react"
import { Pagination } from "@/components/shared/pagination"

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

export function PaginationControls({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: PaginationControlsProps) {
  if (totalPages <= 1) return null

  return (
    <div className="py-4">
      <Pagination
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
        label="products"
        showPageSizeSelector={false}
        className="p-0"
      />
    </div>
  )
}
