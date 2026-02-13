"use client"

import { useState } from "react"
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send
} from "lucide-react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"


export default function ContactPage() {

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  })

  const [submitted, setSubmitted] = useState(false)


  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {

    setForm({
      ...form,
      [e.target.name]: e.target.value
    })

  }


  function handleSubmit(e: React.FormEvent) {

    e.preventDefault()

    console.log(form)

    setSubmitted(true)

    setForm({
      name: "",
      email: "",
      phone: "",
      message: ""
    })

  }



  return (

    <>
      <Header />

      <div className="bg-[#F9FAFB] min-h-screen">

        <div className="max-w-7xl mx-auto px-4 py-10">


          {/* TITLE */}
          <h1 className="text-3xl font-bold mb-8">
            Kontakta oss
          </h1>



          <div className="grid md:grid-cols-2 gap-8">


            {/* LEFT SIDE INFO */}
            <div className="space-y-6">


              <ContactCard
                icon={<Phone />}
                title="Telefon"
                value="+46 8 123 456 78"
              />

              <ContactCard
                icon={<Mail />}
                title="E-post"
                value="support@dackdax.se"
              />

              <ContactCard
                icon={<MapPin />}
                title="Adress"
                value="Stockholm, Sverige"
              />

              <ContactCard
                icon={<Clock />}
                title="Öppettider"
                value="Mån – Fre: 09:00 – 18:00"
              />


              {/* MAP */}
              <div className="bg-white border rounded-xl overflow-hidden">

                <iframe
                  src="https://maps.google.com/maps?q=Stockholm&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-64 border-0"
                />

              </div>

            </div>



            {/* RIGHT SIDE FORM */}
            <div className="bg-white border rounded-xl p-6">


              <h2 className="text-xl font-semibold mb-4">
                Skicka meddelande
              </h2>


              {submitted && (

                <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
                  Tack! Vi kontaktar dig snart.
                </div>

              )}


              <form onSubmit={handleSubmit} className="space-y-4">


                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Namn"
                  required
                  className="w-full border rounded-lg px-4 py-2"
                />


                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="E-post"
                  required
                  className="w-full border rounded-lg px-4 py-2"
                />


                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Telefon"
                  className="w-full border rounded-lg px-4 py-2"
                />


                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Meddelande"
                  required
                  rows={5}
                  className="w-full border rounded-lg px-4 py-2"
                />


                <Button
                  type="submit"
                  className="w-full bg-[#D4AF37] text-black hover:bg-[#B8962E]"
                >

                  <Send className="mr-2" size={18}/>

                  Skicka

                </Button>

              </form>

            </div>


          </div>

        </div>

      </div>

      <Footer />

    </>

  )

}



/* CONTACT CARD */

function ContactCard({
  icon,
  title,
  value
}:{
  icon:React.ReactNode
  title:string
  value:string
}){

  return(

    <div className="bg-white border rounded-xl p-4 flex gap-4 items-center">

      <div className="text-[#D4AF37]">
        {icon}
      </div>

      <div>

        <div className="font-semibold">
          {title}
        </div>

        <div className="text-gray-600 text-sm">
          {value}
        </div>

      </div>

    </div>

  )

}
