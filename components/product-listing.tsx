"use client"

import { useCallback, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import useSWR from "swr"
import { PackageOpen, AlertCircle } from "lucide-react"

import { Filters, type FilterValues } from "@/components/filters"
import { ProductCard, ProductCardSkeleton } from "@/components/product-card"
import { Pagination } from "@/components/pagination"
import { Button } from "@/components/ui/button"

import type { Product } from "@/lib/data"
import { productAPI } from "@/lib/api"
import { mapProduct } from "@/lib/mappers"

interface ProductsResponse {
  products: Product[]
  total: number
  page: number
  totalPages: number
  per_page: number
}

/* ---------------- API Fetcher ---------------- */

const apiFetcher = async (
  _key: string,
  params: { filters: FilterValues; page: number }
): Promise<ProductsResponse> => {
  const res = await productAPI.getAll({
    ...params.filters,
    page: params.page,
  })

  return {
    products: res.products.map(mapProduct),
    total: res.total,
    page: res.page,
    totalPages: res.totalPages,
    per_page: res.per_page,
  }
}

/* ---------------- Component ---------------- */

export function ProductListing() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [filters, setFilters] = useState<FilterValues>({
    brand: searchParams.get("brand") || "",
    width: searchParams.get("width") || "",
    profile: searchParams.get("profile") || "",
    diameter: searchParams.get("diameter") || "",
    season: searchParams.get("season") || "",
    fuel_rating: searchParams.get("fuel_rating") || "",
    wet_rating: searchParams.get("wet_rating") || "",
    noise_rating: searchParams.get("noise_rating") || "",
    min_price: searchParams.get("min_price") || "",
    max_price: searchParams.get("max_price") || "",
  })

  const [page, setPage] = useState(parseInt(searchParams.get("page") || "1"))

  /* -------- SWR key -------- */
  const swrKey = useCallback(() => {
    return ["products", { filters, page }]
  }, [filters, page])

  const { data, error, isLoading } = useSWR<ProductsResponse>(
    swrKey(),
    ([_, params]) => apiFetcher("products", params),
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    }
  )

  /* -------- URL Sync -------- */
  useEffect(() => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
    if (page > 1) params.set("page", page.toString())

    const qs = params.toString()
    router.replace(`/products${qs ? `?${qs}` : ""}`, { scroll: false })
  }, [filters, page, router])

  function handleFilterChange(newFilters: FilterValues) {
    setFilters(newFilters)
    setPage(1)
  }
      const { data: filterOptions } = useSWR(
  "productFilters",
  productAPI.getFilters
)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">



<Filters
  filters={filters}
  options={filterOptions}
  onFilterChange={handleFilterChange}
/>


      {/* Brand strip */}
      <div className="mt-4 text-center text-xs text-muted-foreground">
        Vi har däck från:{" "}
        <span className="font-medium uppercase tracking-wide">
          Continental, Pirelli, Hankook, Nokian, Michelin, Goodyear, Bridgestone, Dunlop
        </span>{" "}
        m.fl.
      </div>

      {/* Header */}
      <div className="mt-6 mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Däck</h2>
          {data && (
            <p className="text-sm text-muted-foreground">
              {data.total} resultat hittades
            </p>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-destructive/20 bg-destructive/5 px-6 py-16">
          <AlertCircle className="mb-3 h-10 w-10 text-destructive" />
          <h3 className="mb-1 text-base font-semibold text-foreground">
            Något gick fel
          </h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Kunde inte ladda produkter. Försök igen.
          </p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Försök igen
          </Button>
        </div>
      )}

      {/* Loading */}
      {isLoading && !data && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty */}
      {data && data.products.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-card px-6 py-16">
          <PackageOpen className="mb-3 h-10 w-10 text-muted-foreground" />
          <h3 className="mb-1 text-base font-semibold text-foreground">
            Inga produkter hittades
          </h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Prova att justera dina filter för att hitta det du söker.
          </p>
          <Button
            variant="outline"
            onClick={() =>
              handleFilterChange({
                brand: "",
                width: "",
                profile: "",
                diameter: "",
                season: "",
                fuel_rating: "",
                wet_rating: "",
                noise_rating: "",
                min_price: "",
                max_price: "",
              })
            }
          >
            Rensa alla filter
          </Button>
        </div>
      )}

      {/* Products */}
      {data && data.products.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-8">
            <Pagination
              currentPage={data.page}
              totalPages={data.totalPages}
              onPageChange={setPage}
            />
          </div>
        </>
      )}
    </div>
  )
}
