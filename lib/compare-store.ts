"use client"

import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

const MAX_COMPARE_ITEMS = 4

export interface CompareItem {
  id: string
  url?: string
  brand: string
  title: string
  image: string
  price: number
  dimensions?: string
  size_index?: string
  diameter?: number | string
  profile?: number | string
  width?: number | string
  season?: string
  fuel_rating?: string
  wet_rating?: string
  noise_rating?: string | number
  load_index?: string | number
  speed_rating?: string
  description?: string
  availability?: string
}

interface CompareStore {
  items: CompareItem[]
  normalizeId: (value: unknown) => string
  getCount: () => number
  hasItem: (id: unknown) => boolean
  addItem: (product: any) => void
  removeItem: (id: unknown) => void
  toggleItem: (product: any) => void
  clearItems: () => void
}

function resolveMongoId(value: any): string {
  if (value && typeof value === "object" && value.$oid) {
    return String(value.$oid).trim()
  }
  return String(value ?? "").trim()
}

function parseLoadAndSpeed(sizeIndex?: string): { loadIndex: string; speedRating: string } {
  if (!sizeIndex) return { loadIndex: "", speedRating: "" }
  const match = String(sizeIndex).match(/(\d{2,3})([A-Z])\s*$/i)
  if (!match) return { loadIndex: "", speedRating: "" }
  return {
    loadIndex: match[1] || "",
    speedRating: (match[2] || "").toUpperCase(),
  }
}

export const useCompareStore = create<CompareStore>()(
  persist(
    (set, get) => ({
      items: [],

      normalizeId: (value: unknown) => {
        if (value === undefined || value === null) return ""
        const safe = resolveMongoId(value)
        if (!safe || safe === "undefined" || safe === "null") return ""
        return safe
      },

      getCount: () => get().items.length,

      hasItem: (id: unknown) => {
        const safeId = get().normalizeId(id)
        if (!safeId) return false
        return get().items.some((item) => item.id === safeId)
      },

      addItem: (product: any) => {
        const safeId = get().normalizeId(product?._id ?? product?.id ?? product?.productId)
        if (!safeId) return

        if (get().items.some((item) => item.id === safeId)) return
        if (get().items.length >= MAX_COMPARE_ITEMS) return

        const sizeIndex = product?.size_index || ""
        const parsed = parseLoadAndSpeed(sizeIndex)

        const compareItem: CompareItem = {
          id: safeId,
          url: product?.url || "",
          brand: product?.brand || "",
       
          title: product?.title || "",
          image: product?.image || product?.images?.[0] || "/placeholder.svg",
          price: Number(product?.price || 0),
          dimensions:
            product?.dimensions ||
            (product?.width && product?.profile && product?.diameter
              ? `${product.width}/${product.profile}R${product.diameter}`
              : product?.size_index || ""),
          size_index: sizeIndex,
          diameter: product?.diameter ?? "",
          profile: product?.profile ?? "",
          width: product?.width ?? "",
     
          season: product?.season || "",
          fuel_rating: product?.fuel_rating || "",
          wet_rating: product?.wet_rating || "",
          noise_rating: product?.noise_rating || "",
          load_index: product?.load_index || parsed.loadIndex || "",
          speed_rating: product?.speed_rating || parsed.speedRating || "",
          description: product?.description || "",
          availability: product?.availability || "",
        }

        set({ items: [...get().items, compareItem] })
      },

      removeItem: (id: unknown) => {
        const safeId = get().normalizeId(id)
        if (!safeId) return
        set({ items: get().items.filter((item) => item.id !== safeId) })
      },

      toggleItem: (product: any) => {
        const safeId = get().normalizeId(product?._id ?? product?.id ?? product?.productId)
        if (!safeId) return

        if (get().items.some((item) => item.id === safeId)) {
          get().removeItem(safeId)
          return
        }

        get().addItem(product)
      },

      clearItems: () => set({ items: [] }),
    }),
    {
      name: "dackdax-compare",
      storage: createJSONStorage(() => localStorage),
    }
  )
)
