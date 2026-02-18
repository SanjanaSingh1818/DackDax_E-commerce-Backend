export type RevenuePoint = {
  month: string;
  revenue: number;
};

export type AdminOrderStatus = "Completed" | "Pending" | "Cancelled";

export type AdminOrder = {
  orderId: string;
  customerName: string;
  productName: string;
  date: string;
  price: number;
  status: AdminOrderStatus;
  countryCode?: string;
};

export type TopTyre = {
  name: string;
  image?: string;
  salesCount: number;
  revenue: number;
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

async function safeFetchJson<T>(url: string): Promise<T | null> {
  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) {
      return null;
    }
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function getAdminStats() {
  const payload = await safeFetchJson<unknown>("/api/admin/stats");
  if (!payload) return null;
  if (typeof payload === "object" && payload !== null && "data" in payload) {
    return (payload as { data?: Partial<AdminStats> }).data ?? null;
  }
  return payload as Partial<AdminStats>;
}

export async function getAdminOrders() {
  const payload = await safeFetchJson<unknown>("/api/admin/orders");
  if (!payload) return null;
  if (Array.isArray(payload)) return payload as AdminOrder[];
  if (typeof payload === "object" && payload !== null && "data" in payload) {
    const rows = (payload as { data?: unknown }).data;
    return Array.isArray(rows) ? (rows as AdminOrder[]) : null;
  }
  return null;
}

export async function getAdminRevenue() {
  const payload = await safeFetchJson<unknown>("/api/admin/revenue");
  if (!payload) return null;
  if (Array.isArray(payload)) return payload as RevenuePoint[];
  if (typeof payload === "object" && payload !== null && "data" in payload) {
    const rows = (payload as { data?: unknown }).data;
    return Array.isArray(rows) ? (rows as RevenuePoint[]) : null;
  }
  return null;
}
