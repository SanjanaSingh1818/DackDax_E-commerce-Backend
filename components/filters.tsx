"use client"

import { useState } from "react"
import { SlidersHorizontal, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

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

interface FilterOptions {
  brand: string[]
  width: number[]
  profile: number[]
  diameter: number[]
  season: string[]
  fuel_rating: string[]
  wet_rating: string[]
  noise_rating: number[]
}

interface FiltersProps {
  filters: FilterValues
  options?: FilterOptions
  onFilterChange: (filters: FilterValues) => void
}

const SEASON_LABELS: Record<string, string> = {
  SOMMARDÄCK: "Sommar",
  VINTERDÄCK: "Vinter",
  "ÅRET RUNT": "Helår",
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
        className="h-12 w-full appearance-none rounded-lg border border-border bg-card px-4 pr-10 text-sm text-foreground hover:border-[#D4AF37]/40 focus:border-[#D4AF37] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
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

export function Filters({ filters, options, onFilterChange }: FiltersProps) {
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

      {/* Season */}
      <FilterSelect
        label="Däcktyp"
        value={filters.season}
        onChange={(v) => update("season", v)}
        options={(options?.season || []).map((s) => ({
          label: SEASON_LABELS[s] || s,
          value: s,
        }))}
      />

      {/* Width */}
      <FilterSelect
        label="Bredd"
        value={filters.width}
        onChange={(v) => update("width", v)}
        options={(options?.width || []).map((w) => ({
          label: `${w}`,
          value: `${w}`,
        }))}
      />

      {/* Profile */}
      <FilterSelect
        label="Profil"
        value={filters.profile}
        onChange={(v) => update("profile", v)}
        options={(options?.profile || []).map((p) => ({
          label: `${p}`,
          value: `${p}`,
        }))}
      />

      {/* Diameter */}
      <FilterSelect
        label="Tum"
        value={filters.diameter}
        onChange={(v) => update("diameter", v)}
        options={(options?.diameter || []).map((d) => ({
          label: `${d}"`,
          value: `${d}`,
        }))}
      />

      {/* Brand */}
      <FilterSelect
        label="Märke"
        value={filters.brand}
        onChange={(v) => update("brand", v)}
        options={(options?.brand || []).map((b) => ({
          label: b,
          value: b,
        }))}
      />

      {/* Fuel */}
      <FilterSelect
        label="Bränsleförbrukning"
        value={filters.fuel_rating}
        onChange={(v) => update("fuel_rating", v)}
        options={(options?.fuel_rating || []).map((r) => ({
          label: `Klass ${r}`,
          value: r,
        }))}
      />

      {/* Wet */}
      <FilterSelect
        label="Våtgrepp"
        value={filters.wet_rating}
        onChange={(v) => update("wet_rating", v)}
        options={(options?.wet_rating || []).map((r) => ({
          label: `Klass ${r}`,
          value: r,
        }))}
      />

      {/* Noise */}
      <FilterSelect
        label="Bullernivå"
        value={filters.noise_rating}
        onChange={(v) => update("noise_rating", v)}
        options={(options?.noise_rating || []).map((n) => ({
          label: `${n} dB`,
          value: `${n}`,
        }))}
      />

    </div>
  )

  return (
    <div className="w-full">

      {/* Mobile */}
      <div className="md:hidden">
        <Button
          variant="outline"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="mb-4 w-full gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filter
          {activeCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#D4AF37] text-[10px] font-bold text-black">
              {activeCount}
            </span>
          )}
        </Button>

        {mobileOpen && (
          <div className="mb-6 rounded-xl border bg-card p-4">
            {filterGrid}

            {activeCount > 0 && (
              <Button
                variant="outline"
                onClick={clearAll}
                className="mt-3 w-full"
              >
                <X className="h-4 w-4 mr-2" />
                Rensa alla filter
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Desktop */}
      <div className="hidden rounded-xl border bg-card p-5 md:block">

        <div className="mb-4 flex justify-between">
          <h3 className="font-semibold flex gap-2 items-center">
            <SlidersHorizontal className="h-4 w-4 text-[#D4AF37]" />
            Filtrera däck
          </h3>

          {activeCount > 0 && (
            <button onClick={clearAll} className="text-sm">
              Rensa ({activeCount})
            </button>
          )}
        </div>

        {filterGrid}

      </div>

    </div>
  )
}
