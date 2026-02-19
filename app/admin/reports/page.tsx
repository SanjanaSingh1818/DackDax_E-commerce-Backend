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
import { orderAPI, productAPI } from "@/lib/api";

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
  if (!token) {
    throw new Error("Saknar inloggningstoken.");
  }

  const payload = await orderAPI.getAll(token);
  if (Array.isArray(payload)) return payload as RawOrder[];
  if (Array.isArray((payload as { orders?: unknown[] })?.orders)) {
    return (payload as { orders: RawOrder[] }).orders;
  }
  return [];
}

async function fetchAllProducts(): Promise<RawProduct[]> {
  const firstPayload = (await productAPI.getAll({
    page: 1,
    limit: 200,
  })) as { products?: RawProduct[]; totalPages?: number };
  const products = [...(firstPayload.products || [])];
  const totalPages = Number(firstPayload.totalPages) || 1;

  if (totalPages > 1) {
    const pageCalls: Promise<{ products?: RawProduct[] }>[] = [];
    for (let page = 2; page <= totalPages; page += 1) {
      pageCalls.push(
        productAPI.getAll({
          page,
          limit: 200,
        }) as Promise<{ products?: RawProduct[] }>
      );
    }
    const payloads = await Promise.all(pageCalls);
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
      "Ordernummer",
      "Kundnamn",
      "E-post",
      "Kundtyp",
      "Totalbelopp",
      "Status",
      "Skapad datum",
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
    const headers = ["Namn", "E-post", "Telefon", "Kundtyp", "Antal ordrar", "Totalt spenderat"];
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
    const headers = ["Produktnamn", "Pris", "Lagersaldo", "Kategori"];
    const rows = products.map((product) => [
      product.title || product.name || "",
      Number(product.price) || 0,
      Number(product.stock) || Number(product.quantity) || 0,
      product.category || product.season || "",
    ]);
    downloadCsv("products-report.csv", toCsv(headers, rows));
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Card className="rounded-xl border-0 shadow-sm">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle>Rapporter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 p-4 pt-0 sm:p-6 sm:pt-0">
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
                  className="w-full justify-center rounded-lg px-3 text-sm"
                  disabled={filteredOrders.length === 0}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Exportera ordrar CSV
                </Button>
                <Button
                  onClick={exportCustomersCsv}
                  className="w-full justify-center rounded-lg px-3 text-sm"
                  variant="outline"
                  disabled={customerRows.length === 0}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Exportera kunder CSV
                </Button>
                <Button
                  onClick={exportProductsCsv}
                  className="w-full justify-center rounded-lg px-3 text-sm"
                  variant="secondary"
                  disabled={products.length === 0}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Exportera produkter CSV
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
