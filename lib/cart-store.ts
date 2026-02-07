"use client"

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

export interface CartItem {
  id: string
  title: string
  price: number
  image: string
  quantity: number
}

interface CartStore {

  items: CartItem[]

  addItem: (product: Omit<CartItem, "quantity">) => void
  removeItem: (id: string) => void

  increaseQty: (id: string) => void
  decreaseQty: (id: string) => void

  clearCart: () => void

  getCount: () => number
  getTotal: () => number

}

export const useCartStore = create<CartStore>()(

  persist(

    (set, get) => ({

      items: [],

      addItem: (product) => {

        const items = get().items
        const existing = items.find(item => item.id === product.id)

        if (existing) {

          set({
            items: items.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          })

        } else {

          set({
            items: [
              ...items,
              {
                ...product,
                quantity: 1
              }
            ]
          })

        }

      },

      removeItem: (id) =>
        set({
          items: get().items.filter(item => item.id !== id)
        }),

      increaseQty: (id) =>
        set({
          items: get().items.map(item =>
            item.id === id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        }),

      decreaseQty: (id) =>
        set({
          items: get().items
            .map(item =>
              item.id === id
                ? { ...item, quantity: item.quantity - 1 }
                : item
            )
            .filter(item => item.quantity > 0)
        }),

      clearCart: () => set({ items: [] }),

      getCount: () =>
        get().items.reduce(
          (total, item) => total + item.quantity,
          0
        ),

      getTotal: () =>
        get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ),

    }),

    {
      name: "dackdax-cart", // localStorage key

      storage: createJSONStorage(() => localStorage),

    }

  )

)
