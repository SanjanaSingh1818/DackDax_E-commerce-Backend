export type RevenuePoint = {
  month: string;
  revenue: number;
};

export type AdminOrderStatus = "Completed" | "Pending" | "Cancelled";

export type AdminOrder = {
  orderId: string;
  customerName: string;
  customerEmail?: string;
  customerType?: "privat" | "foretag";
  productName: string;
  date: string;
  price: number;
  status: AdminOrderStatus;
  countryCode?: string;
};

export type AdminProduct = {
  id?: string;
  _id?: string;
  title?: string;
  name?: string;
  price?: number;
  stock?: number;
  quantity?: number;
  category?: string;
  season?: string;
};

export type TopTyre = {
  name: string;
  image?: string;
  salesCount: number;
  revenue: number;
};

export type LowStockTyre = {
  id: string;
  name: string;
  stock: number;
  threshold: number;
};

export type MarginSettings = {
  defaultMargin: number;
};

export type TopMarket = {
  country: string;
  countryCode: string;
  revenue: number;
  growth: number;
};

export type AdminStats = {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalTyresSold: number;
  revenueGrowth: number;
  ordersGrowth: number;
  customersGrowth: number;
  tyresGrowth: number;
  salesPercentage: number;
  totalSalesNumber: number;
  topTyres?: TopTyre[];
  topMarkets?: TopMarket[];
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://deckdex-backend-1.onrender.com";

function getToken() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("token") || "";
}

async function request<T>(endpoint: string, options?: RequestInit, requireAuth = false): Promise<T | null> {
  const headers = new Headers(options?.headers || {});
  if (requireAuth) {
    const token = getToken();
    if (!token) return null;
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (!headers.has("Content-Type") && options?.body) {
    headers.set("Content-Type", "application/json");
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      cache: "no-store",
      ...(options || {}),
      headers,
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function getAdminStats() {
  return null;
}

export async function getAdminOrders() {
  const payload = await request<unknown>("/api/orders", undefined, true);
  return Array.isArray(payload) ? payload : null;
}

export async function getAdminRevenue() {
  return null;
}

export async function getTopProducts() {
  return null;
}

export async function getLowStockProducts() {
  return null;
}

export async function getAdminProducts() {
  const firstPage = await request<{
    products?: AdminProduct[];
    totalPages?: number;
  }>("/api/products?page=1&limit=200");

  if (!firstPage) return null;

  const products = [...(firstPage.products || [])];
  const totalPages = Number(firstPage.totalPages) || 1;

  if (totalPages > 1) {
    const calls: Promise<{ products?: AdminProduct[] } | null>[] = [];
    for (let page = 2; page <= totalPages; page += 1) {
      calls.push(request<{ products?: AdminProduct[] }>(`/api/products?page=${page}&limit=200`));
    }
    const pages = await Promise.all(calls);
    pages.forEach((page) => products.push(...(page?.products || [])));
  }

  return products;
}

export async function getMarginSettings() {
  const payload = await request<{ data?: MarginSettings }>("/api/admin/settings/margin", undefined, true);
  return payload?.data || null;
}

export async function saveMarginSettings(defaultMargin: number) {
  const payload = await request<{ data?: MarginSettings }>(
    "/api/admin/settings/margin",
    {
      method: "POST",
      body: JSON.stringify({ defaultMargin }),
    },
    true
  );
  return payload?.data || null;
}

export async function getMarginSetting() {
  return getMarginSettings();
}

export async function updateMarginSetting(defaultMargin: number) {
  return saveMarginSettings(defaultMargin);
}
