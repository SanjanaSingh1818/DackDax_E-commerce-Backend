import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://deckdex-backend-1.onrender.com";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Missing authorization header." }, { status: 401 });
    }

    const response = await fetch(`${API_BASE}/api/orders`, {
      cache: "no-store",
      headers: {
        Authorization: authHeader,
      },
    });

    const payload = (await response.json().catch(() => [])) as unknown;

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch orders from backend.", details: payload },
        { status: response.status }
      );
    }

    const rows = Array.isArray(payload)
      ? payload
      : Array.isArray((payload as { orders?: unknown[] })?.orders)
        ? (payload as { orders: unknown[] }).orders
        : [];

    return NextResponse.json({ data: rows });
  } catch {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
