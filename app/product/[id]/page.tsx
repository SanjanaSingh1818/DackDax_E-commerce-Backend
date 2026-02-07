"use client"

import { useParams } from "next/navigation"
import Image from "next/image"
import { useCartStore } from "@/lib/cart-store"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { RecommendedTyres } from "@/components/recommended-tyres"

import { Fuel, Droplets, Volume2, Truck, ShieldCheck } from "lucide-react"

export default function ProductDetailsPage() {

  const params = useParams()

  const addItem = useCartStore(state => state.addItem)

  // TEMP DATA (replace with backend later)
  const product = {
    id: params.id as string,

    brand: "Continental",
    title: "EcoContact 6",

    price: 899,

    image: "/tyre.webp",

    width: 205,
    profile: 55,
    diameter: 16,

    fuel_rating: "A",
    wet_rating: "B",
    noise_rating: "71 dB",

    ean: "4019238023456",
    model: "EcoContact 6",

    availability: "I lager",

    description:
      "Continental EcoContact 6 är ett premium sommardäck med låg bränsleförbrukning, utmärkt våtgrepp och hög komfort.",

  }

  const handleAddToCart = () => {

    addItem({
      id: product.id,
      title: `${product.brand} ${product.title}`,
      price: product.price,
      image: product.image
    })

  }

  const handleBuyNow = async () => {

  const productItem = {
    id: product.id,
    title: `${product.brand} ${product.title}`,
    price: product.price,
    image: product.image,
    quantity: 1,
  }

  // Save temporary buy-now item
  localStorage.setItem("buy-now", JSON.stringify(productItem))

  // Redirect to checkout page
  window.location.href = "/checkout"

}

  return (

    <>
      <Header />

      <div className="bg-[#F9FAFB] py-10">

        <div className="max-w-7xl mx-auto px-4">

          <div className="grid md:grid-cols-2 gap-10">

            {/* LEFT CONTENT */}

            <div>

              {/* Breadcrumb */}
              <p className="text-sm text-gray-500 mb-2">
                Hem / Däck / {product.brand}
              </p>

              {/* Title */}
              <h1 className="text-3xl font-bold mb-3">
                {product.brand} {product.title}
              </h1>

              {/* Size */}
              <p className="text-gray-500 mb-4">
                {product.width}/{product.profile}R{product.diameter}
              </p>

              {/* Ratings */}
              <div className="flex gap-4 mb-4">

                <Badge icon={Fuel} label="Bränsle" value={product.fuel_rating} />

                <Badge icon={Droplets} label="Våtgrepp" value={product.wet_rating} />

                <Badge icon={Volume2} label="Buller" value={product.noise_rating} />

              </div>

              {/* Price */}
              <div className="text-3xl font-bold text-[#B8962E] mb-4">
                {product.price} kr
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-6">
                {product.description}
              </p>

              {/* Action buttons */}
<div className="flex gap-3 mt-6">

  {/* Add to Cart */}
  <Button
    onClick={handleAddToCart}
    variant="outline"
    className="flex-1 border-[#D4AF37] text-[#B8962E] hover:bg-[#D4AF37]/10"
  >
    Lägg i varukorg
  </Button>

  {/* Buy Now */}
  <Button
    onClick={handleBuyNow}
    className="flex-1 bg-[#D4AF37] text-black hover:bg-[#B8962E]"
  >
    Köp nu
  </Button>

</div>


              {/* Benefits */}
              <div className="grid grid-cols-2 gap-4 mt-6">

                <Benefit
                  icon={Truck}
                  title="Fri frakt"
                  text="Gratis leverans över 1000 kr"
                />

                <Benefit
                  icon={ShieldCheck}
                  title="Garanti"
                  text="1 års garanti"
                />

              </div>

            </div>

            {/* RIGHT IMAGE */}

            <div className="bg-white rounded-xl p-10 border">

              <Image
                src={product.image}
                alt={product.title}
                width={400}
                height={400}
                className="mx-auto"
              />

            </div>

          </div>

          {/* SPECIFICATIONS */}

          <div className="bg-white mt-10 rounded-xl border">

            <div className="border-b p-6 font-semibold">
              Specifikationer
            </div>

            <div className="grid md:grid-cols-2">

              <Spec label="EAN" value={product.ean} />
              <Spec label="Märke" value={product.brand} />
              <Spec label="Modell" value={product.model} />
              <Spec label="Bredd" value={product.width} />
              <Spec label="Profil" value={product.profile} />
              <Spec label="Tum" value={product.diameter} />
              <Spec label="Bränsleklass" value={product.fuel_rating} />
              <Spec label="Våtgrepp" value={product.wet_rating} />
              <Spec label="Buller" value={product.noise_rating} />

            </div>

          </div>
<RecommendedTyres
  title="Liknande däck"
  products={[
    product,
    product,
    product,
    product,
  ]}
/>

        </div>

      </div>

      <Footer />

    </>

  )

}

/* Components */

function Badge({ icon: Icon, label, value }: any) {

  return (

    <div className="flex items-center gap-2 bg-white border px-4 py-2 rounded">

      <Icon size={18} />

      <div>
        <div className="text-xs text-gray-500">{label}</div>
        <div className="font-semibold">{value}</div>
      </div>

    </div>

  )

}

function Benefit({ icon: Icon, title, text }: any) {

  return (

    <div className="flex gap-3 bg-white border p-4 rounded">

      <Icon className="text-[#B8962E]" />

      <div>
        <div className="font-semibold">{title}</div>
        <div className="text-sm text-gray-500">{text}</div>
      </div>

    </div>

  )

}

function Spec({ label, value }: any) {

  return (

    <div className="flex justify-between p-4 border-b">

      <span className="text-gray-500">{label}</span>

      <span className="font-medium">{value}</span>

    </div>

  )

}
