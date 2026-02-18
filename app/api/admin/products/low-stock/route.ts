import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    data: [
      { id: "LS-1", name: "Continental EcoContact 6", stock: 4, threshold: 10 },
      { id: "LS-2", name: "Goodyear EfficientGrip", stock: 6, threshold: 10 },
      { id: "LS-3", name: "Nokian Snowproof", stock: 2, threshold: 8 },
    ],
  });
}
