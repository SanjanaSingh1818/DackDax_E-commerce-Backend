"use client"

import useSWR from "swr"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard, ProductCardSkeleton } from "@/components/product-card"
import type { Product } from "@/lib/data"

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function FeaturedProducts() {
  const { data, isLoading } = useSWR<{ products: Product[] }>(
    "/api/products?page=1",
    fetcher
  )

  return (
    <section className="bg-muted px-4 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground md:text-3xl">
              Populara dack
            </h2>
            <p className="mt-1 text-muted-foreground">
              Topprankade dack fran ledande marken
            </p>
          </div>
          <Button variant="ghost" className="hidden gap-2 sm:flex" asChild>
            <Link href="/products">
              Visa alla
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : data?.products
                .slice(0, 4)
                .map((product) => <ProductCard key={product.id} product={product} />)}
        </div>

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
