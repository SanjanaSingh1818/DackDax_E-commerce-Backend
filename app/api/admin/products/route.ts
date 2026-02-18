import { NextResponse } from "next/server";
import { ALL_PRODUCTS } from "@/lib/data";

export async function GET() {
  return NextResponse.json({
    data: ALL_PRODUCTS,
  });
}
