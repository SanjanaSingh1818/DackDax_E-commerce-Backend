"use client"

import { useRef, useState } from "react"
import type { Product } from "@/lib/data"
import { ProductCard } from "@/components/product-card"

export function ProductCarousel({
  products,
}: {
  products: Product[]
}) {

  const scrollRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  /* Handle scroll to update dots */
  const handleScroll = () => {

    if (!scrollRef.current) return

    const container = scrollRef.current
    const scrollLeft = container.scrollLeft
    const width = container.clientWidth

    const index = Math.round(scrollLeft / width)

    setCurrentIndex(index)

  }

  /* Scroll when clicking dots */
  const scrollToIndex = (index: number) => {

    if (!scrollRef.current) return

    scrollRef.current.scrollTo({
      left: index * scrollRef.current.clientWidth,
      behavior: "smooth",
    })

  }

  return (
    <div className="w-full">

      {/* ===================== */}
      {/* MOBILE / TABLET CAROUSEL */}
      {/* ===================== */}

      <div className="lg:hidden">

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="
            flex
            overflow-x-auto
            snap-x
            snap-mandatory
            scroll-smooth
            scrollbar-hide
          "
        >

          {products.map((product, index) => (

            <div
              key={
                (product as any)._id ||
                product.id ||
                index
              }
              className="
                w-full
                flex-shrink-0
                snap-center
                px-2
              "
            >
              <ProductCard product={product} />
            </div>

          ))}

        </div>


        {/* DOT INDICATORS */}

        <div className="flex justify-center gap-2 mt-4">

          {products.map((_, index) => (

            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className={`
                transition-all duration-300 rounded-full
                ${
                  currentIndex === index
                    ? "w-6 h-2 bg-[#D4AF37]"
                    : "w-2 h-2 bg-gray-400"
                }
              `}
            />

          ))}

        </div>

      </div>


      {/* ===================== */}
      {/* DESKTOP GRID */}
      {/* ===================== */}

      <div className="
        hidden
        lg:grid
        grid-cols-4
        gap-6
      ">

        {products.map((product, index) => (

          <ProductCard
            key={
              (product as any)._id ||
              product.id ||
              index
            }
            product={product}
          />

        ))}

      </div>

    </div>
  )
}
