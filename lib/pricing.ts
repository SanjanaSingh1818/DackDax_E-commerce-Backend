"use client"

import { useEffect, useState } from "react"

export type CustomerType = "privat" | "foretag"

export const CUSTOMER_TYPE_STORAGE_KEY = "customerType"
export const VAT_RATE = 0.25

export function parseCustomerType(value: string | null): CustomerType {
  return value === "foretag" ? "foretag" : "privat"
}

export function getStoredCustomerType(): CustomerType {
  if (typeof window === "undefined") return "privat"
  return parseCustomerType(localStorage.getItem(CUSTOMER_TYPE_STORAGE_KEY))
}

export function setStoredCustomerType(type: CustomerType) {
  if (typeof window === "undefined") return
  localStorage.setItem(CUSTOMER_TYPE_STORAGE_KEY, type)
  window.dispatchEvent(
    new CustomEvent("customer-type-change", { detail: type })
  )
}

export function useCustomerType() {
  const [customerType, setCustomerTypeState] = useState<CustomerType>("privat")

  useEffect(() => {
    const sync = () => setCustomerTypeState(getStoredCustomerType())
    sync()
    window.addEventListener("storage", sync)
    window.addEventListener("customer-type-change", sync as EventListener)
    return () => {
      window.removeEventListener("storage", sync)
      window.removeEventListener("customer-type-change", sync as EventListener)
    }
  }, [])

  const setCustomerType = (type: CustomerType) => {
    setStoredCustomerType(type)
    setCustomerTypeState(type)
  }

  return { customerType, setCustomerType }
}

export function toDisplayPrice(basePrice: number, customerType: CustomerType) {
  if (customerType === "privat") {
    return Math.round(basePrice * (1 + VAT_RATE))
  }
  return Math.round(basePrice)
}

