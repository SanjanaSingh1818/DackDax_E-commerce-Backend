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

async function safeFetchJson<T>(url: string, options?: RequestInit): Promise<T | null> {
  try {
    const response = await fetch(url, { cache: "no-store", ...(options || {}) });
    if (!response.ok) {
      return null;
    }
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function unwrapData<T>(payload: unknown): T | null {
  if (!payload) return null;
  if (typeof payload === "object" && payload !== null && "data" in payload) {
    return ((payload as { data?: T }).data ?? null) as T | null;
  }
  return payload as T;
}

export async function getAdminStats() {
  const payload = await safeFetchJson<unknown>("/api/admin/stats");
  return unwrapData<Partial<AdminStats>>(payload);
}

export async function getAdminOrders() {
  const payload = await safeFetchJson<unknown>("/api/admin/orders");
  const data = unwrapData<unknown>(payload);
  return Array.isArray(data) ? (data as AdminOrder[]) : null;
}

export async function getAdminRevenue() {
  const payload = await safeFetchJson<unknown>("/api/admin/revenue");
  const data = unwrapData<unknown>(payload);
  return Array.isArray(data) ? (data as RevenuePoint[]) : null;
}

export async function getTopProducts() {
  const payload = await safeFetchJson<unknown>("/api/admin/products/top");
  const data = unwrapData<unknown>(payload);
  return Array.isArray(data) ? (data as TopTyre[]) : null;
}

export async function getLowStockProducts() {
  const payload = await safeFetchJson<unknown>("/api/admin/products/low-stock");
  const data = unwrapData<unknown>(payload);
  return Array.isArray(data) ? (data as LowStockTyre[]) : null;
}

export async function getAdminProducts() {
  const payload = await safeFetchJson<unknown>("/api/admin/products");
  const data = unwrapData<unknown>(payload);
  return Array.isArray(data) ? (data as AdminProduct[]) : null;
}

export async function getMarginSettings() {
  const payload = await safeFetchJson<unknown>("/api/admin/settings/margin");
  return unwrapData<MarginSettings>(payload);
}

export async function saveMarginSettings(defaultMargin: number) {
  const payload = await safeFetchJson<unknown>("/api/admin/settings/margin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ defaultMargin }),
  });
  return unwrapData<MarginSettings>(payload);
}

export async function getMarginSetting() {
  return getMarginSettings();
}

export async function updateMarginSetting(defaultMargin: number) {
  return saveMarginSettings(defaultMargin);
}
