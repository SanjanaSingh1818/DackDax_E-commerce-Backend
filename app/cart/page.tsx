"use client"

import Image from "next/image"
import Link from "next/link"
import {
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ArrowLeft
} from "lucide-react"

import { useEffect } from "react"

import { useCartStore } from "@/lib/cart-store"
import { cartAPI } from "@/lib/api"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { RecommendedTyres } from "@/components/recommended-tyres"

export default function CartPage() {

  const {
    items,
    setCart,
    increaseQty,
    decreaseQty,
    removeItem,
    clearCart,
    getTotal
  } = useCartStore()


  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null

  /* =============================
     LOAD CART FROM BACKEND
  ============================== */

useEffect(() => {

  async function loadCart() {

    if (!token) return

    try {

      const res =
        await cartAPI.get(token)

      if (res?.items?.length) {

        const backendItems =
          res.items.map((item:any) => {
            const prod =
              item.productId && typeof item.productId === "object"
                ? item.productId
                : item.product

            return {
              id:
                prod?._id ||
                prod?.id ||
                item.productId ||
                item.product?._id,

              title:
                item.title ||
                prod?.title,

              price:
                item.price ||
                prod?.price,

              image:
                item.image ||
                prod?.image,

              quantity:
                item.quantity
            }
          })

        setCart(backendItems)

      }

    }

    catch (err) {

      console.error(err)

    }

  }

  loadCart()

}, [token])

  /* =============================
     BACKEND SYNC FUNCTIONS
  ============================== */

async function handleIncrease(item:any) {

  const newQty = item.quantity + 1

  increaseQty(item.id)

  if (token) {

    try {

      await cartAPI.update(
        item.id,
        newQty,
        token
      )

    } catch (err) {

      console.error(err)

    }

  }

}


async function handleDecrease(item:any) {

  if (item.quantity <= 1) return // minimum should be 1, not 4

  const newQty = item.quantity - 1

  decreaseQty(item.id)

  if (token) {

    try {

      await cartAPI.update(
        item.id,
        newQty,
        token
      )

    } catch {}

  }

}



  async function handleRemove(item:any) {

    removeItem(item.id)

    if (token) {

      try {

        await cartAPI.remove(
          item.id,
          token
        )

      } catch {}

    }

  }

  async function handleClearCart() {

    if (confirm("Töm hela varukorgen?")) {

      clearCart()

      if (token) {

        try {

          for (const item of items) {

            await cartAPI.remove(item.id, token)

          }

        } catch {}

      }

    }

  }

  /* =============================
     TOTALS
  ============================== */

  const subtotal = getTotal()
  const shipping = subtotal > 0 ? 99 : 0
  const tax = Math.round(subtotal * 0.25)
  const total = subtotal + shipping + tax

  return (

    <>
      <Header />

      <div className="bg-[#F9FAFB] min-h-screen">

        <div className="max-w-7xl mx-auto px-4 py-6 sm:py-10">


          {/* Title */}
          <div className="flex items-center gap-3 mb-6">

            <ShoppingCart className="text-[#D4AF37]" />

            <h1 className="text-xl sm:text-2xl font-bold">
              Din varukorg
            </h1>

          </div>

          {/* Empty cart */}
          {items.length === 0 && (

            <div className="bg-white rounded-xl border p-8 text-center">

              <ShoppingCart
                size={40}
                className="mx-auto mb-4 text-gray-400"
              />

              <p className="text-gray-500 mb-4">
                Din varukorg är tom
              </p>

              <Link href="/products">

                <Button className="bg-[#D4AF37] text-black hover:bg-[#B8962E]">
                  Fortsätt handla
                </Button>

              </Link>

            </div>

          )}

          {/* Cart Content */}
          {items.length > 0 && (

            <div className="grid lg:grid-cols-3 gap-6">


              {/* LEFT SIDE */}
              <div className="lg:col-span-2 space-y-4">

                {items.map(item => (

                  <div
                    key={item.id}
                    className="bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition"
                  >

                    <div className="flex flex-col sm:flex-row gap-4">


                      {/* Image */}
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={90}
                        height={90}
                        className="object-contain mx-auto sm:mx-0"
                      />


                      {/* Content */}
                      <div className="flex-1">


                        {/* Title and Remove */}
                        <div className="flex justify-between">

                          <Link href={`/product/${item.id}`}>
  <h2 className="font-semibold hover:text-[#D4AF37] cursor-pointer">
    {item.title}
  </h2>
</Link>


                          <button
                            onClick={() => handleRemove(item)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 size={18}/>
                          </button>

                        </div>


                        <p className="text-sm text-gray-500 mt-1">
  {item.price} kr / däck
</p>



                        {/* Quantity + Total */}
                        <div className="flex items-center justify-between mt-4">

                          <div className="flex items-center border rounded-lg overflow-hidden">

                           <button
  onClick={() => handleDecrease(item)}
  className={`px-3 py-1 transition ${
    item.quantity <= 1
      ? "opacity-40 cursor-not-allowed"
      : "hover:bg-gray-100 cursor-pointer"
  }`}
>
  <Minus size={14}/>
</button>


                            <div className="px-4">
                              {item.quantity}
                            </div>

                            <button
                              onClick={() => handleIncrease(item)}
                              className="px-3 py-1 hover:bg-gray-100"
                            >
                              <Plus size={14}/>
                            </button>

                          </div>

                          <div className="font-bold text-[#B8962E]">
                            {item.price * item.quantity} kr
                          </div>

                        </div>

                      </div>

                    </div>

                  </div>

                ))}



                {/* Cart Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-between pt-4">

                  <Link href="/products">

                    <Button variant="outline">

                      <ArrowLeft size={16} className="mr-2"/>

                      Fortsätt handla

                    </Button>

                  </Link>

                  <div className="flex gap-3">

                    <Button
                      variant="destructive"
                      onClick={handleClearCart}
                    >
                      Töm varukorg
                    </Button>

                    <Link href="/checkout">

                      <Button className="bg-[#D4AF37] text-black hover:bg-[#B8962E]">
                        Gå till betalning
                      </Button>

                    </Link>

                  </div>

                </div>

              </div>



              {/* RIGHT SIDE SUMMARY */}
              <div className="space-y-4">

                <div className="bg-white border rounded-xl p-5">

                  <h2 className="font-semibold mb-4">
                    Ordersammanfattning
                  </h2>

                  <SummaryRow label="Delsumma" value={`${subtotal} kr`} />
                  <SummaryRow label="Frakt" value={`${shipping} kr`} />
                  <SummaryRow label="Moms (25%)" value={`${tax} kr`} />

                  <hr className="my-3"/>

                  <SummaryRow
                    label="Totalt"
                    value={`${total} kr`}
                    bold
                  />

                </div>

              </div>

            </div>

          )}



          {/* Recommended Tyres */}
{items.length > 0 && (

  <RecommendedTyres
    title="Rekommenderade däck"
    limit={8}
  />

)}



        </div>

      </div>

      <Footer />

    </>

  )

}



function SummaryRow({
  label,
  value,
  bold=false
}:{
  label:string
  value:string
  bold?:boolean
}){

  return(

    <div className="flex justify-between">

      <span className={bold ? "font-bold text-lg" : ""}>
        {label}
      </span>

      <span className={bold ? "font-bold text-lg text-[#B8962E]" : ""}>
        {value}
      </span>

    </div>

  )

}
