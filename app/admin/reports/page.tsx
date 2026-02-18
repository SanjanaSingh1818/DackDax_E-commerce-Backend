"use client";

import { CalendarIcon, Download } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { orderAPI } from "@/lib/api";

type RawOrder = {
  _id?: string;
  id?: string;
  orderId?: string;
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  customerName?: string;
  customerName?: string;
  customerType?: "privat" | "foretag" | string;
  totalAmount?: number;
  total?: number;
  amount?: number;
  status?: string;
  createdAt?: string;
  date?: string;
};

type RawProduct = {
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

type CustomerCsvRow = {
  name: string;
  email: string;
  phone: string;
  customerType: string;
  totalOrders: number;
  totalSpent: number;
};

function toCsv(headers: string[], rows: Array<Array<string | number>>) {
  const escapeCell = (value: string | number) => {
    const text = String(value ?? "");
    if (text.includes(",") || text.includes('"') || text.includes("\n")) {
      return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
  };

  const lines = [headers.map(escapeCell).join(",")];
  rows.forEach((row) => lines.push(row.map(escapeCell).join(",")));
  return lines.join("\n");
}

function downloadCsv(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  if (anchor.parentNode) anchor.parentNode.removeChild(anchor);
  URL.revokeObjectURL(url);
}

function formatDate(date?: Date) {
  if (!date) return "Välj datum";
  return date.toLocaleDateString("sv-SE");
}

function orderAmount(order: RawOrder) {
  return Number(order.totalAmount) || Number(order.total) || Number(order.amount) || 0;
}

function getCustomerKey(order: RawOrder) {
  const email = String(order.customer?.email || "").trim().toLowerCase();
  if (email) return email;
  const phone = String(order.customer?.phone || "").trim();
  if (phone) return `phone:${phone}`;
  const name = String(order.customer?.name || order.customerName || "").trim().toLowerCase();
  if (name) return `name:${name}`;
  return "";
}

function orderDate(order: RawOrder) {
  return order.createdAt || order.date || "";
}

function normalizeCustomerType(value: unknown) {
  const type = String(value || "").toLowerCase();
  if (type === "foretag") return "Foretag";
  if (type === "privat") return "Privat";
  return "Okand";
}

function getDayStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0).getTime();
}

function getDayEnd(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999).getTime();
}

function groupOrdersIntoCustomers(orders: RawOrder[]): CustomerCsvRow[] {
  const grouped = new Map<string, CustomerCsvRow>();

  orders.forEach((order) => {
    const key = getCustomerKey(order);
    if (!key) return;

    const email = String(order.customer?.email || "").trim().toLowerCase();
    const name = String(order.customer?.name || order.customerName || "Okand kund").trim();
    const phone = String(order.customer?.phone || "-").trim();
    const customerType = normalizeCustomerType(order.customerType);
    const amount = orderAmount(order);

    if (!grouped.has(key)) {
      grouped.set(key, {
        name,
        email: email || "-",
        phone,
        customerType,
        totalOrders: 1,
        totalSpent: amount,
      });
      return;
    }

    const current = grouped.get(key)!;
    current.totalOrders += 1;
    current.totalSpent += amount;
  });

  return Array.from(grouped.values()).sort((a, b) => b.totalSpent - a.totalSpent);
}

async function fetchOrders(): Promise<RawOrder[]> {
  const token = localStorage.getItem("token");
  if (token) {
    const payload = await orderAPI.getAll(token);
    if (Array.isArray(payload)) return payload as RawOrder[];
    if (Array.isArray((payload as { orders?: unknown[] })?.orders)) {
      return (payload as { orders: RawOrder[] }).orders;
    }
  }

  const res = await fetch("/api/admin/orders", { cache: "no-store" });
  if (!res.ok) throw new Error("Kunde inte hamta orderdata.");
  const payload = (await res.json()) as unknown;

  if (Array.isArray(payload)) return payload as RawOrder[];
  if (Array.isArray((payload as { data?: unknown[] })?.data)) return (payload as { data: RawOrder[] }).data;
  if (Array.isArray((payload as { orders?: unknown[] })?.orders)) return (payload as { orders: RawOrder[] }).orders;
  return [];
}

