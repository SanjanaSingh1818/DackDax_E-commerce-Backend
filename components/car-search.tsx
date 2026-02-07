"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Search, Car, Ruler } from "lucide-react"
import { Button } from "@/components/ui/button"
import { WIDTHS, PROFILES, DIAMETERS } from "@/lib/data"

const HERO_IMAGES = ["/hero1.jpg", "/hero2.webp", "/hero3.jpg"]

export function CarSearch() {
  const router = useRouter()
  const [registration, setRegistration] = useState("")
  const [carError, setCarError] = useState("")
  const [carLoading, setCarLoading] = useState(false)
  const [width, setWidth] = useState("")
  const [profile, setProfile] = useState("")
  const [diameter, setDiameter] = useState("")
  const [currentImage, setCurrentImage] = useState(0)

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
            src={src || "/placeholder.svg"}
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
                    aria-label="Registreringsnummer"
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
              <p className="mt-2 text-sm text-red-400">{carError}</p>
            )}
          </div>

          {/* Dimension Search */}
          <div className="rounded-xl border border-white/10 bg-white/10 p-6 backdrop-blur-md">
            <div className="mb-4 flex items-center gap-2">
              <Ruler className="h-5 w-5 text-[#D4AF37]" />
              <h2 className="text-base font-semibold text-white">
                Dackdimensioner
              </h2>
            </div>
            <div className="flex gap-2">
              <select
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="h-11 flex-1 rounded-lg border border-white/20 bg-white/5 px-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                aria-label="Bredd"
              >
                <option value="" className="bg-[#111827] text-white">Bredd</option>
                {WIDTHS.map((w) => (
                  <option key={w} value={w} className="bg-[#111827] text-white">
                    {w}
                  </option>
                ))}
              </select>
              <select
                value={profile}
                onChange={(e) => setProfile(e.target.value)}
                className="h-11 flex-1 rounded-lg border border-white/20 bg-white/5 px-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                aria-label="Profil"
              >
                <option value="" className="bg-[#111827] text-white">Profil</option>
                {PROFILES.map((p) => (
                  <option key={p} value={p} className="bg-[#111827] text-white">
                    {p}
                  </option>
                ))}
              </select>
              <select
                value={diameter}
                onChange={(e) => setDiameter(e.target.value)}
                className="h-11 flex-1 rounded-lg border border-white/20 bg-white/5 px-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                aria-label="Tum"
              >
                <option value="" className="bg-[#111827] text-white">Tum</option>
                {DIAMETERS.map((d) => (
                  <option key={d} value={d} className="bg-[#111827] text-white">
                    {d}
                  </option>
                ))}
              </select>
              <Button
                onClick={handleDimensionSearch}
                className="h-11 gap-2 bg-[#D4AF37] text-[#0B0B0B] hover:bg-[#B8962E]"
              >
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Sok</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
