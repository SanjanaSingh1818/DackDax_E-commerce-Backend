export interface Product {
  id: number
  brand: string
  title: string
  width: number
  profile: number
  diameter: number
  fuel_rating: string
  wet_rating: string
  noise_rating: string
  price: number
  image: string
  season: string
  availability: string
}

export interface CarInfo {
  registration: string
  make: string
  model: string
  year: number
  width: number
  profile: number
  diameter: number
}

export const BRANDS = [
  "Continental",
  "Michelin",
  "Pirelli",
  "Bridgestone",
  "Goodyear",
  "Nokian",
  "Hankook",
  "Dunlop",
]

export const WIDTHS = [155, 165, 175, 185, 195, 205, 215, 225, 235, 245, 255]
export const PROFILES = [35, 40, 45, 50, 55, 60, 65, 70]
export const DIAMETERS = [14, 15, 16, 17, 18, 19, 20]
export const SEASONS = ["Summer", "Winter", "All-Season"]
export const FUEL_RATINGS = ["A", "B", "C", "D", "E"]
export const WET_RATINGS = ["A", "B", "C", "D", "E"]
export const NOISE_RATINGS = ["67 dB", "68 dB", "69 dB", "70 dB", "71 dB", "72 dB", "73 dB"]

const PRODUCT_NAMES: Record<string, string[]> = {
  Continental: ["EcoContact 6", "PremiumContact 7", "WinterContact TS 870", "AllSeasonContact 2"],
  Michelin: ["Primacy 4+", "Pilot Sport 5", "Alpin 6", "CrossClimate 2"],
  Pirelli: ["Cinturato P7", "P Zero", "Sottozero 3", "Scorpion Verde"],
  Bridgestone: ["Turanza T005", "Potenza Sport", "Blizzak LM005", "Weather Control A005"],
  Goodyear: ["EfficientGrip 2", "Eagle F1 Asymmetric 6", "UltraGrip 9+", "Vector 4Seasons Gen-3"],
  Nokian: ["Hakka Green 3", "Hakka Black 2", "Hakkapeliitta R5", "Seasonproof"],
  Hankook: ["Ventus Prime 4", "Ventus S1 evo 3", "Winter i*cept RS3", "Kinergy 4S2"],
  Dunlop: ["Sport BluResponse 2", "Sport Maxx RT 2", "Winter Sport 5", "All Season 2"],
}

function generateProducts(): Product[] {
  const products: Product[] = []
  let id = 1

  for (const brand of BRANDS) {
    const names = PRODUCT_NAMES[brand]
    for (const name of names) {
      const seasonIndex = names.indexOf(name)
      const season =
        seasonIndex === 0 ? "Summer" : seasonIndex === 1 ? "Summer" : seasonIndex === 2 ? "Winter" : "All-Season"

      for (let variant = 0; variant < 3; variant++) {
        const widthIdx = (id + variant) % WIDTHS.length
        const profileIdx = (id + variant + 2) % PROFILES.length
        const diameterIdx = (id + variant + 1) % DIAMETERS.length

        products.push({
          id: id++,
          brand,
          title: name,
          width: WIDTHS[widthIdx],
          profile: PROFILES[profileIdx],
          diameter: DIAMETERS[diameterIdx],
          fuel_rating: FUEL_RATINGS[variant % FUEL_RATINGS.length],
          wet_rating: WET_RATINGS[(variant + 1) % WET_RATINGS.length],
          noise_rating: NOISE_RATINGS[(variant + 2) % NOISE_RATINGS.length],
          price: Math.round(500 + Math.random() * 1500),
          image: "/tyre.webp",
          season,
          availability: variant % 3 === 0 ? "In stock" : variant % 3 === 1 ? "3-5 days" : "In stock",
        })
      }
    }
  }

  return products
}

export const ALL_PRODUCTS = generateProducts()

export const CARS: Record<string, CarInfo> = {
  ABC123: { registration: "ABC123", make: "Volvo", model: "V60", year: 2021, width: 205, profile: 55, diameter: 16 },
  XYZ789: { registration: "XYZ789", make: "BMW", model: "3 Series", year: 2020, width: 225, profile: 45, diameter: 17 },
  DEF456: { registration: "DEF456", make: "Volkswagen", model: "Golf", year: 2022, width: 195, profile: 65, diameter: 15 },
  GHI321: { registration: "GHI321", make: "Audi", model: "A4", year: 2023, width: 235, profile: 40, diameter: 18 },
}
