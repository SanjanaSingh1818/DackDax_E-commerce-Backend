"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import Image from "next/image"
import { Search, Car, Ruler } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WIDTHS, PROFILES, DIAMETERS } from "@/lib/data"
import { productAPI } from "@/lib/api"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const HERO_IMAGES = ["/hero1.jpg", "/hero2.webp", "/hero3.jpg"]

export function CarSearch() {

  const router = useRouter()

  const [registration, setRegistration] = useState("")
  const [carError, setCarError] = useState("")
  const [carLoading, setCarLoading] = useState(false)

  const [width, setWidth] = useState("")
  const [profile, setProfile] = useState("")
  const [diameter, setDiameter] = useState("")
  const [brand, setBrand] = useState("")

  const [currentImage, setCurrentImage] = useState(0)

  /* ✅ FETCH BRANDS FROM SAME API AS PRODUCT LISTING */
  const { data: filterOptions } = useSWR(
    "productFilters",
    productAPI.getFilters
  )

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % HERO_IMAGES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  async function handleRegSearch() {

    if (!registration.trim()) return

    setCarError("")
    setCarLoading(true)

    try {

      const res = await fetch(`/api/car/${registration.trim()}`)

      if (!res.ok) {
        setCarError("Bilen hittades inte. Prova ABC123, XYZ789, DEF456 eller GHI321.")
        return
      }

      const car = await res.json()

      const params = new URLSearchParams()

      if (car.width) params.set("width", car.width.toString())
      if (car.profile) params.set("profile", car.profile.toString())
      if (car.diameter) params.set("diameter", car.diameter.toString())

      router.push(`/products?${params.toString()}`)

    } catch {

      setCarError("Nagot gick fel. Forsok igen.")

    } finally {

      setCarLoading(false)

    }
  }

  function handleDimensionSearch() {

    const params = new URLSearchParams()

    if (width) params.set("width", width)
    if (profile) params.set("profile", profile)
    if (diameter) params.set("diameter", diameter)
    if (brand) params.set("brand", brand)

    router.push(`/products?${params.toString()}`)
  }

  return (
    <section className="relative overflow-hidden px-4 py-20 md:py-28">

      {/* Animated background images */}
      {HERO_IMAGES.map((src, i) => (
        <div
          key={src}
          className="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out"
          style={{ opacity: i === currentImage ? 1 : 0 }}
        >
          <Image
            src={src}
            alt=""
            fill
            className="object-cover"
            priority={i === 0}
            sizes="100vw"
          />
        </div>
      ))}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#0B0B0B]/75" />

      <div className="relative z-10 mx-auto max-w-5xl">

        <h1 className="mb-2 text-center text-3xl font-bold text-white md:text-4xl lg:text-5xl text-balance">
          Hitta ratt dack till din bil
        </h1>

        <p className="mb-10 text-center text-neutral-300 md:text-lg">
          Sok med registreringsnummer eller dackdimensioner
        </p>

        <div className="grid gap-6 md:grid-cols-2">

          {/* Registration Search */}
          <div className="rounded-xl border border-white/10 bg-white/10 p-6 backdrop-blur-md">

            <div className="mb-4 flex items-center gap-2">
              <Car className="h-5 w-5 text-[#D4AF37]" />
              <h2 className="text-base font-semibold text-white">
                Registreringsnummer
              </h2>
            </div>

            <div className="flex gap-2">

              <div className="relative flex-1">

                <div className="flex items-center overflow-hidden rounded-lg border-2 border-white/20 bg-white/5 transition-colors focus-within:border-[#D4AF37]">

                  <span className="flex h-11 items-center bg-[#D4AF37] px-2.5 text-xs font-bold text-[#0B0B0B]">
                    SE
                  </span>

                  <input
                    type="text"
                    placeholder="ABC123"
                    value={registration}
                    onChange={(e) => {
                      setRegistration(e.target.value.toUpperCase())
                      setCarError("")
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleRegSearch()}
                    className="h-11 flex-1 bg-transparent px-3 text-base font-mono font-semibold tracking-widest text-white placeholder:text-neutral-500 focus:outline-none"
                    maxLength={6}
                  />

                </div>

              </div>

              <Button
                onClick={handleRegSearch}
                disabled={carLoading}
                className="h-11 gap-2 bg-[#D4AF37] text-[#0B0B0B] hover:bg-[#B8962E]"
              >
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Sok</span>
              </Button>

            </div>

            {carError && (
              <p className="mt-2 text-sm text-red-400">
                {carError}
              </p>
            )}

          </div>


          {/* Dimension Search (UPDATED ONLY BRAND SOURCE) */}
<div className="rounded-xl border border-white/10 bg-white/10 p-6 backdrop-blur-md">

  <div className="mb-4 flex items-center gap-2">
    <Ruler className="h-5 w-5 text-[#D4AF37]" />
    <h2 className="text-base font-semibold text-white">
      Dackdimensioner
    </h2>
  </div>

  <div className="flex flex-wrap gap-2">

    {/* WIDTH */}
    <Select value={width} onValueChange={setWidth}>
      <SelectTrigger className="h-11 flex-1 min-w-[90px] bg-white/5 text-white border border-white/20 focus:ring-2 focus:ring-[#D4AF37]">
        <SelectValue placeholder="Bredd" />
      </SelectTrigger>
      <SelectContent className="bg-[#111827] text-white border border-white/10">
        {WIDTHS.map((w) => (
          <SelectItem
            key={w}
            value={w.toString()}
            className="focus:bg-[#D4AF37] focus:text-black"
          >
            {w}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>


    {/* PROFILE */}
    <Select value={profile} onValueChange={setProfile}>
      <SelectTrigger className="h-11 flex-1 min-w-[90px] bg-white/5 text-white border border-white/20 focus:ring-2 focus:ring-[#D4AF37]">
        <SelectValue placeholder="Profil" />
      </SelectTrigger>
      <SelectContent className="bg-[#111827] text-white border border-white/10">
        {PROFILES.map((p) => (
          <SelectItem
            key={p}
            value={p.toString()}
            className="focus:bg-[#D4AF37] focus:text-black"
          >
            {p}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>


    {/* DIAMETER */}
    <Select value={diameter} onValueChange={setDiameter}>
      <SelectTrigger className="h-11 flex-1 min-w-[90px] bg-white/5 text-white border border-white/20 focus:ring-2 focus:ring-[#D4AF37]">
        <SelectValue placeholder="Tum" />
      </SelectTrigger>
      <SelectContent className="bg-[#111827] text-white border border-white/10">
        {DIAMETERS.map((d) => (
          <SelectItem
            key={d}
            value={d.toString()}
            className="focus:bg-[#D4AF37] focus:text-black"
          >
            {d}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>


    {/* BRAND + SEARCH grouped together */}
    <div className="flex gap-2 flex-1 min-w-[220px]">

      {/* BRAND */}
      <Select value={brand} onValueChange={setBrand}>
        <SelectTrigger className="h-11 flex-1 bg-white/5 text-white border border-white/20 focus:ring-2 focus:ring-[#D4AF37]">
          <SelectValue placeholder="Marke" />
        </SelectTrigger>

        <SelectContent className="bg-[#111827] text-white border border-white/10">
          {filterOptions?.brand?.map((b: string) => (
            <SelectItem
              key={b}
              value={b}
              className="focus:bg-[#D4AF37] focus:text-black"
            >
              {b}
            </SelectItem>
          ))}
        </SelectContent>

      </Select>


      {/* SEARCH BUTTON */}
      <Button
        onClick={handleDimensionSearch}
        className="h-11 bg-[#D4AF37] text-[#0B0B0B] hover:bg-[#B8962E] whitespace-nowrap"
      >
        <Search className="h-4 w-4 mr-1" />
        Sok
      </Button>

    </div>

  </div>

</div>




        </div>
      </div>
    </section>
  )
}
