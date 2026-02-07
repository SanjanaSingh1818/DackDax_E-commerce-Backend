import { ALL_PRODUCTS } from "@/lib/data"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl

  const width = searchParams.get("width")
  const profile = searchParams.get("profile")
  const diameter = searchParams.get("diameter")
  const brand = searchParams.get("brand")
  const season = searchParams.get("season")
  const fuel_rating = searchParams.get("fuel_rating")
  const wet_rating = searchParams.get("wet_rating")
  const noise_rating = searchParams.get("noise_rating")
  const min_price = searchParams.get("min_price")
  const max_price = searchParams.get("max_price")
  const page = parseInt(searchParams.get("page") || "1")
  const per_page = 12

  let filtered = [...ALL_PRODUCTS]

  if (width) filtered = filtered.filter((p) => p.width === parseInt(width))
  if (profile) filtered = filtered.filter((p) => p.profile === parseInt(profile))
  if (diameter) filtered = filtered.filter((p) => p.diameter === parseInt(diameter))
  if (brand) filtered = filtered.filter((p) => p.brand === brand)
  if (season) filtered = filtered.filter((p) => p.season === season)
  if (fuel_rating) filtered = filtered.filter((p) => p.fuel_rating === fuel_rating)
  if (wet_rating) filtered = filtered.filter((p) => p.wet_rating === wet_rating)
  if (noise_rating) filtered = filtered.filter((p) => p.noise_rating === noise_rating)
  if (min_price) filtered = filtered.filter((p) => p.price >= parseInt(min_price))
  if (max_price) filtered = filtered.filter((p) => p.price <= parseInt(max_price))

  const total = filtered.length
  const totalPages = Math.ceil(total / per_page)
  const start = (page - 1) * per_page
  const products = filtered.slice(start, start + per_page)

  return NextResponse.json({
    products,
    total,
    page,
    totalPages,
    per_page,
  })
}
