"use client"

import { useParams } from "next/navigation"
import useSWR from "swr"
import Image from "next/image"
import { useEffect, useRef, useState} from "react"
import { X } from "lucide-react"
import { useCartStore } from "@/lib/cart-store"
import { productAPI } from "@/lib/api"
import { mapProduct } from "@/lib/mappers"
import { toDisplayPrice, useCustomerType } from "@/lib/pricing"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { RecommendedTyres } from "@/components/recommended-tyres"

import {
  Fuel,
  Droplets,
  Volume2,
  Truck,
  ShieldCheck
} from "lucide-react"


/* ================================
SEASON ICON
================================ */

function SeasonIcon({ season }: { season: string }) {

  const seasonLower = season?.toLowerCase() || ""

  let src = "/icons/allseason.png"

  if (seasonLower.includes("summer") || seasonLower.includes("sommar"))
    src = "/icons/summer.png"

  else if (seasonLower.includes("winter") || seasonLower.includes("vinter"))
    src = "/icons/winter.png"

  else if (seasonLower.includes("friction"))
    src = "/icons/friction.png"

  return (
    <Image
      src={src}
      alt={season}
      width={42}
      height={42}
    />
  )
}


/* ================================
MAIN COMPONENT
================================ */

export default function ProductDetailsPage() {

  const params = useParams()
  const slug = params.slug as string

  const id = slug.split("-").pop() as string

  const { data: product, isLoading } = useSWR(
    id ? ["product", id] : null,
    async () => {
      const res = await productAPI.getById(id)
      return mapProduct(res)
    }
  )

  const addItem = useCartStore(state => state.addItem)
  const { customerType } = useCustomerType()

  const [quantity, setQuantity] = useState(4)


  if (isLoading)
    return <div className="p-10">Loading...</div>

  if (!product)
    return <div className="p-10">Product not found</div>



  /* ================================
  CART ACTIONS
  ================================ */

  const handleAddToCart = () => {

    addItem({
      id: product.id,
      title: `${product.brand} ${product.title}`,
      price: product.price,
      image: product.image,
      quantity: quantity
    })

  }


  const handleBuyNow = () => {

    const productItem = {
      id: product.id,
      title: `${product.brand} ${product.title}`,
      price: product.price,
      image: product.image,
      quantity: quantity,
    }

    localStorage.setItem("buy-now", JSON.stringify(productItem))

    window.location.href = "/checkout"

  }



  return (

    <>
      <Header />

      <div className="bg-[#F9FAFB] py-10">

        <div className="max-w-7xl mx-auto px-4">

          <div className="grid md:grid-cols-2 gap-10">


            {/* LEFT SIDE */}
            <div>

              <p className="text-sm text-gray-500 mb-2">
                Hem / Däck / {product.brand}
              </p>

              <h1 className="text-3xl font-bold mb-3">
                {product.brand} {product.title}
              </h1>

              <p className="text-gray-500 mb-3">
                {product.width}/{product.profile}R{product.diameter}
              </p>


              {/* LOAD + SPEED */}
              <div className="flex gap-3 mb-4">

                <div className="bg-white border px-3 py-1 rounded text-sm">
                  Belastningsindex: <b>{product.load_index || "93"}</b>
                </div>

                <div className="bg-white border px-3 py-1 rounded text-sm">
                  Hastighetsindex: <b>{product.speed_rating || "W"}</b>
                </div>

              </div>



              {/* EU RATINGS */}
              <div className="flex gap-3 mb-4">

                <Badge icon={Fuel} label="Bränsle" value={product.fuel_rating} />

                <Badge icon={Droplets} label="Våtgrepp" value={product.wet_rating} />

                <Badge icon={Volume2} label="Buller" value={`${product.noise_rating} dB`} />

              </div>



              {/* PRICE */}
              <div className="text-3xl font-bold text-[#B8962E]">
                {toDisplayPrice(product.price, customerType)} kr / däck
              </div>


              {/* TOTAL PRICE */}
              <div className="text-lg mt-2 mb-4">

                Totalt pris:{" "}
                <span className="font-bold text-[#B8962E]">
                  {toDisplayPrice(product.price, customerType) * quantity} kr
                </span>

              </div>



              {/* STOCK */}
              <div className="mb-4 space-y-1">

                <div className="text-green-600 font-semibold">
                  ✓ I lager
                </div>

                <div className="text-sm text-gray-500">
                  Leverans: 2–5 arbetsdagar
                </div>

              </div>



              {/* QUANTITY SELECTOR */}
              <div className="mb-6">

                <label className="text-sm font-medium mb-2 block">
                  Antal däck
                </label>

                <div className="flex items-center gap-3">

                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 border rounded text-lg"
                  >
                    −
                  </button>

                  <div className="w-16 h-10 border rounded flex items-center justify-center font-semibold">
                    {quantity}
                  </div>

                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-10 h-10 border rounded text-lg"
                  >
                    +
                  </button>

                  <span className="text-sm text-gray-500 ml-2">
                    (Standard: 4)
                  </span>

                </div>

              </div>



              {/* DESCRIPTION */}
              <div className="bg-white border rounded-lg p-4 mb-6">

                <h3 className="font-semibold mb-2">
                  Produktbeskrivning
                </h3>

                <p className="text-sm text-gray-600">
                  {product.description ||
                    `${product.brand} ${product.title} erbjuder utmärkt grepp, hög säkerhet och lång livslängd. Perfekt för svenska vägförhållanden.`}
                </p>

              </div>



              {/* BUTTONS */}
              <div className="flex gap-3">

                <Button
                  onClick={handleAddToCart}
                  variant="outline"
                  className="flex-1 border-[#D4AF37]"
                >
                  Lägg i varukorg
                </Button>

                <Button
                  onClick={handleBuyNow}
                  className="flex-1 bg-[#D4AF37]"
                >
                  Köp nu
                </Button>

              </div>



              {/* BENEFITS */}
              <div className="grid grid-cols-2 gap-4 mt-6">

                <Benefit
                  icon={Truck}
                  title="Fri frakt"
                  text="Gratis leverans över 1000 kr"
                />

                <Benefit
                  icon={ShieldCheck}
                  title="Garanti"
                  text="1 års garanti"
                />

              </div>

            </div>



            {/* RIGHT SIDE IMAGE */}
            <div className="relative bg-white rounded-xl border h-[450px] flex items-center justify-center">

              {/* SEASON ICON */}
              <div className="absolute top-4 left-4 bg-white rounded-lg p-2 shadow">

                <SeasonIcon season={product.season} />

              </div>

              <div className="relative w-full h-full p-10">

                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-contain scale-100"
                  priority
                />

              </div>

            </div>

          </div>



          {/* SPECIFICATIONS */}
 {/* PRODUCT INFO + SPECIFICATIONS + FAQ */}
<div className="bg-white mt-10 rounded-xl border overflow-hidden">

  {/* PRODUCT INFORMATION */}
  <Accordion title="Produktinformation" defaultOpen>

    <p>
      {product.description ||
        `${product.brand} ${product.title} är designat för lång livslängd, säker körning och optimalt grepp.`}
    </p>

  </Accordion>


  {/* SPECIFICATIONS */}
  <Accordion title="Specifikationer">

    <div className="grid md:grid-cols-2">

      <Spec label="EAN" value={product.ean} />
      <Spec label="Märke" value={product.brand} />
      <Spec label="Modell" value={product.title} />
      <Spec label="Bredd" value={product.width} />
      <Spec label="Profil" value={product.profile} />
      <Spec label="Tum" value={product.diameter} />
      <Spec label="Bränsleklass" value={product.fuel_rating} />
      <Spec label="Våtgrepp" value={product.wet_rating} />
      <Spec label="Buller" value={product.noise_rating} />

    </div>

  </Accordion>


  {/* FAQ */}
  <Accordion title="Vanliga frågor">

    <FAQAccordion />

  </Accordion>

</div>




          <RecommendedTyres
            title="Liknande däck"
            currentProduct={product}
            limit={4}
          />

        </div>

      </div>

      <Footer />

    </>
  )

}


