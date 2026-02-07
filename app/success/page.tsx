"use client"

import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/cart-store"
import { useEffect } from "react"

export default function SuccessPage() {

  const clearCart = useCartStore(state => state.clearCart)

  // Clear cart after successful payment
  useEffect(() => {

    clearCart()

  }, [])

  return (

    <>


      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">

        <div className="bg-white p-10 rounded-xl border text-center max-w-md">

          <CheckCircle
            size={60}
            className="mx-auto text-green-500 mb-4"
          />

          <h1 className="text-2xl font-bold mb-2">
            Betalning lyckades!
          </h1>

          <p className="text-gray-500 mb-6">
            Tack för din beställning. Din order har mottagits.
          </p>

          <Link href="/products">

            <Button className="bg-[#D4AF37] text-black hover:bg-[#B8962E]">

              Fortsätt handla

            </Button>

          </Link>

        </div>

      </div>



    </>

  )

}
