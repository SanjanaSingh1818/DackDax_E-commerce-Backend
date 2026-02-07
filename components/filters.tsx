"use client"

import { useState } from "react"
import { SlidersHorizontal, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  BRANDS,
  WIDTHS,
  PROFILES,
  DIAMETERS,
  SEASONS,
  FUEL_RATINGS,
  WET_RATINGS,
  NOISE_RATINGS,
} from "@/lib/data"

export interface FilterValues {
  brand: string
  width: string
  profile: string
  diameter: string
  season: string
  fuel_rating: string
  wet_rating: string
  noise_rating: string
  min_price: string
  max_price: string
}

interface FiltersProps {
  filters: FilterValues
  onFilterChange: (filters: FilterValues) => void
}

const SEASON_LABELS: Record<string, string> = {
  Summer: "Sommar",
  Winter: "Vinter",
  "All-Season": "Helars",
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { label: string; value: string }[]
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full appearance-none rounded-lg border border-border bg-card px-4 pr-10 text-sm text-foreground transition-colors hover:border-[#D4AF37]/40 focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
      >
        <option value="">{label}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
    </div>
  )
}

export function Filters({ filters, onFilterChange }: FiltersProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  function update(key: keyof FilterValues, value: string) {
    onFilterChange({ ...filters, [key]: value })
  }

  function clearAll() {
    onFilterChange({
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

  const activeCount = Object.values(filters).filter(Boolean).length

  const filterGrid = (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <FilterSelect
        label="Dacktyp"
        value={filters.season}
        onChange={(v) => update("season", v)}
        options={SEASONS.map((s) => ({ label: SEASON_LABELS[s] || s, value: s }))}
      />
      <FilterSelect
        label="Bredd"
        value={filters.width}
        onChange={(v) => update("width", v)}
        options={WIDTHS.map((w) => ({ label: `${w}`, value: `${w}` }))}
      />
      <FilterSelect
        label="Profil"
        value={filters.profile}
        onChange={(v) => update("profile", v)}
        options={PROFILES.map((p) => ({ label: `${p}`, value: `${p}` }))}
      />
      <FilterSelect
        label="Tum"
        value={filters.diameter}
        onChange={(v) => update("diameter", v)}
        options={DIAMETERS.map((d) => ({ label: `${d}"`, value: `${d}` }))}
      />
      <FilterSelect
        label="Marke"
        value={filters.brand}
        onChange={(v) => update("brand", v)}
        options={BRANDS.map((b) => ({ label: b, value: b }))}
      />
      <FilterSelect
        label="Bransleforbrukning"
        value={filters.fuel_rating}
        onChange={(v) => update("fuel_rating", v)}
        options={FUEL_RATINGS.map((r) => ({ label: `Klass ${r}`, value: r }))}
      />
      <FilterSelect
        label="Vatgrepp"
        value={filters.wet_rating}
        onChange={(v) => update("wet_rating", v)}
        options={WET_RATINGS.map((r) => ({ label: `Klass ${r}`, value: r }))}
      />
      <FilterSelect
        label="Bullerniva"
        value={filters.noise_rating}
        onChange={(v) => update("noise_rating", v)}
        options={NOISE_RATINGS.map((n) => ({ label: n, value: n }))}
      />
    </div>
  )

  return (
    <div className="w-full">
      {/* Mobile Toggle */}
      <div className="md:hidden">
        <Button
          variant="outline"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="mb-4 w-full gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filter
          {activeCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#D4AF37] text-[10px] font-bold text-[#0B0B0B]">
              {activeCount}
            </span>
          )}
        </Button>
        {mobileOpen && (
          <div className="mb-6 rounded-xl border border-border bg-card p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Filter</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileOpen(false)}
                className="h-8 w-8"
                aria-label="Stang filter"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {filterGrid}
            {activeCount > 0 && (
              <Button variant="outline" onClick={clearAll} className="mt-3 w-full gap-2 bg-transparent">
                <X className="h-4 w-4" />
                Rensa alla filter ({activeCount})
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Desktop: Horizontal filter bar */}
      <div className="hidden rounded-xl border border-border bg-card p-5 md:block">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-[#D4AF37]" />
            <h3 className="text-sm font-semibold text-foreground">Filtrera dack</h3>
          </div>
          {activeCount > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
              Rensa alla ({activeCount})
            </button>
          )}
        </div>
        {filterGrid}
      </div>
    </div>
  )
}
