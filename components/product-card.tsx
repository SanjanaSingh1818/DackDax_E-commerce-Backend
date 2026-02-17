"use client"
import { createSlug } from "@/lib/slug"
import React from "react"
import Image from "next/image"
import Link from "next/link"
import {
ShoppingCart,
Eye,
Fuel,
Droplets,
Volume2
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/cart-store"
import { toDisplayPrice, useCustomerType } from "@/lib/pricing"
import type { Product } from "@/lib/data"
import { CompareToggleButton } from "@/components/compare-button"

/* ================================
MAPS
================================ */

const SEASON_MAP: Record<string, string> = {
Summer: "Sommar",
Winter: "Vinter",
"All-Season": "Helars",
SOMMARDÄCK: "Sommar",
}

const AVAILABILITY_MAP: Record<string, string> = {
"In stock": "I lager",
"3-5 days": "3-5 dagar",
}

function SeasonIcon({ season }: { season: string }) {

  const seasonLower = season?.toLowerCase() || ""

  let src = "/icons/allseason.png"

  if (seasonLower.includes("sommar") || seasonLower.includes("summer")) {
    src = "/icons/summer.png"
  }
  else if (seasonLower.includes("winter") || seasonLower.includes("vinter")) {
    src = "/icons/winter.png"
  }
  else if (seasonLower.includes("friction")) {
    src = "/icons/friction.png"
  }
  else if (seasonLower.includes("all")) {
    src = "/icons/allseason.png"
  }

  return (
    <Image
      src={src}
      alt={season}
      width={36}
      height={36}
      className="object-contain"
    />
  )
}

/* ================================
RATING BADGE
================================ */

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

/* ================================
PRODUCT CARD
================================ */

export function ProductCard({ product }: { product: Product }) {

const addItem = useCartStore((state) => state.addItem)
const { customerType } = useCustomerType()

const rawId =
  (product as any)?._id ??
  (product as any)?.id ??
  (product as any)?.productId

const productId =
  rawId ? String(rawId).trim() : ""

const seasonLabel =
SEASON_MAP[product.season] || product.season

const availLabel =
AVAILABILITY_MAP[product.availability] || product.availability

/* ================================
ADD TO CART
Zustand handles backend sync
================================= */

const handleAddToCart = async (
e: React.MouseEvent
) => {


e.preventDefault()
e.stopPropagation()

if (!productId || productId === "undefined" || productId === "null") {

  console.error("Product ID missing:", product)
  return

}

try {

  await addItem({

    id: productId,

    title: `${product.brand} ${product.title}`,

    price: product.price,

    image: product.image || "/placeholder.svg",

  })

}

catch (err) {

  console.error("Add to cart failed:", err)

}


}

const productLink =
  `/product/${createSlug(product)}-${product.id}`

return (

<div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-[#D4AF37]/30 hover:shadow-lg">


  {/* IMAGE */}
 {/* IMAGE */}
<Link href={productLink}>
 <div className="relative flex items-center justify-center overflow-hidden bg-muted h-56 sm:h-60 cursor-pointer transition-colors duration-300 group-hover:bg-muted/70">

    {/* Image wrapper */}
<div className="relative h-full w-full">
  <Image
    src={product.image || "/placeholder.svg"}
    alt={`${product.brand} ${product.title}`}
    fill
    sizes="(max-width: 640px) 320px, (max-width: 1024px) 380px, 420px"
    className="object-contain scale-[1.35] transition-all duration-500 ease-out group-hover:scale-[1.45]"
  />
</div>




    {/* SEASON BADGE */}
<div className="absolute left-3 top-3 flex flex-col items-center bg-white/95 rounded-lg p-1.5 shadow-md">

  <SeasonIcon season={product.season} />

  <span className="text-[10px] font-semibold text-black">
    {seasonLabel}
  </span>

</div>



  </div>
</Link>




  {/* CONTENT */}
  <div className="flex flex-1 flex-col p-4">


    {/* BRAND */}
    <Link href={productLink}>

      <p className="mb-0.5 text-xs font-medium uppercase tracking-wide text-[#D4AF37] cursor-pointer hover:underline">

        {product.brand}

      </p>

    </Link>


    {/* TITLE */}
    <Link href={productLink}>

      <h3 className="mb-1 text-sm font-semibold leading-snug text-card-foreground cursor-pointer hover:text-[#D4AF37]">

        {product.title}

      </h3>

    </Link>


    {/* SIZE */}
    <p className="mb-3 text-xs text-muted-foreground">

      {product.dimensions}

    </p>



    {/* RATINGS */}
    <div className="mb-3 flex flex-wrap gap-1.5">

      <RatingBadge
        icon={Fuel}
        label="Bränsle"
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



    {/* PRICE + BUTTONS */}
    <div className="mt-auto">

      <div className="mb-3 flex items-baseline justify-between">

        <span className="text-xl font-bold text-foreground">

          {toDisplayPrice(product.price, customerType)}

          <span className="text-sm font-normal text-muted-foreground">

            {" "}kr

          </span>

        </span>

      </div>



      {/* BUTTONS */}
      <div className="flex gap-2">


        {/* DETAILS */}
        <Link
          href={productLink}
          className="flex-1"
        >

          <Button
            variant="outline"
            size="sm"
            className="w-full gap-1.5 text-xs bg-transparent"
          >

            <Eye className="h-3.5 w-3.5" />

            Detaljer

          </Button>

        </Link>

        <CompareToggleButton product={product} />



        {/* ADD TO CART */}
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

/* ================================
SKELETON
================================ */

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

  </div>

</div>
)

}
