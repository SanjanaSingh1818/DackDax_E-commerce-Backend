import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    data: {
      totalRevenue: 1245800,
      totalOrders: 438,
      totalCustomers: 297,
      totalTyresSold: 912,
      revenueGrowth: 8.4,
      ordersGrowth: 5.1,
      customersGrowth: 4.2,
      tyresGrowth: 6.9,
      salesPercentage: 72,
      totalSalesNumber: 912,
    },
  });
}
