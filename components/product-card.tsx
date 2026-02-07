"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Eye, Fuel, Droplets, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/cart-store"
import type { Product } from "@/lib/data"

const SEASON_MAP: Record<string, string> = {
  Summer: "Sommar",
  Winter: "Vinter",
  "All-Season": "Helars",
}

const AVAILABILITY_MAP: Record<string, string> = {
  "In stock": "I lager",
  "3-5 days": "3-5 dagar",
}

function RatingBadge({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType
  label: string
  value: string
  color: string
}) {
  return (
    <div className="flex items-center gap-1.5 rounded-md bg-muted px-2 py-1">
      <Icon className={`h-3.5 w-3.5 ${color}`} />
      <span className="text-xs font-medium text-foreground">
        {value}
      </span>
    </div>
  )
}

export function ProductCard({ product }: { product: Product }) {

  const addItem = useCartStore((state) => state.addItem)

  const seasonLabel = SEASON_MAP[product.season] || product.season
  const availLabel = AVAILABILITY_MAP[product.availability] || product.availability

  const handleAddToCart = (e: React.MouseEvent) => {

    e.preventDefault()
    e.stopPropagation()

    addItem({
      id: product.id.toString(),
      title: `${product.brand} ${product.title}`,
      price: product.price,
      image: product.image || "/placeholder.svg",
    })

  }

  return (

    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-[#D4AF37]/30 hover:shadow-lg">

      {/* CLICKABLE IMAGE */}
      <Link href={`/product/${product.id}`}>
        <div className="relative flex items-center justify-center overflow-hidden bg-muted p-6 cursor-pointer">

          <Image
            src={product.image || "/placeholder.svg"}
            alt={`${product.brand} ${product.title}`}
            width={200}
            height={200}
            className="h-40 w-40 object-contain transition-transform duration-300 group-hover:scale-110"
          />

          <span
            className={`absolute left-3 top-3 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
              product.season === "Summer"
                ? "bg-[#D4AF37]/15 text-[#B8962E]"
                : product.season === "Winter"
                ? "bg-blue-100 text-blue-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {seasonLabel}
          </span>

        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">

        {/* CLICKABLE BRAND */}
        <Link href={`/product/${product.id}`}>
          <p className="mb-0.5 text-xs font-medium uppercase tracking-wide text-[#D4AF37] cursor-pointer hover:underline">
            {product.brand}
          </p>
        </Link>

        {/* CLICKABLE TITLE */}
        <Link href={`/product/${product.id}`}>
          <h3 className="mb-1 text-sm font-semibold leading-snug text-card-foreground cursor-pointer hover:text-[#D4AF37]">
            {product.title}
          </h3>
        </Link>

        {/* Size */}
        <p className="mb-3 text-xs text-muted-foreground">
          {product.width}/{product.profile}R{product.diameter}
        </p>

        {/* Ratings */}
        <div className="mb-3 flex flex-wrap gap-1.5">

          <RatingBadge
            icon={Fuel}
            label="Bränsleeffektivitet"
            value={product.fuel_rating}
            color="text-green-600"
          />

          <RatingBadge
            icon={Droplets}
            label="Våtgrepp"
            value={product.wet_rating}
            color="text-blue-600"
          />

          <RatingBadge
            icon={Volume2}
            label="Buller"
            value={product.noise_rating}
            color="text-muted-foreground"
          />

        </div>

        {/* Price and Buttons */}
        <div className="mt-auto">

          <div className="mb-3 flex items-baseline justify-between">

            <span className="text-xl font-bold text-foreground">
              {product.price}
              <span className="text-sm font-normal text-muted-foreground"> kr</span>
            </span>

            <span className="text-xs font-medium text-green-600">
              {availLabel}
            </span>

          </div>

          {/* Buttons */}
          <div className="flex gap-2">

            {/* DETAILS BUTTON */}
            <Link href={`/product/${product.id}`} className="flex-1">
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-1.5 text-xs bg-transparent"
              >
                <Eye className="h-3.5 w-3.5" />
                Detaljer
              </Button>
            </Link>

            {/* ADD TO CART BUTTON */}
            <Button
              size="sm"
              onClick={handleAddToCart}
              className="flex-1 gap-1.5 text-xs bg-[#D4AF37] text-[#0B0B0B] hover:bg-[#B8962E]"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Kop
            </Button>

          </div>

        </div>

      </div>

    </div>

  )
}

/* Skeleton */

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex h-52 items-center justify-center bg-muted">
        <div className="h-32 w-32 animate-pulse rounded-lg bg-border" />
      </div>
      <div className="flex flex-col gap-2 p-4">
        <div className="h-3 w-16 animate-pulse rounded bg-border" />
        <div className="h-4 w-32 animate-pulse rounded bg-border" />
        <div className="h-3 w-24 animate-pulse rounded bg-border" />
        <div className="mt-2 flex gap-1.5">
          <div className="h-6 w-12 animate-pulse rounded bg-border" />
          <div className="h-6 w-12 animate-pulse rounded bg-border" />
          <div className="h-6 w-16 animate-pulse rounded bg-border" />
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="h-6 w-20 animate-pulse rounded bg-border" />
          <div className="h-4 w-16 animate-pulse rounded bg-border" />
        </div>
        <div className="mt-2 flex gap-2">
          <div className="h-9 flex-1 animate-pulse rounded-lg bg-border" />
          <div className="h-9 flex-1 animate-pulse rounded-lg bg-border" />
        </div>
      </div>
    </div>
  )
}
