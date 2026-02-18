import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://deckdex-backend-1.onrender.com";

type RawProduct = {
  _id?: string;
  id?: string;
  title?: string;
  name?: string;
  stock?: number;
  quantity?: number;
  inventory?: number;
  inStock?: number;
};

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

export async function GET() {
  try {
    const products = await fetchAllProducts();
    const data = products
      .map((product, index) => {
        const stock =
          Number(product.stock) ||
          Number(product.quantity) ||
          Number(product.inventory) ||
          Number(product.inStock);

        return {
          id: String(product._id || product.id || `low-${index}`),
          name: String(product.title || product.name || "Produkt"),
          stock,
          threshold: 10,
        };
      })
      .filter((product) => Number.isFinite(product.stock) && product.stock >= 0 && product.stock < 10)
      .sort((a, b) => a.stock - b.stock);

    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
