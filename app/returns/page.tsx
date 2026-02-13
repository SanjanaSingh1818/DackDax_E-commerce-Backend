import {
  RotateCcw,
  ShieldCheck,
  PackageCheck,
  Clock
} from "lucide-react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"


export default function ReturnsPage() {

  return (

    <>
      <Header />

      <div className="bg-[#F9FAFB] min-h-screen">

        <div className="max-w-5xl mx-auto px-4 py-10">


          <h1 className="text-3xl font-bold mb-6">
            Returer och återbetalning
          </h1>


          <div className="space-y-6">


            <InfoCard
              icon={<RotateCcw />}
              title="14 dagars returrätt"
              text="Du kan returnera dina däck inom 14 dagar."
            />

            <InfoCard
              icon={<ShieldCheck />}
              title="Garanti"
              text="Alla produkter omfattas av garanti."
            />

            <InfoCard
              icon={<PackageCheck />}
              title="Produkten måste vara oanvänd"
              text="Däcken måste vara i originalskick."
            />

            <InfoCard
              icon={<Clock />}
              title="Återbetalningstid"
              text="Återbetalning sker inom 5–7 dagar."
            />

          </div>



          {/* DETAILS */}
          <div className="bg-white border rounded-xl p-6 mt-8">

            <h2 className="font-semibold mb-4">
              Hur gör man en retur?
            </h2>

            <ol className="space-y-3 text-gray-600">

              <li>1. Kontakta vår support</li>

              <li>2. Skicka tillbaka produkten</li>

              <li>3. Vi behandlar din retur</li>

              <li>4. Du får återbetalning</li>

            </ol>

          </div>


        </div>

      </div>

      <Footer />

    </>

  )

}


function InfoCard({
  icon,
  title,
  text
}:{
  icon:React.ReactNode
  title:string
  text:string
}){

  return(

    <div className="bg-white border rounded-xl p-5 flex gap-4 items-center">

      <div className="text-[#D4AF37]">
        {icon}
      </div>

      <div>

        <div className="font-semibold">
          {title}
        </div>

        <div className="text-gray-600 text-sm">
          {text}
        </div>

      </div>

    </div>

  )

}