async function fetchAllProducts(): Promise<RawProduct[]> {
  // Future target for dedicated endpoint:
  // GET /api/admin/products
  try {
    const adminRes = await fetch("/api/admin/products", { cache: "no-store" });
    if (adminRes.ok) {
      const payload = (await adminRes.json()) as unknown;
      if (Array.isArray(payload)) return payload as RawProduct[];
      if (Array.isArray((payload as { data?: unknown[] })?.data)) return (payload as { data: RawProduct[] }).data;
      if (Array.isArray((payload as { products?: unknown[] })?.products)) {
        return (payload as { products: RawProduct[] }).products;
      }
    }
  } catch {
    // fallback below
  }

  const first = await fetch("/api/products?page=1", { cache: "no-store" });
  if (!first.ok) throw new Error("Kunde inte hamta produktdata.");
  const firstPayload = (await first.json()) as { products?: RawProduct[]; totalPages?: number };
  const products = [...(firstPayload.products || [])];
  const totalPages = Number(firstPayload.totalPages) || 1;

  if (totalPages > 1) {
    const pageCalls: Promise<Response>[] = [];
    for (let page = 2; page <= totalPages; page += 1) {
      pageCalls.push(fetch(`/api/products?page=${page}`, { cache: "no-store" }));
    }
    const responses = await Promise.all(pageCalls);
    const payloads = await Promise.all(
      responses.map(async (response) => {
        if (!response.ok) return { products: [] as RawProduct[] };
        return (await response.json()) as { products?: RawProduct[] };
      })
    );
    payloads.forEach((payload) => products.push(...(payload.products || [])));
  }

  return products;
}

export default function AdminReportsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<RawOrder[]>([]);
  const [products, setProducts] = useState<RawProduct[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const [ordersData, productsData] = await Promise.all([fetchOrders(), fetchAllProducts()]);
        setOrders(ordersData);
        setProducts(productsData);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Kunde inte ladda rapportdata.");
        setOrders([]);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const filteredOrders = useMemo(() => {
    const start = startDate ? getDayStart(startDate) : null;
    const end = endDate ? getDayEnd(endDate) : null;

    return orders.filter((order) => {
      const createdAt = orderDate(order);
      if (!createdAt) return false;
      const current = new Date(createdAt).getTime();
      if (Number.isNaN(current)) return false;
      if (start !== null && current < start) return false;
      if (end !== null && current > end) return false;
      return true;
    });
  }, [orders, startDate, endDate]);

  const customerRows = useMemo(() => groupOrdersIntoCustomers(filteredOrders), [filteredOrders]);

  const exportOrdersCsv = () => {
    const headers = [
      "Order ID",
      "Customer Name",
      "Email",
      "Customer Type",
      "Total Amount",
      "Status",
      "Created Date",
    ];
    const rows = filteredOrders.map((order) => [
      order.orderId || order.id || order._id || "",
      order.customer?.name || order.customerName || "",
      order.customer?.email || "",
      normalizeCustomerType(order.customerType),
      orderAmount(order),
      order.status || "",
      orderDate(order),
    ]);
    downloadCsv("orders-report.csv", toCsv(headers, rows));
  };

  const exportCustomersCsv = () => {
    const headers = ["Name", "Email", "Phone", "Customer Type", "Total Orders", "Total Spent"];
    const rows = customerRows.map((customer) => [
      customer.name,
      customer.email,
      customer.phone,
      customer.customerType,
      customer.totalOrders,
      customer.totalSpent,
    ]);
    downloadCsv("customers-report.csv", toCsv(headers, rows));
  };

  const exportProductsCsv = () => {
    const headers = ["Product Name", "Price", "Stock", "Category"];
    const rows = products.map((product) => [
      product.title || product.name || "",
      Number(product.price) || 0,
      Number(product.stock) || Number(product.quantity) || 0,
      product.category || product.season || "",
    ]);
    downloadCsv("products-report.csv", toCsv(headers, rows));
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-xl border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Rapporter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Startdatum</p>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal", !startDate && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formatDate(startDate)}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Slutdatum</p>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formatDate(endDate)}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">Ordrar: {filteredOrders.length}</Badge>
                <Badge variant="secondary">Kunder: {customerRows.length}</Badge>
                <Badge variant="secondary">Produkter: {products.length}</Badge>
              </div>

              {error ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
                <Button
                  onClick={exportOrdersCsv}
                  className="w-full justify-center rounded-lg"
                  disabled={filteredOrders.length === 0}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export Orders CSV
                </Button>
                <Button
                  onClick={exportCustomersCsv}
                  className="w-full justify-center rounded-lg"
                  variant="outline"
                  disabled={customerRows.length === 0}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export Customers CSV
                </Button>
                <Button
                  onClick={exportProductsCsv}
                  className="w-full justify-center rounded-lg"
                  variant="secondary"
                  disabled={products.length === 0}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Export Products CSV
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
