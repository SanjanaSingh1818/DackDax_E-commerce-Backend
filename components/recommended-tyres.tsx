"use client"

import { ProductCard } from "@/components/product-card"
import type { Product } from "@/lib/data"

export function RecommendedTyres({
  title = "Rekommenderade däck",
  products,
}: {
  title?: string
  products: Product[]
}) {

  if (!products?.length) return null

  return (

    <section className="py-12">

      <div className="max-w-7xl mx-auto px-4">

        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          {title}
        </h2>

        {/* FIXED RESPONSIVE GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {products.map(product => (

            <ProductCard
              key={product.id}
              product={product}
            />

          ))}

        </div>

      </div>

    </section>

  )

}
