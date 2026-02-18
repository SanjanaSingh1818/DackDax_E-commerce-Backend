import { NextResponse } from "next/server";

const months = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];

export async function GET() {
  return NextResponse.json({
    data: months.map((month, idx) => ({
      month,
      revenue: 60000 + idx * 8500,
    })),
  });
}
