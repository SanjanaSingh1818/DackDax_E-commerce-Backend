"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { registerUser } from "@/lib/auth"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function RegisterPage(){

  const router = useRouter()

  const [form,setForm] = useState({
    name:"",
    email:"",
    password:"",
    confirmPassword:""
  })

  const [loading,setLoading] = useState(false)

  function handleRegister(){

    if(!form.name || !form.email || !form.password){

      alert("Vänligen fyll i alla fält")
      return

    }

    if(form.password !== form.confirmPassword){

      alert("Lösenorden matchar inte")
      return

    }

    try{

      setLoading(true)

      registerUser({
        name:form.name,
        email:form.email,
        password:form.password
      })

      alert("Registrering lyckades!")

      router.push("/login")

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
            Skapa konto
          </h1>

          <p className="text-gray-500 text-center mb-6">
            Registrera dig för att handla däck
          </p>

          {/* Name */}

          <input
            type="text"
            placeholder="Fullständigt namn"
            value={form.name}
            onChange={(e)=>setForm({...form,name:e.target.value})}
            className="w-full border rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          />

          {/* Email */}

          <input
            type="email"
            placeholder="E-postadress"
            value={form.email}
            onChange={(e)=>setForm({...form,email:e.target.value})}
            className="w-full border rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          />

          {/* Password */}

          <input
            type="password"
            placeholder="Lösenord"
            value={form.password}
            onChange={(e)=>setForm({...form,password:e.target.value})}
            className="w-full border rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          />

          {/* Confirm Password */}

          <input
            type="password"
            placeholder="Bekräfta lösenord"
            value={form.confirmPassword}
            onChange={(e)=>setForm({...form,confirmPassword:e.target.value})}
            className="w-full border rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          />

          {/* Register Button */}

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-[#D4AF37] text-black py-3 rounded-lg font-semibold hover:bg-[#B8962E] transition"
          >
            {loading ? "Registrerar..." : "Registrera"}
          </button>

          {/* Login link */}

          <div className="text-center mt-6">

            <p className="text-gray-500">
              Har du redan ett konto?
            </p>

            <Link href="/login">

              <button className="mt-2 w-full border border-[#D4AF37] text-[#D4AF37] py-3 rounded-lg font-semibold hover:bg-[#D4AF37] hover:text-black transition">

                Logga in

              </button>

            </Link>

          </div>

        </div>

      </div>

      <Footer />

    </>

  )

}
