"use client"

import Link from "next/link"
import { GitCompareArrows } from "lucide-react"

import { useCompareStore } from "@/lib/compare-store"
import { Button } from "@/components/ui/button"

export function CompareNavButton() {
  const compareCount = useCompareStore((state) => state.getCount())

  return (
    <Link
      href="/compare"
      className="flex flex-col items-center gap-0.5 text-neutral-400 hover:text-white"
    >
      <div className="relative">
        <GitCompareArrows className="h-5 w-5" />
        <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#D4AF37] text-[9px] font-bold text-[#0B0B0B]">
          {compareCount}
        </span>
      </div>

      <span className="text-[10px] font-medium">Jamfor</span>
    </Link>
  )
}

export function CompareToggleButton({ product }: { product: any }) {
  const hasItem = useCompareStore((state) => state.hasItem(product?._id ?? product?.id ?? product?.productId))
  const toggleItem = useCompareStore((state) => state.toggleItem)

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleItem(product)
      }}
      className={`gap-1.5 text-xs ${hasItem ? "border-[#D4AF37] text-[#D4AF37]" : ""}`}
    >
      <GitCompareArrows className="h-3.5 w-3.5" />
      {hasItem ? "Vald" : "Jamfor"}
    </Button>
  )
}

