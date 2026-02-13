"use client"

import { useState, useEffect, useRef } from "react"
import { X, Check, HelpCircle, Search } from "lucide-react"


type FAQ = {
  category: string
  question: string
  answer: string
}


const faqData: FAQ[] = [

  // PRODUCT (10)
  {
    category: "Produkt",
    question: "Passar detta däck min bil?",
    answer:
      "Kontrollera dimensionerna på ditt nuvarande däck eller i registreringsbeviset. Du kan också använda vårt registreringsnummerfilter."
  },
  {
    category: "Produkt",
    question: "Vad betyder däckdimensionen 205/55R16?",
    answer:
      "205 = bredd i mm, 55 = profil (%), R = radial, 16 = fälgdiameter i tum."
  },
  {
    category: "Produkt",
    question: "Vad är belastningsindex?",
    answer:
      "Belastningsindex anger maximal vikt däcket kan bära."
  },
  {
    category: "Produkt",
    question: "Vad är hastighetsindex?",
    answer:
      "Visar maxhastigheten däcket är godkänt för."
  },
  {
    category: "Produkt",
    question: "Vad är EU-däckmärkning?",
    answer:
      "Visar bränsleeffektivitet, våtgrepp och ljudnivå."
  },
  {
    category: "Produkt",
    question: "Vad är skillnaden mellan sommar- och vinterdäck?",
    answer:
      "Sommar för varma temperaturer. Vinter för snö och kyla."
  },
  {
    category: "Produkt",
    question: "Vad är friktionsdäck?",
    answer:
      "Vinterdäck utan dubbar, lämpliga för stadskörning."
  },
  {
    category: "Produkt",
    question: "Hur länge håller däck?",
    answer:
      "Vanligtvis 3–5 år beroende på körning och underhåll."
  },
  {
    category: "Produkt",
    question: "Kan jag köpa bara ett däck?",
    answer:
      "Ja, men vi rekommenderar att byta minst två samtidigt."
  },
  {
    category: "Produkt",
    question: "Är däcken nya?",
    answer:
      "Ja, alla däck är fabriksnya."
  },


  // DELIVERY (7)
  {
    category: "Leverans",
    question: "Hur lång är leveranstiden?",
    answer:
      "Vanligtvis 2–5 arbetsdagar."
  },
  {
    category: "Leverans",
    question: "Hur spårar jag min order?",
    answer:
      "Du får ett spårningsnummer via e-post."
  },
  {
    category: "Leverans",
    question: "Levererar ni till hela Sverige?",
    answer:
      "Ja, vi levererar till hela Sverige."
  },
  {
    category: "Leverans",
    question: "Vad kostar frakten?",
    answer:
      "Fri frakt över 1000 kr."
  },
  {
    category: "Leverans",
    question: "Kan jag välja leveransdatum?",
    answer:
      "Tyvärr inte, leverans sker automatiskt."
  },
  {
    category: "Leverans",
    question: "Levererar ni till verkstad?",
    answer:
      "Ja, ange verkstadens adress."
  },
  {
    category: "Leverans",
    question: "Vad händer om jag missar leveransen?",
    answer:
      "Transportören kontaktar dig igen."
  },


  // PAYMENT (7)
  {
    category: "Betalning",
    question: "Vilka betalningsmetoder finns?",
    answer:
      "Klarna, Visa, Mastercard, Apple Pay och Stripe."
  },
  {
    category: "Betalning",
    question: "Kan jag betala med Klarna?",
    answer:
      "Ja, Klarna finns tillgängligt."
  },
  {
    category: "Betalning",
    question: "Är betalningen säker?",
    answer:
      "Ja, alla betalningar är krypterade."
  },
  {
    category: "Betalning",
    question: "När debiteras jag?",
    answer:
      "När ordern skickas."
  },
  {
    category: "Betalning",
    question: "Kan jag betala senare?",
    answer:
      "Ja, via Klarna."
  },
  {
    category: "Betalning",
    question: "Kan jag få faktura?",
    answer:
      "Ja, via Klarna."
  },
  {
    category: "Betalning",
    question: "Kan jag använda presentkort?",
    answer:
      "Ja, om tillgängligt."
  },


  // RETURNS (6)
  {
    category: "Returer",
    question: "Kan jag returnera däcken?",
    answer:
      "Ja, inom 14 dagar."
  },
  {
    category: "Returer",
    question: "Hur returnerar jag?",
    answer:
      "Kontakta support."
  },
  {
    category: "Returer",
    question: "Är retur gratis?",
    answer:
      "Returkostnad kan tillkomma."
  },
  {
    category: "Returer",
    question: "Hur lång tid tar återbetalning?",
    answer:
      "5–7 arbetsdagar."
  },
  {
    category: "Returer",
    question: "Kan jag byta däck?",
    answer:
      "Ja."
  },
  {
    category: "Returer",
    question: "Vad om däcket är skadat?",
    answer:
      "Kontakta oss direkt."
  }

]


