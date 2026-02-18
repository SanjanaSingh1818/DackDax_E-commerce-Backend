import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://deckdex-backend-1.onrender.com";

type RawOrder = {
  totalAmount?: number;
  total?: number;
  amount?: number;
  customer?: { email?: string };
  items?: Array<{ quantity?: number }>;
};

function orderAmount(order: RawOrder) {
  return Number(order.totalAmount) || Number(order.total) || Number(order.amount) || 0;
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Missing authorization header." }, { status: 401 });
    }

    const response = await fetch(`${API_BASE}/api/orders`, {
      cache: "no-store",
      headers: { Authorization: authHeader },
    });
    const payload = (await response.json().catch(() => [])) as unknown;

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch orders from backend.", details: payload },
        { status: response.status }
      );
    }

    const orders = (Array.isArray(payload)
      ? payload
      : Array.isArray((payload as { orders?: unknown[] })?.orders)
        ? (payload as { orders: unknown[] }).orders
        : []) as RawOrder[];

    const totalRevenue = orders.reduce((sum, order) => sum + orderAmount(order), 0);
    const totalOrders = orders.length;
    const totalCustomers = new Set(
      orders.map((order) => String(order.customer?.email || "").trim().toLowerCase()).filter(Boolean)
    ).size;
    const totalTyresSold = orders.reduce(
      (sum, order) => sum + (order.items || []).reduce((q, item) => q + (Number(item.quantity) || 0), 0),
      0
    );
    const salesPercentage = totalTyresSold > 0 ? Math.min(100, (totalOrders / totalTyresSold) * 100) : 0;

    return NextResponse.json({
      data: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalTyresSold,
        revenueGrowth: 0,
        ordersGrowth: 0,
        customersGrowth: 0,
        tyresGrowth: 0,
        salesPercentage,
        totalSalesNumber: totalTyresSold,
      },
    });
  } catch {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