/* ================================
HELPER COMPONENTS
================================ */

function Badge({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center gap-2 bg-white border px-4 py-2 rounded">
      <Icon size={18} />
      <div>
        <div className="text-xs text-gray-500">{label}</div>
        <div className="font-semibold">{value}</div>
      </div>
    </div>
  )
}

function Benefit({ icon: Icon, title, text }: any) {
  return (
    <div className="flex gap-3 bg-white border p-4 rounded">
      <Icon className="text-[#B8962E]" />
      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-gray-500">{text}</div>
      </div>
    </div>
  )
}

function Spec({ label, value }: any) {
  return (
    <div className="flex justify-between p-4 border-b">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  )
}

function Accordion({
  title,
  children,
  defaultOpen = false
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {

  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border-b">

      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center p-6 font-semibold text-left hover:bg-gray-50"
      >

        {title}

        {open
          ? <ChevronUp size={18}/>
          : <ChevronDown size={18}/>
        }

      </button>

      {open && (
        <div className="px-6 pb-6 text-gray-600 text-sm">
          {children}
        </div>
      )}

    </div>
  )
}





function FAQAccordion() {

  const [activeCategory, setActiveCategory] = useState("Alla frågor")

  const [selectedFAQ, setSelectedFAQ] = useState<{
    question: string
    answer: string
    category: string
  } | null>(null)

  const modalRef = useRef<HTMLDivElement>(null)


  const categories = [
    "Alla frågor",
    "Produkt",
    "Leverans",
    "Betalning",
    "Returer"
  ]


  const faqs = [

    {
      category: "Produkt",
      question: "Passar produkten min bil?",
      answer:
        "Vi erbjuder filtrering med hjälp av registreringsnummer. Dubbelkolla alltid måtten på däckets sidovägg."
    },

    {
      category: "Produkt",
      question: "Vad är en lämplighetsgaranti?",
      answer:
        "Fit guarantee säkerställer att däcken matchar tillverkarens specifikationer."
    },

    {
      category: "Produkt",
      question: "Kan jag blanda olika däck?",
      answer:
        "Vi rekommenderar att använda samma däck på alla hjul för säkerhet."
    },

    {
      category: "Leverans",
      question: "Hur lång tid tar leveransen?",
      answer:
        "Leverans tar normalt 2–5 arbetsdagar."
    },

    {
      category: "Betalning",
      question: "Vilka betalningsalternativ finns?",
      answer:
        "Vi accepterar Klarna, Visa, Mastercard, Apple Pay och Stripe."
    },

    {
      category: "Returer",
      question: "Kan jag returnera däck?",
      answer:
        "Ja, du har 14 dagars returpolicy."
    }

  ]


  const filteredFAQs =
    activeCategory === "Alla frågor"
      ? faqs
      : faqs.filter(f => f.category === activeCategory)



  /* CLOSE ON ESC KEY */
  useEffect(() => {

    const handleEsc = (e: KeyboardEvent) => {

      if (e.key === "Escape")
        setSelectedFAQ(null)

    }

    window.addEventListener("keydown", handleEsc)

    return () =>
      window.removeEventListener("keydown", handleEsc)

  }, [])



  /* CLOSE ON OUTSIDE CLICK */
  const handleOutsideClick = (e: React.MouseEvent) => {

    if (
      modalRef.current &&
      !modalRef.current.contains(e.target as Node)
    ) {
      setSelectedFAQ(null)
    }

  }



  return (

    <div>


      {/* CATEGORY BUTTONS */}
      <div className="flex flex-wrap gap-2 mb-4">

        {categories.map(cat => (

          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-lg border text-sm transition-all duration-200 ${
              activeCategory === cat
                ? "bg-[#1F2937] text-white border-[#1F2937]"
                : "bg-white hover:bg-gray-100"
            }`}
          >
            {cat}
          </button>

        ))}

      </div>



      {/* QUESTIONS */}
      <div className="space-y-3">

        {filteredFAQs.map((faq, i) => (

          <button
            key={i}
            onClick={() => setSelectedFAQ(faq)}
            className="block text-left text-[#1F3A5F] hover:underline transition"
          >
            {faq.question}
          </button>

        ))}

      </div>



      {/* MODAL */}
      {selectedFAQ && (

        <div
          onClick={handleOutsideClick}
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fadeIn"
        >

          <div
            ref={modalRef}
            className="bg-white rounded-xl max-w-lg w-full p-6 relative shadow-xl animate-scaleIn"
          >

            {/* CLOSE BUTTON */}
            <button
              onClick={() => setSelectedFAQ(null)}
              className="absolute right-4 top-4 text-gray-500 hover:text-black transition"
            >
              <X size={20}/>
            </button>


            {/* QUESTION */}
            <h3 className="text-lg font-semibold mb-4">
              {selectedFAQ.question}
            </h3>


            {/* ANSWER */}
            <p className="text-gray-600 text-sm leading-relaxed">
              {selectedFAQ.answer}
            </p>

          </div>

        </div>

      )}

    </div>

  )

}

