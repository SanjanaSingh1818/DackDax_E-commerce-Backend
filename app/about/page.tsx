import Image from "next/image"
import Link from "next/link"

import {
  ShieldCheck,
  Truck,
  Users,
  Award,
  Clock,
  CheckCircle
} from "lucide-react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"


export default function AboutPage() {

  return (

    <>
      <Header />

      <div className="bg-[#F9FAFB]">

        {/* HERO */}
        <section className="bg-white border-b">

          <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-2 gap-10 items-center">

            <div>

              <h1 className="text-4xl font-bold mb-4">
                Om DackDax
              </h1>

              <p className="text-gray-600 mb-6 leading-relaxed">

                DäckDax är en av Sveriges snabbast växande onlinebutiker
                för däck och fälgar. Vi hjälper tusentals kunder varje år
                att hitta rätt däck till bästa pris.

              </p>

              <Link href="/products">

                <Button className="bg-[#D4AF37] text-black hover:bg-[#B8962E]">

                  Utforska produkter

                </Button>

              </Link>

            </div>


            <div className="relative h-[300px]">

              <Image
                src="/tyre.webp"
                alt="DäckDax"
                fill
                className="object-contain"
              />

            </div>

          </div>

        </section>



        {/* STATS */}
        <section className="max-w-7xl mx-auto px-4 py-10">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

            <Stat number="10,000+" label="Nöjda kunder" />
            <Stat number="50,000+" label="Sålda däck" />
            <Stat number="10+" label="Års erfarenhet" />
            <Stat number="4.8★" label="Kundbetyg" />

          </div>

        </section>



        {/* WHY CHOOSE US */}
        <section className="max-w-7xl mx-auto px-4 py-10">

          <h2 className="text-2xl font-bold mb-6">

            Varför välja DäckDax?

          </h2>

          <div className="grid md:grid-cols-3 gap-6">

            <Feature
              icon={<Truck />}
              title="Snabb leverans"
              text="Leverans inom 2–5 arbetsdagar."
            />

            <Feature
              icon={<ShieldCheck />}
              title="Säker betalning"
              text="Klarna, Visa, Mastercard, Stripe."
            />

            <Feature
              icon={<Award />}
              title="Premium kvalitet"
              text="Endast originalprodukter."
            />

            <Feature
              icon={<Users />}
              title="Expert support"
              text="Hjälp från våra specialister."
            />

            <Feature
              icon={<Clock />}
              title="Snabb service"
              text="Snabb orderhantering."
            />

            <Feature
              icon={<CheckCircle />}
              title="Garanti"
              text="Garanti på alla produkter."
            />

          </div>

        </section>



        {/* TRUST SECTION */}
        <section className="bg-white border-y">

          <div className="max-w-7xl mx-auto px-4 py-10 text-center">

            <h2 className="text-2xl font-bold mb-4">

              Din pålitliga partner för däck

            </h2>

            <p className="text-gray-600 max-w-2xl mx-auto">

              Vi erbjuder högkvalitativa däck från ledande tillverkare
              med snabb leverans och bästa priser i Sverige.

            </p>

          </div>

        </section>



        {/* CTA */}
        <section className="max-w-7xl mx-auto px-4 py-10 text-center">

          <h2 className="text-2xl font-bold mb-4">

            Redo att hitta dina nya däck?

          </h2>

          <Link href="/products">

            <Button className="bg-[#D4AF37] text-black hover:bg-[#B8962E]">

              Shoppa nu

            </Button>

          </Link>

        </section>


      </div>

      <Footer />

    </>

  )

}



/* COMPONENTS */


function Feature({ icon, title, text }: any) {

  return (

    <div className="bg-white border rounded-xl p-6 hover:shadow-md transition">

      <div className="text-[#D4AF37] mb-3">

        {icon}

      </div>

      <div className="font-semibold mb-1">

        {title}

      </div>

      <div className="text-gray-600 text-sm">

        {text}

      </div>

    </div>

  )

}


function Stat({ number, label }: any) {

  return (

    <div className="bg-white border rounded-xl p-6 text-center">

      <div className="text-2xl font-bold text-[#D4AF37]">

        {number}

      </div>

      <div className="text-gray-600 text-sm">

        {label}

      </div>

    </div>

  )

}
