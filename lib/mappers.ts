import type { Product } from "@/lib/data"

/**
 * Extract width, profile, diameter from size_index string
 * Example: "165/60R14 79T"
 */


/**
 * Maps backend product (MongoDB schema)
 * → frontend Product type
 */
export function mapProduct(apiProduct: any): Product {

  // extract from size_index if needed


  return {
    id: apiProduct._id ?? apiProduct.id,

    title: apiProduct.title || apiProduct.name || "",
    brand: apiProduct.brand || "",
    size_index: apiProduct.size_index,
    price: apiProduct.price,

    image: apiProduct.image || apiProduct.images?.[0] || "/placeholder.png",

    // ✅ use direct values OR fallback to size_index extraction
    width: apiProduct.width ,
    profile: apiProduct.profile ,
    diameter: apiProduct.diameter ,

    season: apiProduct.season || "",
    dimensions: apiProduct.dimensions || apiProduct.size_index || "",

    fuel_rating: apiProduct.fuel_rating || "",
    wet_rating: apiProduct.wet_rating || "",
    noise_rating: apiProduct.noise_rating || "",

    description: apiProduct.description || "",
    stock: apiProduct.stock ?? 0,

    availability: apiProduct.availability || "In stock",
  }
}
