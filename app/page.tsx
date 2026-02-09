import { Header } from "@/components/header"
import { CarSearch } from "@/components/car-search"
import { CategoryGrid } from "@/components/category-grid"
import { FeaturedProducts } from "@/components/featured-products"
import { Footer } from "@/components/footer"
import { Truck, ShieldCheck, Headset, RotateCcw } from "lucide-react"
import { RecommendedTyres } from "@/components/recommended-tyres"
import { ALL_PRODUCTS } from "@/lib/data"

const VALUE_PROPS = [
  {
    icon: Truck,
    title: "Fri frakt",
    desc: "Pa ordrar over 2000 kr",
  },
  {
    icon: ShieldCheck,
    title: "Kvalitetsgaranti",
    desc: "Enbart certifierade produkter",
  },
  {
    icon: Headset,
    title: "Expertsupport",
    desc: "Man-Fre 8:00-17:00",
  },
  {
    icon: RotateCcw,
    title: "Enkla returer",
    desc: "30 dagars returpolicy",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CarSearch />

      {/* Value Propositions */}
      <section className="border-b border-border bg-card px-4 py-8" id="kontakt">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 lg:grid-cols-4">
          {VALUE_PROPS.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.title} className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#D4AF37]/10">
                  <Icon className="h-5 w-5 text-[#D4AF37]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-card-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </section>
      <CategoryGrid />
      <FeaturedProducts />
  <RecommendedTyres
  title="Bästsäljande däck"
  limit={8}
/>

      <Footer />
    </div>
  )
}
