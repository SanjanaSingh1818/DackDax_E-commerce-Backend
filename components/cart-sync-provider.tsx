"use client"

import { useEffect, useRef } from "react"
import { cartAPI } from "@/lib/api"
import { useCartStore } from "@/lib/cart-store"

export default function CartSyncProvider({
  children
}: {
  children: React.ReactNode
}) {

  const { setCart, items } = useCartStore()

  const syncedRef = useRef(false)

  useEffect(() => {

    async function syncCart() {

      const token = localStorage.getItem("token")

      if (!token) return

      /* prevent multiple sync loops */
      if (syncedRef.current) return

      syncedRef.current = true

      try {

        const normalizeId = (value: unknown) => {
          if (value === undefined || value === null) return null
          const str = String(value).trim()
          if (!str || str === "undefined" || str === "null") return null
          return str
        }

        /* 1️⃣ get backend cart */
        const backend = await cartAPI.get(token)

        const backendItems = backend?.items || []
        /* 2️⃣ if backend empty but local exists → upload local */
        if (backendItems.length === 0 && items.length > 0) {

          const sanitized = items
            .map((item) => {
              const id = normalizeId(item.id)
              if (!id) return null
              return { ...item, id }
            })
            .filter(Boolean) as typeof items

          if (sanitized.length !== items.length) {
            setCart(sanitized)
          }

          for (const item of sanitized) {
            await cartAPI.add(
              {
                productId: item.id,
                quantity: item.quantity,
              },
              token
            )
          }
        }

        /* 3️⃣ reload backend cart */
        const fresh = await cartAPI.get(token)

        /* 4️⃣ update zustand store */
        if (fresh?.items) {

          const mapped = fresh.items.map((item:any) => {
              const prod =
                item.productId && typeof item.productId === "object"
                  ? item.productId
                  : item.product

              const id = normalizeId(
                prod?._id ||
                prod?.id ||
                item.productId ||
                item.product?.id ||
                item.product?._id
              )

              return {
                id,

                title:
                  item.title ||
                  prod?.title ||
                  "",

                price:
                  item.price ||
                  prod?.price ||
                  0,

                image:
                  item.image ||
                  prod?.image ||
                  "/placeholder.png",

                quantity:
                  item.quantity || 1
              }
            })

          setCart(mapped.filter((i:any)=>i.id))

        }

      }

      catch(err){

        console.error("Cart sync failed:",err)

      }

    }

    syncCart()

  }, [])

  return <>{children}</>

}










