import React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

import "./globals.css"

import AdminInit from "@/components/admin-init"
import CartSyncProvider from "@/components/cart-sync-provider"   // ✅ ADD THIS

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
})

export const metadata: Metadata = {
  title: "DackDax - Dack, Falgar & Kompletta Hjul",
  description:
    "Handla kvalitetsdack, falgar och kompletta hjul hos DackDax. Sok med registreringsnummer eller dackdimensioner.",

  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
  },
  manifest: "/site.webmanifest",
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (

    <html lang="sv" className={inter.variable}>

      <body className="font-sans antialiased">

        {/* Admin initializer */}
        <AdminInit />

        {/* ✅ GLOBAL CART SYNC PROVIDER */}
        <CartSyncProvider>

          {/* App content */}
          {children}

        </CartSyncProvider>

      </body>

    </html>

  )

}
