"use client"

import Link from "next/link"
import Image from "next/image"

const CATEGORIES = [
  {
    label: "Vinterdäck Dubb",
    desc: "Maximal säkerhet på is och packad snö med dubbade däck",
    image: "/winter.jpg",
    href: "/products?season=Winter",
  },
  {
    label: "Vinterdäck Friktion",
    desc: "Tyst komfort och starkt grepp utan dubbar",
    image: "/winterfriction.webp",
    href: "/products?season=Winter",
  },
  {
    label: "Sommardäck",
    desc: "Optimalt grepp och prestanda i varma förhållanden",
    image: "/summer.webp",
    href: "/products?season=Summer",
  },
]

export function CategoryGrid() {

  return (

    <section className="bg-background py-16">

      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-12">

          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Handla efter kategori
          </h2>

          <p className="text-muted-foreground mt-2">
            Välj den däcktyp som passar dina behov
          </p>

        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {CATEGORIES.map((cat) => (

            <Link
              key={cat.label}
              href={cat.href}
              className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition duration-300"
            >

              {/* Image */}
              <div className="relative h-[240px] w-full">

                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

              </div>

              {/* Content */}
         <div className="absolute bottom-0 p-5 text-white w-full flex justify-between items-end">

  <div>
    <h3 className="text-lg font-semibold">{cat.label}</h3>
    <p className="text-sm text-gray-200">{cat.desc}</p>
  </div>

  <span className="text-xl opacity-0 group-hover:opacity-100 transition">
    →
  </span>

</div>

            </Link>

          ))}

        </div>

      </div>

    </section>

  )

}
