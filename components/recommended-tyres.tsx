"use client"

import useSWR from "swr"
import type { Product } from "@/lib/data"

import { productAPI } from "@/lib/api"
import { mapProduct } from "@/lib/mappers"

import { ProductCarousel } from "@/components/ProductCarousel"



interface Props {
  title?: string
  currentProduct?: Product
  limit?: number
}



export function RecommendedTyres({
  title = "Rekommenderade däck",
  currentProduct,
  limit = 8
}: Props) {


  const { data, isLoading } = useSWR(

    [
      "recommended",
      currentProduct?.width,
      currentProduct?.profile,
      currentProduct?.diameter,
      limit
    ],

    async () => {

      /* PRODUCT PAGE → similar tyres */

      if (currentProduct) {

        const res = await productAPI.getAll({

          width: currentProduct.width,
          profile: currentProduct.profile,
          diameter: currentProduct.diameter,
          limit

        })

        return res.products
          .map(mapProduct)
          .filter((p: Product) => p.id !== currentProduct.id)

      }


      /* HOME PAGE → best-selling / latest tyres */

      const res = await productAPI.getAll({

        page: 1,
        limit

      })

      return res.products.map(mapProduct)

    }

  )



  if (isLoading || !data?.length)
    return null



  return (

    <section className="py-12">

      <div className="max-w-7xl mx-auto px-4">

        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          {title}
        </h2>


        {/* ✅ MOBILE CAROUSEL + DESKTOP GRID */}
        <ProductCarousel products={data} />


      </div>

    </section>

  )

}
