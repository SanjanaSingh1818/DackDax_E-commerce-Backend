"use client"

import useSWR from "swr"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ProductCard, ProductCardSkeleton } from "@/components/product-card"

import type { Product } from "@/lib/data"
import { productAPI } from "@/lib/api"
import { mapProduct } from "@/lib/mappers"


export function FeaturedProducts() {

  const { data, isLoading, error } = useSWR(
    ["featuredProducts"],
    async () => {

      const res = await productAPI.getAll({
        page: 1,
        limit: 4
      })

      return {
        products: res.products.map(mapProduct)
      }
    },
    {
      revalidateOnFocus: false
    }
  )

  if (error)
    return <div>Failed to load products</div>

  return (
    <section className="bg-muted px-4 py-16">

      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex items-end justify-between">

          <div>
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              Populara däck
            </h2>

            <p className="mt-1 text-muted-foreground">
              Topprankade däck från ledande märken
            </p>
          </div>

          <Button variant="ghost" className="hidden gap-2 sm:flex" asChild>
            <Link href="/products">
              Visa alla
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>

        </div>


        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {isLoading
            ? Array.from({ length: 4 }).map((_, i) =>
                <ProductCardSkeleton key={i} />
              )

            : data?.products?.map((product: Product) =>
                <ProductCard
                  key={product.id}
                  product={product}
                />
              )
          }

        </div>


        {/* Mobile Button */}
        <div className="mt-8 flex justify-center sm:hidden">

          <Button variant="outline" className="gap-2 bg-transparent" asChild>

            <Link href="/products">
              Visa alla produkter
              <ArrowRight className="h-4 w-4" />
            </Link>

          </Button>

        </div>

      </div>

    </section>
  )
}
