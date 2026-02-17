import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CompareProducts } from "@/components/compare-products"

export const metadata = {
  title: "Compare - DackDax",
  description: "Compare tires side by side before purchase.",
}

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <Header />
      <CompareProducts />
      <Footer />
    </div>
  )
}

