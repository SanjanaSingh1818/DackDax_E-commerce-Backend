"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatSEK } from "@/lib/currency";
import { orderAPI } from "@/lib/api";

type OrderItem = {
  productId?: string;
  quantity?: number;
  price?: number;
};

type RawOrder = {
  totalAmount?: number;
  total?: number;
  amount?: number;
  createdAt?: string;
  customerType?: "privat" | "foretag" | string;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  customerName?: string;
  items?: OrderItem[];
};

type MonthMetric = {
  month: string;
  value: number;
};

type ProductMetric = {
  productId: string;
  quantity: number;
};

function getMonthKey(dateString: string) {
  const date = new Date(dateString);
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  return `${y}-${m}`;
}

function monthLabelFromKey(key: string) {
  const [year, month] = key.split("-").map(Number);
  const date = new Date(year, month - 1, 1);
  return date.toLocaleDateString("sv-SE", { month: "short", year: "numeric" });
}

function getOrderAmount(order: RawOrder) {
  return Number(order.totalAmount) || Number(order.total) || Number(order.amount) || 0;
}

function getCustomerKey(order: RawOrder) {
  const email = String(order.customer?.email || "").trim().toLowerCase();
  if (email) return `email:${email}`;
  const phone = String(order.customer?.phone || "").trim();
  if (phone) return `phone:${phone}`;
  const name = String(order.customer?.name || order.customerName || "").trim().toLowerCase();
  if (name) return `name:${name}`;
  return "";
}

export function getMonthlyRevenue(orders: RawOrder[]) {
  const map = new Map<string, number>();
  orders.forEach((order) => {
    if (!order.createdAt) return;
    const key = getMonthKey(order.createdAt);
    map.set(key, (map.get(key) || 0) + getOrderAmount(order));
  });
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, value]) => ({ month: monthLabelFromKey(month), value }));
}

export function getMonthlyOrders(orders: RawOrder[]) {
  const map = new Map<string, number>();
  orders.forEach((order) => {
    if (!order.createdAt) return;
    const key = getMonthKey(order.createdAt);
    map.set(key, (map.get(key) || 0) + 1);
  });
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, value]) => ({ month: monthLabelFromKey(month), value }));
}

export function getCustomerGrowth(orders: RawOrder[]) {
  const firstSeen = new Map<string, string>();

  orders.forEach((order) => {
    const key = getCustomerKey(order);
    if (!key || !order.createdAt) return;
    if (!firstSeen.has(key) || order.createdAt < firstSeen.get(key)!) {
      firstSeen.set(key, order.createdAt);
    }
  });

  const monthMap = new Map<string, number>();
  firstSeen.forEach((createdAt) => {
    const key = getMonthKey(createdAt);
    monthMap.set(key, (monthMap.get(key) || 0) + 1);
  });

  return Array.from(monthMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, value]) => ({ month: monthLabelFromKey(month), value }));
}

export function getTopProducts(orders: RawOrder[]) {
  const productMap = new Map<string, number>();

  orders.forEach((order) => {
    (order.items || []).forEach((item) => {
      const productId = String(item.productId || "").trim();
      if (!productId) return;
      const qty = Number(item.quantity) || 0;
      productMap.set(productId, (productMap.get(productId) || 0) + qty);
    });
  });

  return Array.from(productMap.entries())
    .map(([productId, quantity]) => ({ productId, quantity }))
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);
}

export function getAverageOrderValue(orders: RawOrder[]) {
  if (!orders.length) return 0;
  const totalRevenue = orders.reduce((acc, order) => acc + getOrderAmount(order), 0);
  return totalRevenue / orders.length;
}

function LoadingState() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
        <Skeleton className="h-28 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Skeleton className="h-[260px] rounded-xl sm:h-[320px]" />
        <Skeleton className="h-[260px] rounded-xl sm:h-[320px]" />
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Skeleton className="h-[260px] rounded-xl sm:h-[320px]" />
        <Skeleton className="h-[260px] rounded-xl sm:h-[320px]" />
      </div>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<RawOrder[]>([]);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Saknar inloggningstoken.");
        }

        const payload = await orderAPI.getAll(token);
        const rows = Array.isArray(payload)
          ? payload
          : Array.isArray((payload as { orders?: unknown[] })?.orders)
            ? (payload as { orders: unknown[] }).orders
            : [];

        setOrders(rows as RawOrder[]);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Nagot gick fel.");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    void loadOrders();
  }, []);

  const analytics = useMemo(() => {
    const totalRevenue = orders.reduce((acc, order) => acc + getOrderAmount(order), 0);
    const totalOrders = orders.length;
    const uniqueCustomers = new Set(
      orders.map((order) => getCustomerKey(order)).filter(Boolean)
    );

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue: getAverageOrderValue(orders),
      totalCustomers: uniqueCustomers.size,
      monthlyRevenue: getMonthlyRevenue(orders),
      monthlyOrders: getMonthlyOrders(orders),
      customerGrowth: getCustomerGrowth(orders),
      topProducts: getTopProducts(orders),
    };
  }, [orders]);

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Analys</h1>
        <Badge variant="outline">Direkt orderdata</Badge>
      </div>

      {error ? (
        <Card className="rounded-xl border-red-200 bg-red-50 text-red-700">
          <CardContent className="p-4 text-sm">{error}</CardContent>
        </Card>
      ) : null}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-xl border-0 shadow-sm">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm text-muted-foreground">Total omsattning</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{formatSEK(analytics.totalRevenue)}</CardContent>
        </Card>
        <Card className="rounded-xl border-0 shadow-sm">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm text-muted-foreground">Totala bestallningar</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {analytics.totalOrders.toLocaleString("sv-SE")}
          </CardContent>
        </Card>
        <Card className="rounded-xl border-0 shadow-sm">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm text-muted-foreground">Genomsnittligt ordervarde</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {formatSEK(analytics.averageOrderValue)}
          </CardContent>
        </Card>
        <Card className="rounded-xl border-0 shadow-sm">
          <CardHeader className="pb-1">
            <CardTitle className="text-sm text-muted-foreground">Totala kunder</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {analytics.totalCustomers.toLocaleString("sv-SE")}
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card className="rounded-xl border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Manadsomsattning</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" fill="#0f766e" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Bestallningar per manad</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.monthlyOrders}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card className="rounded-xl border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Kundtillvaxt</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.customerGrowth}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#7c3aed" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base">Mest salda dack</CardTitle>
          </CardHeader>
          <CardContent className="h-[250px] sm:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.topProducts}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.2} />
                <XAxis dataKey="productId" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="quantity" fill="#ea580c" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
