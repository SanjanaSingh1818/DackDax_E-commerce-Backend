"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { authAPI, cartAPI } from "@/lib/api"
import { useCartStore } from "@/lib/cart-store"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function LoginPage(){

  const router = useRouter()

  const { items, setCart } = useCartStore()

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [loading,setLoading] = useState(false)


  async function syncCart(token:string){

    try{

      /* 1. send guest cart to backend */

      for (const item of items) {
        if (!item.id) continue

        await cartAPI.add(
          {
            productId: String(item.id),
            quantity: item.quantity,
          },
          token
        )
      }

      /* 2. load backend cart */

      const res = await cartAPI.get(token)

      if(res?.items){

        setCart(

          res.items.map((item:any)=>({

            id: item.productId || item.product?.id || item.product?._id,

            title: item.title || item.product?.title,

            price: item.price || item.product?.price,

            image: item.image || item.product?.image,

            quantity: item.quantity

          }))

        )

      }

    }
    catch(err){

      console.error("Cart sync failed", err)

    }

  }



  async function handleLogin(){

    try{

      setLoading(true)

      const res = await authAPI.login({

        email,
        password

      })

      localStorage.setItem("token", res.token)

      localStorage.setItem("user", JSON.stringify(res.user))

      /* AUTO CART SYNC */
      await syncCart(res.token)


      if(res.user.role === "admin"){

        router.push("/admin")

      }else{

        router.push("/")

      }

    }
    catch(err:any){

      alert(err.message || "Login failed")

    }
    finally{

      setLoading(false)

    }

  }


  return(

    <>
      <Header />

      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">

        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border">

          <h1 className="text-2xl font-bold mb-2 text-center">
            Logga in
          </h1>

          <p className="text-gray-500 text-center mb-6">
            Logga in för att fortsätta
          </p>

          <input
            type="email"
            placeholder="E-postadress"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full border rounded-lg p-3 mb-4"
          />

          <input
            type="password"
            placeholder="Lösenord"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="w-full border rounded-lg p-3 mb-4"
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-[#D4AF37] text-black py-3 rounded-lg"
          >
            {loading ? "Loggar in..." : "Logga in"}
          </button>

          <div className="text-center mt-6">

            <p className="text-gray-500">
              Har du inget konto?
            </p>

            <Link href="/register">

              <button className="mt-2 w-full border border-[#D4AF37] text-[#D4AF37] py-3 rounded-lg">

                Skapa konto

              </button>

            </Link>

          </div>

        </div>

      </div>

      <Footer />

    </>

  )

}