export function ProductFAQ() {

  const categories = [
    "Alla frågor",
    "Produkt",
    "Leverans",
    "Betalning",
    "Returer"
  ]

  const [activeCategory, setActiveCategory] = useState("Alla frågor")

  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null)

  const [search, setSearch] = useState("")

  const modalRef = useRef<HTMLDivElement>(null)



  /* FILTER LOGIC */
  const filteredFAQs = faqData.filter(faq => {

    const matchesCategory =
      activeCategory === "Alla frågor" ||
      faq.category === activeCategory

    const matchesSearch =
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase())

    return matchesCategory && matchesSearch

  })



  /* ESC CLOSE */
  useEffect(() => {

    const esc = (e: KeyboardEvent) => {

      if (e.key === "Escape")
        setSelectedFAQ(null)

    }

    window.addEventListener("keydown", esc)

    return () =>
      window.removeEventListener("keydown", esc)

  }, [])



  /* OUTSIDE CLICK CLOSE */
  const handleOutside = (e: React.MouseEvent) => {

    if (
      modalRef.current &&
      !modalRef.current.contains(e.target as Node)
    ) {
      setSelectedFAQ(null)
    }

  }



  return (

    <div className="max-w-4xl">


      {/* TITLE */}
      <div className="flex items-center gap-2 mb-6">

        <HelpCircle className="text-[#D4AF37]" />

        <h2 className="text-xl font-semibold">
          FAQS
        </h2>

      </div>



      {/* SEARCH BAR */}
      <div className="relative mb-6">

        <Search className="absolute left-3 top-3 text-gray-400" size={18} />

        <input
          type="text"
          placeholder="Sök frågor..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:border-[#D4AF37]"
        />

      </div>



      {/* CATEGORY BUTTONS */}
      <div className="flex flex-wrap gap-2 mb-6">

        {categories.map(cat => (

          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`flex items-center gap-1 px-4 py-2 rounded-lg border transition ${
              activeCategory === cat
                ? "bg-[#D4AF37] text-black border-[#D4AF37]"
                : "bg-white hover:bg-gray-50"
            }`}
          >

            {cat}

            {activeCategory === cat && <Check size={14} />}

          </button>

        ))}

      </div>



      {/* QUESTIONS */}
      <div className="space-y-3">

        {filteredFAQs.length === 0 && (

          <div className="text-gray-500 text-center py-6">
            Inga frågor hittades
          </div>

        )}

        {filteredFAQs.map((faq, i) => (

          <button
            key={i}
            onClick={() => setSelectedFAQ(faq)}
            className="block w-full text-left bg-white border rounded-lg p-4 hover:border-[#D4AF37] hover:shadow transition"
          >

            {faq.question}

          </button>

        ))}

      </div>



      {/* MODAL */}
      {selectedFAQ && (

        <div
          onClick={handleOutside}
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
        >

          <div
            ref={modalRef}
            className="bg-white rounded-xl max-w-lg w-full p-6 relative shadow-xl"
          >

            <button
              onClick={() => setSelectedFAQ(null)}
              className="absolute right-4 top-4 hover:text-red-500"
            >
              <X />
            </button>

            <h3 className="text-lg font-semibold mb-4">
              {selectedFAQ.question}
            </h3>

            <p className="text-gray-600">
              {selectedFAQ.answer}
            </p>

          </div>

        </div>

      )}

    </div>

  )

}
