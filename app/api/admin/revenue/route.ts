import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://deckdex-backend-1.onrender.com";

type RawOrder = {
  createdAt?: string;
  totalAmount?: number;
  total?: number;
  amount?: number;
};

function monthKey(dateString?: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}`;
}

function monthLabel(key: string) {
  const [year, month] = key.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("sv-SE", { month: "short", year: "numeric" });
}

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

    const monthRevenue = new Map<string, number>();
    orders.forEach((order) => {
      const key = monthKey(order.createdAt);
      if (!key) return;
      monthRevenue.set(key, (monthRevenue.get(key) || 0) + orderAmount(order));
    });

    const data = Array.from(monthRevenue.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, revenue]) => ({ month: monthLabel(month), revenue }));

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
