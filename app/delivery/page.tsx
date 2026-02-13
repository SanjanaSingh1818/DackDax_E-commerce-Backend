import {
  Truck,
  Clock,
  MapPin,
  Package
} from "lucide-react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"


export default function DeliveryPage() {

  return (

    <>
      <Header />

      <div className="bg-[#F9FAFB] min-h-screen">

        <div className="max-w-5xl mx-auto px-4 py-10">


          <h1 className="text-3xl font-bold mb-6">
            Leveransinformation
          </h1>


          <div className="space-y-6">


            <InfoCard
              icon={<Truck />}
              title="Snabb leverans"
              text="Vi levererar dina däck inom 2–5 arbetsdagar."
            />

            <InfoCard
              icon={<MapPin />}
              title="Leverans i hela Sverige"
              text="Vi levererar till hela Sverige inklusive verkstäder."
            />

            <InfoCard
              icon={<Package />}
              title="Spårning av order"
              text="Du får ett spårningsnummer via e-post."
            />

            <InfoCard
              icon={<Clock />}
              title="Leveranstid"
              text="Normal leveranstid är 2–5 arbetsdagar."
            />


          </div>



          {/* DETAILS */}
          <div className="bg-white border rounded-xl p-6 mt-8">

            <h2 className="font-semibold mb-4">
              Viktig information
            </h2>

            <ul className="space-y-3 text-gray-600">

              <li>• Fri frakt över 1000 kr</li>

              <li>• Leverans till hem eller verkstad</li>

              <li>• Spårningsinformation skickas via e-post</li>

              <li>• Leverans sker måndag till fredag</li>

            </ul>

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
