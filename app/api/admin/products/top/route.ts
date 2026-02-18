import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://deckdex-backend-1.onrender.com";

type RawOrder = {
  items?: Array<{ productId?: string; quantity?: number; price?: number }>;
};

type RawProduct = { _id?: string; id?: string; title?: string; name?: string; image?: string };

async function fetchAllProducts() {
  const firstRes = await fetch(`${API_BASE}/api/products?page=1&limit=200`, { cache: "no-store" });
  if (!firstRes.ok) return [] as RawProduct[];

  const firstPayload = (await firstRes.json()) as { products?: RawProduct[]; totalPages?: number };
  const products = [...(firstPayload.products || [])];
  const totalPages = Number(firstPayload.totalPages) || 1;

  if (totalPages > 1) {
    const calls: Promise<Response>[] = [];
    for (let page = 2; page <= totalPages; page += 1) {
      calls.push(fetch(`${API_BASE}/api/products?page=${page}&limit=200`, { cache: "no-store" }));
    }
    const responses = await Promise.all(calls);
    const payloads = await Promise.all(
      responses.map(async (res) => (res.ok ? ((await res.json()) as { products?: RawProduct[] }) : { products: [] }))
    );
    payloads.forEach((payload) => products.push(...(payload.products || [])));
  }

  return products;
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Missing authorization header." }, { status: 401 });
    }

    const [ordersRes, products] = await Promise.all([
      fetch(`${API_BASE}/api/orders`, {
        cache: "no-store",
        headers: { Authorization: authHeader },
      }),
      fetchAllProducts(),
    ]);

    const ordersPayload = (await ordersRes.json().catch(() => [])) as unknown;
    if (!ordersRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch orders from backend.", details: ordersPayload },
        { status: ordersRes.status }
      );
    }

    const orders = (Array.isArray(ordersPayload)
      ? ordersPayload
      : Array.isArray((ordersPayload as { orders?: unknown[] })?.orders)
        ? (ordersPayload as { orders: unknown[] }).orders
        : []) as RawOrder[];

    const productMeta = new Map<string, { name: string; image?: string }>();
    products.forEach((product) => {
      const id = String(product._id || product.id || "").trim();
      if (!id) return;
      productMeta.set(id, {
        name: String(product.title || product.name || id),
        image: product.image,
      });
    });

    const grouped = new Map<string, { salesCount: number; revenue: number }>();
    orders.forEach((order) => {
      (order.items || []).forEach((item) => {
        const productId = String(item.productId || "").trim();
        if (!productId) return;
        const qty = Number(item.quantity) || 0;
        const revenue = qty * (Number(item.price) || 0);
        const current = grouped.get(productId) || { salesCount: 0, revenue: 0 };
        grouped.set(productId, {
          salesCount: current.salesCount + qty,
          revenue: current.revenue + revenue,
        });
      });
    });

    const data = Array.from(grouped.entries())
      .map(([productId, value]) => {
        const meta = productMeta.get(productId);
        return {
          name: meta?.name || productId,
          image: meta?.image,
          salesCount: value.salesCount,
          revenue: value.revenue,
        };
      })
      .sort((a, b) => b.salesCount - a.salesCount)
      .slice(0, 5);

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
