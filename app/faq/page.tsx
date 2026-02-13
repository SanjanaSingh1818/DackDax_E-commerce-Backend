import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductFAQ } from "@/components/product-faq"

export default function FAQPage() {

  return (

    <>
      <Header />

      <div className="bg-[#F9FAFB] min-h-screen">

        <div className="max-w-5xl mx-auto px-4 py-10">

          <h1 className="text-2xl font-bold mb-6">
            Vanliga frågor
          </h1>

          <ProductFAQ />

        </div>

      </div>

      <Footer />

    </>

  )

}
