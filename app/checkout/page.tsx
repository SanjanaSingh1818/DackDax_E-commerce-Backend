"use client"

import { useCartStore } from "@/lib/cart-store"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { orderAPI, paymentAPI } from "@/lib/api"

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
         STEP 1: CREATE ORDER
      ========================== */

      const orderPayload = {

        items: items.map(item => ({
          productId: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),

        total: subtotal,

        customer: form

      }


      const orderRes = await orderAPI.create(orderPayload, token)


      console.log("Order created:", orderRes)



      /* =========================
         STEP 2: CREATE PAYMENT INTENT
      ========================== */

      const paymentRes = await paymentAPI.createIntent({

        orderId: orderRes._id || orderRes.order?._id,

        amount: subtotal,

        currency: "sek"

      }, token)


      console.log("Payment intent:", paymentRes)



      /* =========================
         STEP 3: CLEAR CART
      ========================== */

      clearCart()



      /* =========================
         STEP 4: REDIRECT TO STRIPE
      ========================== */

      if (paymentRes.url) {

        window.location.href = paymentRes.url

      } else {

        alert("Payment intent created successfully")

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
                {item.price * item.quantity} kr
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
              ? "Processing..."
              : "Pay Now"}

          </Button>

        </div>

      </div>

      <Footer />

    </>

  )

}
