import { Suspense } from "react"
import { Header } from "@/components/header"
import { ProductListing } from "@/components/product-listing"

export const metadata = {
  title: "Dack - DackDax",
  description: "Utforska vart sortiment av kvalitetsdack. Filtrera efter marke, storlek, sasong och mer.",
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Suspense
        fallback={
          <div className="flex min-h-[50vh] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        }
      >
        <ProductListing />
      </Suspense>
    </div>
  )
}
