"use client";

import { create } from "zustand";

import {
  type AdminOrder,
  type AdminOrderStatus,
  type AdminStats,
  getAdminOrders,
  getAdminRevenue,
  getAdminStats,
  type RevenuePoint,
  type TopMarket,
  type TopTyre,
} from "@/lib/admin-api";

type DashboardState = {
  loading: boolean;
  stats: AdminStats;
  orders: AdminOrder[];
  revenue: RevenuePoint[];
  topTyres: TopTyre[];
  topMarkets: TopMarket[];
  loadDashboard: () => Promise<void>;
};

const monthFallback: RevenuePoint[] = [
  { month: "Jan", revenue: 0 },
  { month: "Feb", revenue: 0 },
  { month: "Mar", revenue: 0 },
  { month: "Apr", revenue: 0 },
  { month: "May", revenue: 0 },
  { month: "Jun", revenue: 0 },
  { month: "Jul", revenue: 0 },
  { month: "Aug", revenue: 0 },
  { month: "Sep", revenue: 0 },
  { month: "Oct", revenue: 0 },
  { month: "Nov", revenue: 0 },
  { month: "Dec", revenue: 0 },
];

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

const defaultTopTyres: TopTyre[] = [
  { name: "Michelin Pilot Sport 5", salesCount: 0, revenue: 0 },
  { name: "Pirelli Cinturato P7", salesCount: 0, revenue: 0 },
  { name: "Bridgestone Turanza T005", salesCount: 0, revenue: 0 },
];

const defaultTopMarkets: TopMarket[] = [
  { country: "United States", countryCode: "us", revenue: 0, growth: 0 },
  { country: "Germany", countryCode: "de", revenue: 0, growth: 0 },
  { country: "United Kingdom", countryCode: "gb", revenue: 0, growth: 0 },
  { country: "Sweden", countryCode: "se", revenue: 0, growth: 0 },
];

function normalizeStatus(status: unknown): AdminOrderStatus {
  if (typeof status === "number") {
    if (status === 1) return "Completed";
    if (status === 2) return "Cancelled";
    return "Pending";
  }

  const value = String(status ?? "").toLowerCase().trim();

  if (value === "completed") return "Completed";
  if (value === "complete") return "Completed";
  if (value === "paid") return "Completed";
  if (value === "delivered") return "Completed";
  if (value === "slutford") return "Completed";
  if (value === "fardig") return "Completed";

  if (value === "pending") return "Pending";
  if (value === "processing") return "Pending";
  if (value === "new") return "Pending";
  if (value === "under behandling") return "Pending";
  if (value === "vantar") return "Pending";

  if (value === "cancelled" || value === "canceled") return "Cancelled";
  if (value === "annullerad") return "Cancelled";
  return "Pending";
}

function normalizeOrders(rows: AdminOrder[] | null): AdminOrder[] {
  if (!rows?.length) return [];
  return rows.slice(0, 8).map((row, index) => {
    const anyRow = row as unknown as Record<string, unknown>;

    const orderId =
      (typeof anyRow.orderId === "string" && anyRow.orderId) ||
      (typeof anyRow.id === "string" && anyRow.id) ||
      (typeof anyRow._id === "string" && anyRow._id) ||
      `#ORD-${1000 + index}`;

    const nestedCustomer =
      (anyRow.customer as Record<string, unknown> | undefined) ||
      (anyRow.user as Record<string, unknown> | undefined);
    const customerName =
      (typeof anyRow.customerName === "string" && anyRow.customerName) ||
      (typeof nestedCustomer?.name === "string" && nestedCustomer.name) ||
      (typeof nestedCustomer?.email === "string" && nestedCustomer.email) ||
      "Okänd kund";

    const items = Array.isArray(anyRow.items) ? anyRow.items : [];
    const firstItem = (items[0] as Record<string, unknown> | undefined) || {};
    const productName =
      (typeof anyRow.productName === "string" && anyRow.productName) ||
      (typeof anyRow.product === "string" && anyRow.product) ||
      (typeof firstItem.name === "string" && firstItem.name) ||
      (typeof firstItem.title === "string" && firstItem.title) ||
      "Däck";

    const dateRaw =
      (typeof anyRow.date === "string" && anyRow.date) ||
      (typeof anyRow.createdAt === "string" && anyRow.createdAt) ||
      "";
    const date = dateRaw
      ? new Date(dateRaw).toLocaleDateString("sv-SE")
      : new Date().toLocaleDateString("sv-SE");

    const price =
      Number(anyRow.price) ||
      Number(anyRow.totalAmount) ||
      Number(anyRow.total) ||
      Number(anyRow.amount) ||
      0;

    const statusSource = anyRow.status ?? anyRow.orderStatus ?? anyRow.paymentStatus;

    return {
      orderId,
      customerName,
      productName,
      date,
      price,
      status: normalizeStatus(statusSource),
      countryCode: typeof anyRow.countryCode === "string" ? anyRow.countryCode : undefined,
    };
  });
}

export const useAdminDashboardStore = create<DashboardState>((set) => ({
  loading: true,
  stats: emptyStats,
  orders: [],
  revenue: monthFallback,
  topTyres: defaultTopTyres,
  topMarkets: defaultTopMarkets,
  loadDashboard: async () => {
    set({ loading: true });

    const [statsRes, ordersRes, revenueRes] = await Promise.all([
      getAdminStats(),
      getAdminOrders(),
      getAdminRevenue(),
    ]);

    const mergedStats: AdminStats = {
      ...emptyStats,
      ...(statsRes ?? {}),
    };

    set({
      loading: false,
      stats: mergedStats,
      orders: normalizeOrders(ordersRes),
      revenue: revenueRes?.length ? revenueRes : monthFallback,
      topTyres: statsRes?.topTyres?.length ? statsRes.topTyres : defaultTopTyres,
      topMarkets: statsRes?.topMarkets?.length ? statsRes.topMarkets : defaultTopMarkets,
    });
  },
}));
