"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { authAPI } from "@/lib/api"

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


  async function handleRegister(){

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

      const res = await authAPI.register({
        name: form.name,
        email: form.email,
        password: form.password
      })


      /*
        Expected backend response:
        {
          token,
          user: {
            _id,
            name,
            email,
            role
          }
        }
      */


      // Save auth data
      localStorage.setItem("token", res.token)
      localStorage.setItem("user", JSON.stringify(res.user))


      // Auto redirect based on role
      if(res.user.role === "admin"){

        router.push("/admin")

      }else{

        router.push("/")

      }


    }catch(err:any){

      alert(err.message || "Registrering misslyckades")

    }finally{

      setLoading(false)

    }

  }



  return(

    <>
      <Header />

      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">

        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md border">

          <h1 className="text-2xl font-bold mb-2 text-center">
            Skapa konto
          </h1>

          <p className="text-gray-500 text-center mb-6">
            Registrera dig för att handla däck
          </p>


          <input
            type="text"
            placeholder="Fullständigt namn"
            value={form.name}
            onChange={(e)=>setForm({...form,name:e.target.value})}
            className="w-full border rounded-lg p-3 mb-4"
          />


          <input
            type="email"
            placeholder="E-postadress"
            value={form.email}
            onChange={(e)=>setForm({...form,email:e.target.value})}
            className="w-full border rounded-lg p-3 mb-4"
          />


          <input
            type="password"
            placeholder="Lösenord"
            value={form.password}
            onChange={(e)=>setForm({...form,password:e.target.value})}
            className="w-full border rounded-lg p-3 mb-4"
          />


          <input
            type="password"
            placeholder="Bekräfta lösenord"
            value={form.confirmPassword}
            onChange={(e)=>setForm({...form,confirmPassword:e.target.value})}
            className="w-full border rounded-lg p-3 mb-4"
          />


          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-[#D4AF37] py-3 rounded-lg font-semibold"
          >
            {loading ? "Registrerar..." : "Registrera"}
          </button>


          <div className="text-center mt-6">

            <p className="text-gray-500">
              Har du redan ett konto?
            </p>

            <Link href="/login">

              <button className="mt-2 w-full border border-[#D4AF37] py-3 rounded-lg">

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
