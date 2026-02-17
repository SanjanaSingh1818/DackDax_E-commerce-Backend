"use client"

import Image from "next/image"
import Link from "next/link"
import { Trash2, GitCompareArrows } from "lucide-react"

import { useCompareStore } from "@/lib/compare-store"
import { toDisplayPrice, useCustomerType } from "@/lib/pricing"
import { Button } from "@/components/ui/button"

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[120px_1fr] border-b border-neutral-200 px-3 py-2 text-xs">
      <span className="font-semibold text-neutral-700">{label}</span>
      <span className="text-neutral-600">{value || "-"}</span>
    </div>
  )
}

export function CompareProducts() {
  const items = useCompareStore((state) => state.items)
  const removeItem = useCompareStore((state) => state.removeItem)
  const clearItems = useCompareStore((state) => state.clearItems)
  const { customerType } = useCustomerType()

  if (!items.length) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-10 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-neutral-600">
            <GitCompareArrows className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900">Jamfor produkter</h1>
          <p className="mt-2 text-sm text-neutral-600">Inga produkter valda an. Lagg till produkter for att jamfora.</p>
          <Link href="/products" className="mt-6 inline-block">
            <Button className="bg-[#D4AF37] text-[#0B0B0B] hover:bg-[#B8962E]">Ga till produkter</Button>
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8 border-b border-neutral-200 pb-4">
        <h1 className="text-center text-3xl font-black tracking-tight text-neutral-900">JAMFOR PRODUKTER</h1>
      </div>

      <div className="mb-6 flex items-center justify-between border-b border-[#3B82F6] pb-2">
        <div className="flex items-center gap-6 text-xl font-semibold text-neutral-700">
          <span className="text-[#2563EB]">Dack ({items.length})</span>
          <span>Falgar (0)</span>
        </div>

        <Button variant="outline" onClick={clearItems}>
          Rensa alla
        </Button>
      </div>

      <div className={`grid gap-5 ${items.length === 1 ? "grid-cols-1" : items.length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2 xl:grid-cols-4"}`}>
        {items.map((item) => {
          const pricePerPiece = toDisplayPrice(item.price, customerType)
          const packPrice = pricePerPiece * 4

          return (
            <article key={item.id} className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
              <div className="relative border-b border-neutral-200 bg-[#F8FAFC] p-3">
                <button
                  onClick={() => removeItem(item.id)}
                  className="absolute right-3 top-3 text-rose-500 hover:text-rose-600"
                  aria-label="Remove from compare"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <div className="relative mx-auto h-52 w-full max-w-[250px]">
                  <Image src={item.image || "/placeholder.svg"} alt={`${item.brand} ${item.title}`} fill className="object-contain" />
                </div>
              </div>

              <div className="p-3">
                <p className="text-xs font-bold uppercase tracking-wide text-neutral-500">{item.brand || "-"}</p>
                <h2 className="mt-1 min-h-12 text-lg font-semibold leading-6 text-neutral-900">
                  {(item.dimensions ? `${item.dimensions} ` : "") + item.title}
                </h2>

                <div className="mt-3 flex items-end gap-4">
                  <p className="text-3xl font-black text-[#111827]">
                    {packPrice} <span className="text-lg font-medium">SEK/4st</span>
                  </p>
                  <p className="text-2xl font-semibold text-neutral-700">{pricePerPiece} SEK/st</p>
                </div>

                <p className="mt-2 text-sm text-emerald-700">Leveranstid cirka 2-4 dagar</p>
              </div>

              <div className="bg-[#F9FAFB]">
                <SpecRow label="Marke:" value={item.brand || "-"} />
          
                <SpecRow label="Titel:" value={item.title || "-"} />
                <SpecRow label="Storlek:" value={item.dimensions || "-"} />
                <SpecRow label="Size index:" value={item.size_index || "-"} />
                <SpecRow label="Bredd:" value={item.width ? String(item.width) : "-"} />
                <SpecRow label="Profil:" value={item.profile ? String(item.profile) : "-"} />
                <SpecRow label="Diameter:" value={item.diameter ? String(item.diameter) : "-"} />
                <SpecRow label="Hastighetsklass:" value={String(item.speed_rating || "-")} />
                <SpecRow label="Belastningsindex:" value={String(item.load_index || "-")} />
                <SpecRow label="Bransleklass:" value={item.fuel_rating || "-"} />
                <SpecRow label="Vatgrepp:" value={item.wet_rating || "-"} />
                <SpecRow label="Ljudniva:" value={item.noise_rating ? `${item.noise_rating} dB` : "-"} />
                <SpecRow label="Sasong:" value={item.season || "-"} />
              
                <SpecRow label="Tillganglighet:" value={item.availability || "-"} />
                <SpecRow label="Pris/st:" value={`${pricePerPiece} SEK`} />
                <SpecRow label="Pris 4st:" value={`${packPrice} SEK`} />
              </div>

              <div className="p-3">
                <p className="text-xs font-semibold uppercase text-neutral-700">Information</p>
                <p className="mt-1 text-sm leading-6 text-neutral-700">
                  {item.description || `${item.brand} ${item.title} ar ett kvalitetsdack som passar svenska vagforhallanden.`}
                </p>
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-xs font-medium text-blue-600 hover:underline"
                  >
                    Produktlank
                  </a>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
