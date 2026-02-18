"use client";

import { create } from "zustand";

import {
  type AdminOrder,
  type AdminOrderStatus,
  type AdminProduct,
  type AdminStats,
  getAdminOrders,
  getAdminProducts,
  type LowStockTyre,
  type RevenuePoint,
  type TopTyre,
  getMarginSetting,
  updateMarginSetting,
} from "@/lib/admin-api";
import { orderAPI } from "@/lib/api";

type RawOrder = {
  _id?: string;
  id?: string;
  orderId?: string;
  customer?: {
    name?: string;
    email?: string;
  };
  customerName?: string;
  customerType?: "privat" | "foretag" | string;
  totalAmount?: number;
  total?: number;
  amount?: number;
  createdAt?: string;
  status?: string;
  orderStatus?: string;
  paymentStatus?: string;
  items?: Array<{
    productId?: string;
    quantity?: number;
    price?: number;
    name?: string;
    title?: string;
  }>;
};

type DashboardState = {
  loading: boolean;
  stats: AdminStats;
  orders: AdminOrder[];
  revenue: RevenuePoint[];
  topTyres: TopTyre[];
  lowStockTyres: LowStockTyre[];
  margin: number;
  marginSaving: boolean;
  loadDashboard: () => Promise<void>;
  updateMargin: (nextMargin: number) => Promise<void>;
};

const emptyStats: AdminStats = {
  totalRevenue: 0,
  totalOrders: 0,
  totalCustomers: 0,
  totalTyresSold: 0,
  revenueGrowth: 0,
  ordersGrowth: 0,
  customersGrowth: 0,
  tyresGrowth: 0,
  salesPercentage: 0,
  totalSalesNumber: 0,
};

function getOrderAmount(order: RawOrder) {
  return Number(order.totalAmount) || Number(order.total) || Number(order.amount) || 0;
}

function normalizeStatus(status: unknown): AdminOrderStatus {
  const value = String(status || "").toLowerCase().trim();
  if (["completed", "complete", "paid", "delivered", "slutford", "fardig"].includes(value)) {
    return "Completed";
  }
  if (["cancelled", "canceled", "annullerad"].includes(value)) {
    return "Cancelled";
  }
  return "Pending";
}

function monthKey(dateString?: string) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "";
  return `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, "0")}`;
}

function monthLabel(key: string) {
  const [year, month] = key.split("-").map(Number);
  return new Date(year, month - 1, 1).toLocaleDateString("sv-SE", {
    month: "short",
    year: "numeric",
  });
}

export function calculateDashboardStats(orders: RawOrder[]): AdminStats {
  const totalRevenue = orders.reduce((sum, order) => sum + getOrderAmount(order), 0);
  const totalOrders = orders.length;
  const customerEmails = new Set(
    orders
      .map((order) => String(order.customer?.email || "").trim().toLowerCase())
      .filter(Boolean)
  );
  const totalTyresSold = orders.reduce((sum, order) => {
    const qty = (order.items || []).reduce((q, item) => q + (Number(item.quantity) || 0), 0);
    return sum + qty;
  }, 0);

  const salesPercentage = totalTyresSold > 0 ? Math.min(100, (totalOrders / totalTyresSold) * 100) : 0;

  return {
    ...emptyStats,
    totalRevenue,
    totalOrders,
    totalCustomers: customerEmails.size,
    totalTyresSold,
    totalSalesNumber: totalTyresSold,
    salesPercentage,
    revenueGrowth: 0,
    ordersGrowth: 0,
    customersGrowth: 0,
    tyresGrowth: 0,
    topTyres: [],
    topMarkets: [],
  };
}

export function calculateMonthlyRevenue(orders: RawOrder[]): RevenuePoint[] {
  const map = new Map<string, number>();
  orders.forEach((order) => {
    const key = monthKey(order.createdAt);
    if (!key) return;
    map.set(key, (map.get(key) || 0) + getOrderAmount(order));
  });

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, revenue]) => ({ month: monthLabel(month), revenue }));
}

