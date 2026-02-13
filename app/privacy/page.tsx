import {
  ShieldCheck,
  Lock,
  Cookie,
  FileText,
  Mail
} from "lucide-react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"


export default function PrivacyPage() {

  return (

    <>
      <Header />

      <div className="bg-[#F9FAFB]">


        {/* HERO */}
        <section className="bg-white border-b">

          <div className="max-w-5xl mx-auto px-4 py-10">

            <h1 className="text-4xl font-bold mb-3">
              Integritetspolicy
            </h1>

            <p className="text-gray-600">
              Senast uppdaterad: 13 februari 2026
            </p>

          </div>

        </section>



        {/* CONTENT */}
        <section className="max-w-5xl mx-auto px-4 py-10">

          <div className="bg-white border rounded-xl p-8 space-y-8">


            <PolicySection
              icon={<FileText />}
              title="Vilken information vi samlar in"
              content={
                <>
                  <p>
                    Vi samlar in information när du:
                  </p>

                  <ul className="list-disc ml-6 mt-2 space-y-1">

                    <li>Skapar ett konto</li>

                    <li>Gör en beställning</li>

                    <li>Kontaktar kundsupport</li>

                    <li>Använder vår webbplats</li>

                  </ul>

                </>
              }
            />



            <PolicySection
              icon={<Lock />}
              title="Hur vi använder informationen"
              content={
                <>
                  <p>
                    Vi använder din information för att:
                  </p>

                  <ul className="list-disc ml-6 mt-2 space-y-1">

                    <li>Behandla beställningar</li>

                    <li>Leverera produkter</li>

                    <li>Hantera betalningar</li>

                    <li>Förbättra användarupplevelsen</li>

                  </ul>

                </>
              }
            />



            <PolicySection
              icon={<ShieldCheck />}
              title="Skydd av dina uppgifter"
              content={
                <>
                  <p>
                    Vi använder säkra servrar och kryptering för att skydda dina uppgifter.
                  </p>

                  <p className="mt-2">
                    Endast auktoriserad personal har tillgång till dina data.
                  </p>
                </>
              }
            />



            <PolicySection
              icon={<Cookie />}
              title="Cookies"
              content={
                <>
                  <p>
                    Vi använder cookies för att:
                  </p>

                  <ul className="list-disc ml-6 mt-2 space-y-1">

                    <li>Förbättra webbplatsens funktion</li>

                    <li>Analysera trafik</li>

                    <li>Spara inställningar</li>

                  </ul>

                </>
              }
            />



            <PolicySection
              icon={<FileText />}
              title="Dina rättigheter (GDPR)"
              content={
                <>
                  <p>
                    Du har rätt att:
                  </p>

                  <ul className="list-disc ml-6 mt-2 space-y-1">

                    <li>Begära tillgång till dina data</li>

                    <li>Begära rättelse</li>

                    <li>Begära radering</li>

                    <li>Begränsa behandling</li>

                  </ul>

                </>
              }
            />



            <PolicySection
              icon={<Mail />}
              title="Kontakta oss"
              content={
                <>
                  <p>
                    Om du har frågor om integritetspolicyn kan du kontakta oss:
                  </p>

                  <p className="mt-2">

                    Email: support@dackdax.se

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

function PolicySection({
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
