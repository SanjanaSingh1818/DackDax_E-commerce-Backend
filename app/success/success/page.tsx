"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function LegacySuccessRedirectPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const qs = searchParams.toString()
    router.replace(`/success${qs ? `?${qs}` : ""}`)
  }, [router, searchParams])

  return null
}

