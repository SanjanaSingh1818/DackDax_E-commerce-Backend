import { ALL_PRODUCTS, Product } from "@/lib/data"

const STORAGE_KEY = "products"
const MARGIN_KEY = "margin"

export function getAdminProducts(): Product[] {

  if (typeof window === "undefined") return []

  const stored = localStorage.getItem(STORAGE_KEY)

  if (!stored) return []

  return JSON.parse(stored)

}

export function getMargin(): number {

  if (typeof window === "undefined") return 0

  const margin = localStorage.getItem(MARGIN_KEY)

  return margin ? Number(margin) : 0

}

export function applyMargin(products: Product[]): Product[] {

  const margin = getMargin()

  if (!margin) return products

  return products.map(product => ({

    ...product,

    price: Math.round(product.price + (product.price * margin) / 100)

  }))

}

export function getAllStoreProducts(): Product[] {

  const adminProducts = getAdminProducts()

  const merged = [...adminProducts, ...ALL_PRODUCTS]

  return applyMargin(merged)

}
