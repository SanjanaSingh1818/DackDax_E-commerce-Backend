import { NextResponse } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://deckdex-backend-1.onrender.com";

export async function GET() {
  try {
    const firstRes = await fetch(`${API_BASE}/api/products?page=1&limit=200`, {
      cache: "no-store",
    });

    if (!firstRes.ok) {
      return NextResponse.json({ data: [] }, { status: firstRes.status });
    }

    const firstPayload = (await firstRes.json()) as {
      products?: unknown[];
      totalPages?: number;
    };

    const products = [...(firstPayload.products || [])];
    const totalPages = Number(firstPayload.totalPages) || 1;

    if (totalPages > 1) {
      const pageCalls: Promise<Response>[] = [];
      for (let page = 2; page <= totalPages; page += 1) {
        pageCalls.push(
          fetch(`${API_BASE}/api/products?page=${page}&limit=200`, {
            cache: "no-store",
          })
        );
      }

      const responses = await Promise.all(pageCalls);
      const payloads = await Promise.all(
        responses.map(async (response) => {
          if (!response.ok) return { products: [] as unknown[] };
          return (await response.json()) as { products?: unknown[] };
        })
      );
      payloads.forEach((payload) => products.push(...(payload.products || [])));
    }

    return NextResponse.json({
      data: products,
    });
  } catch {
    return NextResponse.json({ data: [] }, { status: 500 });
  }
}
