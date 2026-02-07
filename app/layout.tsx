import React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"

import "./globals.css"

import AdminInit from "@/components/admin-init"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter"
})

export const metadata: Metadata = {
  title: "DackDax - Dack, Falgar & Kompletta Hjul",
  description:
    "Handla kvalitetsdack, falgar och kompletta hjul hos DackDax. Sok med registreringsnummer eller dackdimensioner.",
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

        {/* App content */}
        {children}

      </body>

    </html>

  )

}
