"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ShoppingCart,
  GitCompareArrows,
  User,
  Menu,
  X,
  Phone,
  CreditCard,
  LogOut,
  LayoutDashboard
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/cart-store"

const NAV_ITEMS = [
  { label: "Hem", href: "/" },
  { label: "Produkter", href: "/products" },
  { label: "Dack", href: "/products?season=" },

]

export function Header() {

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const [customerType, setCustomerType] =
    useState<"privat" | "foretag">("privat")

  const [user, setUser] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  /* Cart count */
  const cartCount = useCartStore((state) => state.getCount())

  /* Load user */
useEffect(() => {

  try {

    const token = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (token && storedUser) {

      setUser(JSON.parse(storedUser))

    }

  } catch {}

}, [])

  useEffect(() => {
    setMounted(true)
  }, [])


  /* Logout */
function handleLogout() {

  localStorage.removeItem("token")

  localStorage.removeItem("user")

  /* DO NOT REMOVE CART */

  window.location.reload()

}



  return (

    <header className="sticky top-0 z-50">

      {/* Top bar */}
      <div className="border-b border-[#1F2937] bg-[#0B0B0B]">

        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">

          {/* Left */}
          <div className="flex items-center gap-4">

            {/* AUTH SECTION */}
            {!user ? (

              <Link href="/login">

                <button className="flex flex-col items-center gap-0.5 text-neutral-400 hover:text-white">

                  <User className="h-5 w-5" />

                  <span className="text-[10px] font-medium">
                    Logga in
                  </span>

                </button>

              </Link>

            ) : (

              <div className="flex items-center gap-3">

                {/* User name */}
                <div className="text-xs text-white font-medium">

                  Hej, {user.name || user.email}

                </div>

                {/* Admin link */}
                {user.role === "admin" && (

                  <Link
                    href="/admin"
                    className="flex items-center gap-1 text-xs text-[#D4AF37] hover:underline"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Admin
                  </Link>

                )}

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex flex-col items-center gap-0.5 text-neutral-400 hover:text-red-400"
                >
                  <LogOut className="h-5 w-5" />

                  <span className="text-[10px] font-medium">
                    Logout
                  </span>

                </button>

              </div>

            )}

            {/* Flag */}
            <div className="flex items-center gap-1">
              <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border-2 border-[#D4AF37]">
                <div className="relative h-full w-full">
                  <div className="absolute inset-0 bg-[#006AA7]" />
                  <div className="absolute inset-y-0 left-[28%] w-[14%] bg-[#FECC00]" />
                  <div className="absolute inset-x-0 top-[38%] h-[14%] bg-[#FECC00]" />
                </div>
              </div>
            </div>

          </div>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">

            <span className="text-2xl font-black tracking-tight text-white md:text-3xl">

              DACK<span className="text-[#D4AF37]">DAX</span>

            </span>

          </Link>

          {/* Right */}
          <div className="flex items-center gap-3 md:gap-5">

            {/* Customer toggle */}
            <div className="hidden items-center gap-3 sm:flex">

              <button
                onClick={() => setCustomerType("privat")}
                className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                  customerType === "privat"
                    ? "text-[#D4AF37]"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <span className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 ${
                  customerType === "privat"
                    ? "border-[#D4AF37]"
                    : "border-neutral-500"
                }`}>
                  {customerType === "privat" &&
                    <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
                  }
                </span>
                <span>Privat</span>
                <span className="text-[10px] text-neutral-500">
                  (inkl. moms)
                </span>
              </button>

              <button
                onClick={() => setCustomerType("foretag")}
                className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                  customerType === "foretag"
                    ? "text-[#D4AF37]"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <span className={`flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 ${
                  customerType === "foretag"
                    ? "border-[#D4AF37]"
                    : "border-neutral-500"
                }`}>
                  {customerType === "foretag" &&
                    <span className="h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
                  }
                </span>
                <span>Foretag</span>
                <span className="text-[10px] text-neutral-500">
                  (exkl. moms)
                </span>
              </button>

            </div>

            {/* Compare */}
            <button className="flex flex-col items-center gap-0.5 text-neutral-400 hover:text-white">

              <div className="relative">

                <GitCompareArrows className="h-5 w-5" />

                <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#D4AF37] text-[9px] font-bold text-[#0B0B0B]">
                  0
                </span>

              </div>

              <span className="text-[10px] font-medium">
                Jamfor
              </span>

            </button>

            {/* Cart */}
            <Link
              href="/cart"
              className="flex flex-col items-center gap-0.5 text-neutral-400 hover:text-white"
            >

              <div className="relative">

                <ShoppingCart className="h-5 w-5" />

                {mounted && cartCount > 0 && (

                  <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#D4AF37] text-[9px] font-bold text-[#0B0B0B]">

                    {cartCount}

                  </span>

                )}

              </div>

              <span className="text-[10px] font-medium">
                Varukorg
              </span>

            </Link>

            {/* Mobile toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="text-neutral-400 hover:bg-[#1F2937] hover:text-white lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >

              {mobileMenuOpen
                ? <X className="h-5 w-5" />
                : <Menu className="h-5 w-5" />
              }

            </Button>

          </div>

        </div>

      </div>

      {/* Navigation */}
      <nav className="hidden border-b border-[#1F2937] bg-[#111827] lg:block">

        <div className="mx-auto flex max-w-7xl items-center justify-center px-4">

          {NAV_ITEMS.map((item, idx) => (

            <Link
              key={item.label}
              href={item.href}
              className="flex items-center px-6 py-3 text-sm font-semibold uppercase tracking-wide text-neutral-300 hover:text-[#D4AF37]"
            >

              {item.label}

              {idx < NAV_ITEMS.length - 1 && (

                <span className="ml-6 text-neutral-600">|</span>

              )}

            </Link>

          ))}

        </div>

      </nav>

      {/* Info strip */}
      <div className="hidden border-b border-[#1F2937] bg-[#0B0B0B] px-4 py-1.5 lg:block">

        <div className="mx-auto flex max-w-7xl items-center justify-between">

          <div className="flex items-center gap-2 text-xs text-neutral-400">

            <Phone className="h-3.5 w-3.5" />

            <span>0771-977 977</span>

          </div>

          <div className="flex items-center gap-2 text-xs text-[#D4AF37]">

            <CreditCard className="h-3.5 w-3.5" />

            <span>Rantefri delbetalning!</span>

          </div>

        </div>

      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (

        <div className="border-b border-[#1F2937] bg-[#0B0B0B] lg:hidden">

          <nav className="flex flex-col px-4 py-3">

            {NAV_ITEMS.map((item) => (

              <Link
                key={item.label}
                href={item.href}
                className="rounded-md px-3 py-2.5 text-sm font-semibold uppercase tracking-wide text-neutral-300 hover:bg-[#1F2937] hover:text-[#D4AF37]"
                onClick={() => setMobileMenuOpen(false)}
              >

                {item.label}

              </Link>

            ))}

          </nav>

        </div>

      )}

    </header>

  )

}