export function calculateTopProducts(orders: RawOrder[], products: AdminProduct[]): TopTyre[] {
  const productMeta = new Map<string, { name: string; image?: string }>();
  products.forEach((product) => {
    const id = String(product.id || product._id || "").trim();
    if (!id) return;
    productMeta.set(id, {
      name: String(product.title || product.name || id),
      image: undefined,
    });
  });

  const grouped = new Map<string, { salesCount: number; revenue: number }>();

  orders.forEach((order) => {
    (order.items || []).forEach((item) => {
      const productId = String(item.productId || "").trim();
      if (!productId) return;
      const quantity = Number(item.quantity) || 0;
      const itemRevenue = (Number(item.price) || 0) * quantity;
      const current = grouped.get(productId) || { salesCount: 0, revenue: 0 };
      grouped.set(productId, {
        salesCount: current.salesCount + quantity,
        revenue: current.revenue + itemRevenue,
      });
    });
  });

  return Array.from(grouped.entries())
    .map(([productId, values]) => {
      const meta = productMeta.get(productId);
      return {
        name: meta?.name || productId,
        image: meta?.image,
        salesCount: values.salesCount,
        revenue: values.revenue,
      };
    })
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, 5);
}

export function calculateRecentOrders(orders: RawOrder[]): AdminOrder[] {
  return orders
    .slice()
    .sort((a, b) => {
      const aTime = new Date(a.createdAt || 0).getTime();
      const bTime = new Date(b.createdAt || 0).getTime();
      return bTime - aTime;
    })
    .slice(0, 10)
    .map((order, index) => {
      const firstItem = (order.items || [])[0];
      const dateRaw = order.createdAt || new Date().toISOString();
      return {
        orderId: String(order.orderId || order.id || order._id || `#ORD-${1000 + index}`),
        customerName: String(order.customer?.name || order.customerName || "Okand kund"),
        customerEmail: String(order.customer?.email || ""),
        customerType: String(order.customerType || "privat").toLowerCase() === "foretag" ? "foretag" : "privat",
        productName: String(firstItem?.name || firstItem?.title || "Dack"),
        date: new Date(dateRaw).toLocaleDateString("sv-SE"),
        price: getOrderAmount(order),
        status: normalizeStatus(order.status ?? order.orderStatus ?? order.paymentStatus),
      };
    });
}

function calculateLowStockTyres(products: AdminProduct[]): LowStockTyre[] {
  return products
    .map((product, index) => {
      const anyProduct = product as Record<string, unknown>;
      const stock =
        Number(product.stock) ||
        Number(product.quantity) ||
        Number(anyProduct.inventory) ||
        Number(anyProduct.inStock);
      return {
        id: String(product.id || product._id || `low-${index}`),
        name: String(product.title || product.name || "Produkt"),
        stock,
        threshold: 10,
      };
    })
    .filter((product) => Number.isFinite(product.stock) && product.stock >= 0)
    .filter((product) => product.stock < 10)
    .sort((a, b) => a.stock - b.stock);
}

async function loadOrdersFromOrderApi(): Promise<RawOrder[] | null> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) return null;
    const response = await orderAPI.getAll(token);
    if (Array.isArray(response)) return response as RawOrder[];
    if (Array.isArray(response?.orders)) return response.orders as RawOrder[];
    return null;
  } catch {
    return null;
  }
}

export const useAdminDashboardStore = create<DashboardState>((set) => ({
  loading: true,
  stats: emptyStats,
  orders: [],
  revenue: [],
  topTyres: [],
  lowStockTyres: [],
  margin: 0,
  marginSaving: false,
  loadDashboard: async () => {
    set({ loading: true });

    const [ordersPrimaryRes, ordersFallbackRes, productsRes, marginRes] = await Promise.all([
      loadOrdersFromOrderApi(),
      getAdminOrders(),
      getAdminProducts(),
      getMarginSetting(),
    ]);

    const rawOrders = (ordersPrimaryRes ?? (ordersFallbackRes as unknown as RawOrder[] | null) ?? []) as RawOrder[];
    const rawProducts = (productsRes ?? []) as AdminProduct[];

    const stats = calculateDashboardStats(rawOrders);
    const revenue = calculateMonthlyRevenue(rawOrders);
    const topTyres = calculateTopProducts(rawOrders, rawProducts);
    const orders = calculateRecentOrders(rawOrders);
    const lowStockTyres = calculateLowStockTyres(rawProducts);

    set({
      loading: false,
      stats,
      orders,
      revenue,
      topTyres,
      lowStockTyres,
      margin: Number(marginRes?.defaultMargin) || 0,
    });
  },
  updateMargin: async (nextMargin: number) => {
    set({ marginSaving: true });
    const payload = await updateMarginSetting(nextMargin);
    set({
      marginSaving: false,
      margin: Number(payload?.defaultMargin) || nextMargin || 0,
    });
  },
}));
