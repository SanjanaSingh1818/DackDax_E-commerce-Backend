import { redirect } from "next/navigation"

export default async function LegacySuccessRedirectPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const qs = new URLSearchParams()

  Object.entries(params || {}).forEach(([key, value]) => {
    if (typeof value === "string") qs.set(key, value)
    else if (Array.isArray(value) && value.length > 0) qs.set(key, value[0] || "")
  })

  redirect(`/success${qs.toString() ? `?${qs.toString()}` : ""}`)
}

