"use client"

import Link from "next/link"
import Image from "next/image"
import {
  Mail,
  Facebook,
  Instagram,
  Twitter
} from "lucide-react"

export function Footer(){

  return(

    <footer className="bg-[#0B0B0B] border-t border-[#1F2937] text-neutral-400">

      <div className="max-w-7xl mx-auto px-4 py-14">

        {/* TRUST BADGES */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 border-b border-[#1F2937] pb-10">

          <div className="flex items-center gap-3">
            <Image src="/payments/secure-payment.png" alt="" width={40} height={40}/>
            <div>
              <p className="text-white text-sm font-semibold">
                Säker betalning
              </p>
              <p className="text-xs">
                100 % säker utcheckning
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Image src="/payments/fast-delivery.png" alt="" width={40} height={40}/>
            <div>
              <p className="text-white text-sm font-semibold">
                Snabb leverans
              </p>
              <p className="text-xs">
                2–5 arbetsdagar
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Image src="/payments/money-back.png" alt="" width={40} height={40}/>
            <div>
              <p className="text-white text-sm font-semibold">
                Pengarna tillbaka
              </p>
              <p className="text-xs">
                14 dagars garanti
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Image src="/payments/ssl.png" alt="" width={40} height={40}/>
            <div>
              <p className="text-white text-sm font-semibold">
                SSL säker
              </p>
              <p className="text-xs">
                Krypterad anslutning
              </p>
            </div>
          </div>

        </div>


        {/* MAIN FOOTER */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10">

          {/* Brand */}
          <div>

          <Link href="/" className="flex items-center gap-2">
  
  <Image
    src="/logo-removebg.png"
    alt="DackDax Logo"
    width={120}
    height={80}
    className="object-contain"
  />


</Link>

            <p className="mt-3 text-sm">
              Premium däck och fälgar med snabb leverans och trygg betalning.
            </p>

            <div className="mt-4 flex items-center gap-2 text-sm hover:text-[#D4AF37]">
              <Mail size={16}/>
              support@dackdax.se
            </div>

          </div>


          {/* Products */}
          <div>

            <h3 className="text-white font-semibold mb-4">
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
                Alla produkter
              </Link>

            </div>

          </div>


          {/* Customer */}
          <div>

            <h3 className="text-white font-semibold mb-4">
              Kundservice
            </h3>

            <div className="space-y-2 text-sm">

              <Link href="/contact" className="block hover:text-[#D4AF37]">
                Kontakta oss
              </Link>

              <Link href="/delivery" className="block hover:text-[#D4AF37]">
                Leverans
              </Link>

              <Link href="/returns" className="block hover:text-[#D4AF37]">
                Returer
              </Link>

              <Link href="/faq" className="block hover:text-[#D4AF37]">
                FAQ
              </Link>

            </div>

          </div>


          {/* Company */}
          <div>

            <h3 className="text-white font-semibold mb-4">
              Företag
            </h3>

            <div className="space-y-2 text-sm">

              <Link href="/about" className="block hover:text-[#D4AF37]">
                Om oss
              </Link>

              <Link href="/privacy" className="block hover:text-[#D4AF37]">
                Integritetspolicy
              </Link>

              <Link href="/terms" className="block hover:text-[#D4AF37]">
                Villkor
              </Link>

            </div>

          </div>

          {/* Newsletter */}
          <div>

            <h3 className="text-white font-semibold mb-4">
              Nyhetsbrev
            </h3>

            <input
              type="email"
              placeholder="Din e-postadress"
              className="w-full p-2 rounded bg-[#111827] border border-[#1F2937]"
            />

            <button className="mt-3 w-full bg-[#D4AF37] text-black py-2 rounded font-semibold hover:bg-[#B8962E]">
              Prenumerera
            </button>

          </div>

        </div>


        {/* BOTTOM */}
        <div className="border-t border-[#1F2937] mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-6">

          <div className="text-xs text-neutral-500">
            © 2026 DackDax. All rights reserved.
          </div>


          {/* Payment Icons */}
          <div className="flex items-center gap-2">


            <Image src="/payments/visa.png" width={40} height={24} alt="visa"/>
            <Image src="/payments/mastercard.png" width={40} height={24} alt="mastercard"/>
            <Image src="/payments/klarna.svg" width={40} height={24} alt="klarna"/>
            <Image src="/payments/apple-pay.png" width={40} height={24} alt="applepay"/>
            <Image src="/payments/stripe.png" width={40} height={24} alt="stripe"/>
           
          </div>


          {/* Social */}
          <div className="flex gap-4">

            <Facebook size={18} className="hover:text-[#D4AF37] cursor-pointer"/>
            <Instagram size={18} className="hover:text-[#D4AF37] cursor-pointer"/>
            <Twitter size={18} className="hover:text-[#D4AF37] cursor-pointer"/>

          </div>

        </div>

      </div>

    </footer>

  )

}
