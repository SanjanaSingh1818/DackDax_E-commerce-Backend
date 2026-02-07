"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { loginUser } from "@/lib/auth"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function LoginPage(){

  const router = useRouter()

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [loading,setLoading] = useState(false)

  async function handleLogin(){

    try{

      setLoading(true)

      const user = loginUser(email,password)

      if(user.role === "admin"){

        router.push("/admin")

      }else{

        router.push("/")

      }

    }catch(err:any){

      alert(err.message)

    }finally{

      setLoading(false)

    }

  }

  return(

    <>
      <Header />

      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">

        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border">

          {/* Title */}

          <h1 className="text-2xl font-bold mb-2 text-center">
            Logga in
          </h1>

          <p className="text-gray-500 text-center mb-6">
            Logga in för att fortsätta
          </p>

          {/* Email */}

          <input
            type="email"
            placeholder="E-postadress"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full border rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          />

          {/* Password */}

          <input
            type="password"
            placeholder="Lösenord"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="w-full border rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          />

          {/* Login Button */}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-[#D4AF37] text-black py-3 rounded-lg font-semibold hover:bg-[#B8962E] transition"
          >
            {loading ? "Loggar in..." : "Logga in"}
          </button>

          {/* Register Section */}

          <div className="text-center mt-6">

            <p className="text-gray-500">
              Har du inget konto?
            </p>

            <Link href="/register">

              <button className="mt-2 w-full border border-[#D4AF37] text-[#D4AF37] py-3 rounded-lg font-semibold hover:bg-[#D4AF37] hover:text-black transition">

                Skapa konto

              </button>

            </Link>

          </div>

          {/* Admin info (optional helper) */}

          <div className="mt-6 text-xs text-gray-400 text-center">

            Admin login: admin@dackdax.com / admin123

          </div>

        </div>

      </div>

      <Footer />
    </>

  )

}
