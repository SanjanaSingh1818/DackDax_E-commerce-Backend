import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    data: [
      {
        name: "Michelin Pilot Sport 5",
        image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=200&h=200&fit=crop",
        salesCount: 214,
        revenue: 748000,
      },
      {
        name: "Pirelli Cinturato P7",
        image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=200&h=200&fit=crop",
        salesCount: 171,
        revenue: 534000,
      },
      {
        name: "Bridgestone Turanza T005",
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=200&h=200&fit=crop",
        salesCount: 133,
        revenue: 429000,
      },
    ],
  });
}
