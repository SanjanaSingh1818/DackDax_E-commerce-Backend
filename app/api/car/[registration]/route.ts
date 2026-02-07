import { CARS } from "@/lib/data"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ registration: string }> }
) {
  const { registration } = await params
  const car = CARS[registration.toUpperCase()]

  if (!car) {
    return NextResponse.json({ error: "Car not found" }, { status: 404 })
  }

  return NextResponse.json(car)
}
