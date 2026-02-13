import {
  FileText,
  CreditCard,
  Truck,
  RotateCcw,
  ShieldCheck,
  AlertCircle,
  Mail
} from "lucide-react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"


export default function TermsPage() {

  return (

    <>
      <Header />

      <div className="bg-[#F9FAFB]">


        {/* HERO */}
        <section className="bg-white border-b">

          <div className="max-w-5xl mx-auto px-4 py-10">

            <h1 className="text-4xl font-bold mb-3">
              Allmänna villkor
            </h1>

            <p className="text-gray-600">
              Senast uppdaterad: 13 februari 2026
            </p>

          </div>

        </section>



        {/* CONTENT */}
        <section className="max-w-5xl mx-auto px-4 py-10">

          <div className="bg-white border rounded-xl p-8 space-y-8">


            <TermsSection
              icon={<FileText />}
              title="Beställning"
              content={
                <>
                  <p>
                    När du gör en beställning accepterar du våra villkor.
                  </p>

                  <p className="mt-2">
                    Efter beställning skickas en orderbekräftelse via e-post.
                  </p>
                </>
              }
            />



            <TermsSection
              icon={<CreditCard />}
              title="Betalning"
              content={
                <>
                  <p>
                    Vi accepterar följande betalningsmetoder:
                  </p>

                  <ul className="list-disc ml-6 mt-2 space-y-1">

                    <li>Klarna</li>

                    <li>Visa</li>

                    <li>Mastercard</li>

                    <li>Apple Pay</li>

                    <li>Stripe</li>

                  </ul>

                </>
              }
            />



            <TermsSection
              icon={<Truck />}
              title="Leverans"
              content={
                <>
                  <p>
                    Leverans sker inom 2–5 arbetsdagar.
                  </p>

                  <p className="mt-2">
                    Leveranstid kan variera beroende på produkt och plats.
                  </p>
                </>
              }
            />



            <TermsSection
              icon={<RotateCcw />}
              title="Returer och ångerrätt"
              content={
                <>
                  <p>
                    Du har rätt att returnera produkter inom 14 dagar.
                  </p>

                  <p className="mt-2">
                    Produkten måste vara oanvänd och i originalförpackning.
                  </p>
                </>
              }
            />



            <TermsSection
              icon={<ShieldCheck />}
              title="Garanti"
              content={
                <>
                  <p>
                    Alla produkter omfattas av garanti enligt svensk lag.
                  </p>
                </>
              }
            />



            <TermsSection
              icon={<AlertCircle />}
              title="Ansvarsbegränsning"
              content={
                <>
                  <p>
                    Vi ansvarar inte för indirekta skador eller förluster.
                  </p>
                </>
              }
            />



            <TermsSection
              icon={<Mail />}
              title="Kontaktinformation"
              content={
                <>
                  <p>
                    Email: support@dackdax.se
                  </p>

                  <p className="mt-2">
                    Sverige
                  </p>
                </>
              }
            />


          </div>

        </section>

      </div>

      <Footer />

    </>

  )

}



/* COMPONENT */

function TermsSection({
  icon,
  title,
  content
}:{
  icon:React.ReactNode
  title:string
  content:React.ReactNode
}){

  return(

    <div className="border rounded-xl p-6 hover:shadow-sm transition">

      <div className="flex items-center gap-3 mb-3">

        <div className="text-[#D4AF37]">

          {icon}

        </div>

        <h2 className="font-semibold text-lg">

          {title}

        </h2>

      </div>

      <div className="text-gray-600 text-sm leading-relaxed">

        {content}

      </div>

    </div>

  )

}
