"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { CheckCircle, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/cart-store"
import { paymentAPI } from "@/lib/api"

export default function SuccessPage() {
  const clearCart = useCartStore((state) => state.clearCart)
  const searchParams = useSearchParams()
  const sessionId = searchParams.get("session_id")

  const [state, setState] = useState<"loading" | "paid" | "failed">("loading")
  const [message, setMessage] = useState("Verifierar betalning...")

  useEffect(() => {
    let mounted = true

    async function verify() {
      try {
        if (!sessionId) {
          if (mounted) {
            setState("failed")
            setMessage("Saknar Stripe session-id. Betalning kunde inte verifieras.")
          }
          return
        }

        const token = localStorage.getItem("token")
        if (!token) {
          if (mounted) {
            setState("failed")
            setMessage("Du behöver vara inloggad för att verifiera betalningen.")
          }
          return
        }

        const res = await paymentAPI.getSession(sessionId, token)
        if (res?.paymentStatus === "paid" || res?.status === "paid") {
          await clearCart()
          if (mounted) {
            setState("paid")
            setMessage("Tack för din beställning. Din order är nu betald.")
          }
          return
        }

        if (mounted) {
          setState("failed")
          setMessage("Betalningen är inte bekräftad ännu. Kontrollera orderstatus igen om en stund.")
        }
      } catch (err: any) {
        if (mounted) {
          setState("failed")
          setMessage(err?.message || "Kunde inte verifiera betalningen.")
        }
      }
    }

    verify()

    return () => {
      mounted = false
    }
  }, [sessionId, clearCart])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
      <div className="bg-white p-10 rounded-xl border text-center max-w-md">
        {state === "loading" && (
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#D4AF37] border-t-transparent" />
        )}

        {state === "paid" && (
          <CheckCircle size={60} className="mx-auto text-green-500 mb-4" />
        )}

        {state === "failed" && (
          <AlertTriangle size={60} className="mx-auto text-amber-500 mb-4" />
        )}

        <h1 className="text-2xl font-bold mb-2">
          {state === "paid" ? "Betalning lyckades!" : state === "failed" ? "Betalning ej verifierad" : "Vänta..."}
        </h1>

        <p className="text-gray-500 mb-6">{message}</p>

        <div className="flex justify-center gap-3">
          <Link href="/products">
            <Button className="bg-[#D4AF37] text-black hover:bg-[#B8962E]">
              Fortsätt handla
            </Button>
          </Link>
          <Link href="/cart">
            <Button variant="outline">Till varukorg</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

