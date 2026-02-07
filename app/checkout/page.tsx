"use client"

import { useCartStore } from "@/lib/cart-store"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {

  const router = useRouter()

  const { items, getTotal, clearCart } = useCartStore()

  const subtotal = getTotal()

  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    email: "",
    name: "",
    phone: "",
    address: "",
    city: "",
    postalCode: ""
  })

  const handleChange = (e:any) => {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    })

  }

  // SAFE function to save order
  const saveOrder = () => {

    if(typeof window === "undefined") return

    const order = {

      id: Date.now(),

      items,

      total: subtotal,

      customer: form,

      date: new Date().toISOString(),

      status: "Paid"

    }

    const existing = localStorage.getItem("orders")

    const orders = existing ? JSON.parse(existing) : []

    localStorage.setItem(
      "orders",
      JSON.stringify([...orders, order])
    )

  }

  const handlePayment = async () => {

    try{

      setLoading(true)

      // Save order locally
      saveOrder()

      // Stripe checkout
      const res = await fetch("/api/payment/create-checkout-session", {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          items,
          customer: form
        })

      })

      const data = await res.json()

      // Optional: clear cart
      clearCart()

      // Redirect to Stripe
      window.location.href = data.url

    }catch(err){

      console.error(err)
      alert("Payment failed")

    }finally{

      setLoading(false)

    }

  }

  return (

    <>
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">

        {/* LEFT - SHIPPING FORM */}

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

        {/* RIGHT - SUMMARY */}

        <div>

          <h2 className="text-xl font-bold mb-6">
            Ordersammanfattning
          </h2>

          {items.map(item => (

            <div key={item.id} className="flex justify-between mb-2">

              <span>
                {item.title} x {item.quantity}
              </span>

              <span>
                {item.price * item.quantity} kr
              </span>

            </div>

          ))}

          <hr className="my-4"/>

          <div className="flex justify-between font-bold text-lg">

            <span>Totalt</span>

            <span className="text-[#D4AF37]">
              {subtotal} kr
            </span>

          </div>

          <Button
            onClick={handlePayment}
            disabled={loading || items.length === 0}
            className="w-full mt-6 bg-[#D4AF37] text-black hover:bg-[#B8962E]"
          >

            {loading
              ? "Bearbetar..."
              : "Betala nu"
            }

          </Button>

        </div>

      </div>

      <Footer />

    </>
  )

}
