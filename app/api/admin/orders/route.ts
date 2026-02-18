import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    data: [
      {
        _id: "ORD-1001",
        customerName: "Erik Larsson",
        productName: "Michelin Pilot Sport 5",
        createdAt: "2026-02-15T09:10:00.000Z",
        totalAmount: 3490,
        status: "completed",
      },
      {
        _id: "ORD-1002",
        customerName: "Anna Svensson",
        productName: "Pirelli Cinturato P7",
        createdAt: "2026-02-16T10:20:00.000Z",
        totalAmount: 2890,
        status: "pending",
      },
    ],
  });
}
