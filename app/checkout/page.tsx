"use client"

import { useCartStore } from "@/lib/cart-store"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { useState } from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { paymentAPI } from "@/lib/api"
import { toDisplayPrice, useCustomerType } from "@/lib/pricing"

export default function CheckoutPage() {

  const router = useRouter()

  const { items, getTotal } = useCartStore()
  const { customerType } = useCustomerType()

  const subtotalExcl = getTotal()
  const tax = customerType === "privat" ? Math.round(subtotalExcl * 0.25) : 0
  const subtotal = subtotalExcl + tax

  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    email: "",
    name: "",
    phone: "",
    address: "",
    city: "",
    postalCode: ""
  })

  useEffect(() => {
    if (typeof window === "undefined") return

    const userRaw = localStorage.getItem("user")
    if (!userRaw) return

    try {
      const user = JSON.parse(userRaw) as { name?: string; fullName?: string; email?: string }

      setForm((prev) => ({
        ...prev,
        name: user?.name || user?.fullName || prev.name,
        email: user?.email || prev.email,
      }))
    } catch {
      // ignore invalid stored user payload
    }
  }, [])


  const handleChange = (e:any) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    })

  }



  const handlePayment = async () => {

    try {

      setLoading(true)

      const token = localStorage.getItem("token")

      if (!token) {

        alert("Please login first")

        router.push("/login")

        return

      }


      /* =========================
         STEP 1: CREATE STRIPE CHECKOUT SESSION
      ========================== */

      const paymentPayload = {

        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
        })),

        customer: form,
        customerType

      }

      const paymentRes = await paymentAPI.createIntent({
        ...paymentPayload

      }, token)


      console.log("Payment intent:", paymentRes)



      /* =========================
         STEP 3: REDIRECT TO STRIPE
      ========================== */

      if (paymentRes.url) {

        window.location.href = paymentRes.url

      } else {

        alert("Kunde inte starta betalning. Försök igen.")

      }


    } catch (err:any) {

      console.error(err)

      alert(err.message || "Payment failed")

    } finally {

      setLoading(false)

    }

  }



  return (

    <>
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">

        {/* LEFT FORM */}

        <div>

          <h2 className="text-xl font-bold mb-6">
            Leveransinformation
          </h2>

          <div className="space-y-4">

            <Input
              name="email"
              placeholder="E-post"
              value={form.email}
              onChange={handleChange}
            />

            <Input
              name="name"
              placeholder="Fullständigt namn"
              value={form.name}
              onChange={handleChange}
            />

            <Input
              name="phone"
              placeholder="Telefon"
              value={form.phone}
              onChange={handleChange}
            />

            <Input
              name="address"
              placeholder="Adress"
              value={form.address}
              onChange={handleChange}
            />

            <Input
              name="city"
              placeholder="Stad"
              value={form.city}
              onChange={handleChange}
            />

            <Input
              name="postalCode"
              placeholder="Postnummer"
              value={form.postalCode}
              onChange={handleChange}
            />

          </div>

        </div>



        {/* RIGHT SUMMARY */}

        <div>

          <h2 className="text-xl font-bold mb-6">
            Ordersammanfattning
          </h2>

          {items.map(item => (

            <div key={item.id} className="flex justify-between mb-2">

              <span>
                {item.title} × {item.quantity}
              </span>

              <span>
                {toDisplayPrice(item.price, customerType) * item.quantity} kr
              </span>

            </div>

          ))}

          <hr className="my-4"/>

          <div className="flex justify-between font-bold text-lg">

            <span>Total</span>

            <span className="text-[#D4AF37]">
              {subtotal} kr
            </span>

          </div>


          <Button
            onClick={handlePayment}
            disabled={loading || items.length === 0}
            className="w-full mt-6 bg-[#D4AF37]"
          >

            {loading
              ? "Bearbetar..."
              : "Betala nu"}

          </Button>

        </div>

      </div>

      <Footer />

    </>

  )

}
