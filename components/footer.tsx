"use client"

import Link from "next/link"
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter
} from "lucide-react"

export function Footer(){

  return(

    <footer className="bg-[#0B0B0B] border-t border-[#1F2937] text-neutral-400">

      <div className="max-w-7xl mx-auto px-4 py-12">

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">

          {/* Brand */}

          <div>

            <Link href="/" className="text-xl font-black text-white">

              DACK<span className="text-[#D4AF37]">DAX</span>

            </Link>

            <p className="mt-3 text-sm">

              Din pålitliga partner för premium däck,
              fälgar och kompletta hjul i Sverige.

            </p>

            <div className="mt-4 space-y-2 text-sm">

              <div className="flex items-center gap-2">
                <Phone size={16}/>
                0771-977 977
              </div>

              <div className="flex items-center gap-2">
                <Mail size={16}/>
                support@dackdax.se
              </div>

              <div className="flex items-center gap-2">
                <MapPin size={16}/>
                Stockholm, Sverige
              </div>

            </div>

          </div>

          {/* Categories */}

          <div>

            <h3 className="text-white font-semibold mb-3">
              Produkter
            </h3>

            <div className="space-y-2 text-sm">

              <Link href="/products?season=Summer" className="block hover:text-[#D4AF37]">
                Sommardäck
              </Link>

              <Link href="/products?season=Winter" className="block hover:text-[#D4AF37]">
                Vinterdäck
              </Link>

              <Link href="/products" className="block hover:text-[#D4AF37]">
                Alla däck
              </Link>

              <Link href="#" className="block hover:text-[#D4AF37]">
                Fälgar
              </Link>

            </div>

          </div>

          {/* Customer Service */}

          <div>

            <h3 className="text-white font-semibold mb-3">
              Kundservice
            </h3>

            <div className="space-y-2 text-sm">

              <Link href="#" className="block hover:text-[#D4AF37]">
                Kontakta oss
              </Link>

              <Link href="#" className="block hover:text-[#D4AF37]">
                Leverans & Returer
              </Link>

              <Link href="#" className="block hover:text-[#D4AF37]">
                Vanliga frågor
              </Link>

              <Link href="#" className="block hover:text-[#D4AF37]">
                Orderstatus
              </Link>

            </div>

          </div>

          {/* Company */}

          <div>

            <h3 className="text-white font-semibold mb-3">
              Företag
            </h3>

            <div className="space-y-2 text-sm">

              <Link href="#" className="block hover:text-[#D4AF37]">
                Om DackDax
              </Link>

              <Link href="#" className="block hover:text-[#D4AF37]">
                Karriär
              </Link>

              <Link href="#" className="block hover:text-[#D4AF37]">
                Integritetspolicy
              </Link>

              <Link href="#" className="block hover:text-[#D4AF37]">
                Villkor
              </Link>

            </div>

          </div>

          {/* Newsletter */}

          <div>

            <h3 className="text-white font-semibold mb-3">
              Nyhetsbrev
            </h3>

            <p className="text-sm mb-3">
              Få erbjudanden och nyheter först
            </p>

            <input
              type="email"
              placeholder="Din e-post"
              className="w-full p-2 rounded bg-[#111827] border border-[#1F2937] text-white text-sm"
            />

            <button className="mt-2 w-full bg-[#D4AF37] text-black py-2 rounded font-semibold hover:bg-[#B8962E]">

              Prenumerera

            </button>

          </div>

        </div>

        {/* Bottom */}

        <div className="border-t border-[#1F2937] mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">

          <div className="text-xs">

            © 2026 DackDax. Alla rättigheter förbehållna.

          </div>

          {/* Social */}

          <div className="flex gap-4">

            <Facebook className="hover:text-[#D4AF37] cursor-pointer"/>
            <Instagram className="hover:text-[#D4AF37] cursor-pointer"/>
            <Twitter className="hover:text-[#D4AF37] cursor-pointer"/>

          </div>

          {/* Payment */}

          <div className="text-xs text-neutral-500">

            Visa • Mastercard • Klarna • Apple Pay • Stripe

          </div>

        </div>

      </div>

    </footer>

  )

}
