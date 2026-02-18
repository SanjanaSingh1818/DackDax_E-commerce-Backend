"use client";

import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatSEK } from "@/lib/currency";
import { orderAPI } from "@/lib/api";

type RawOrder = {
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  customerType?: "privat" | "foretag" | string;
  totalAmount?: number;
  total?: number;
  amount?: number;
  createdAt?: string;
  date?: string;
};

type CustomerRow = {
  name: string;
  email: string;
  phone: string;
  customerType: "private" | "public";
  totalOrders: number;
  totalSpent: number;
  joinedDate: string;
  joinedDateValue: number;
};

export function groupOrdersIntoCustomers(orders: RawOrder[]): CustomerRow[] {
  const grouped = new Map<string, CustomerRow>();

  orders.forEach((order) => {
    const email = String(order.customer?.email || "").trim().toLowerCase();
    if (!email) return;

    const name = String(order.customer?.name || "Okand kund").trim();
    const phone = String(order.customer?.phone || "-").trim();
    const rawType = String(order.customerType || "").toLowerCase();
    const customerType = rawType === "foretag" || rawType === "public" ? "public" : "private";
    const totalAmount =
      Number(order.totalAmount) || Number(order.total) || Number(order.amount) || 0;
    const dateRaw = order.createdAt || order.date || new Date().toISOString();
    const dateMs = new Date(dateRaw).getTime();

    if (!grouped.has(email)) {
      grouped.set(email, {
        name,
        email,
        phone,
        customerType,
        totalOrders: 1,
        totalSpent: totalAmount,
        joinedDate: new Date(dateRaw).toLocaleDateString("sv-SE"),
        joinedDateValue: dateMs,
      });
      return;
    }

    const current = grouped.get(email)!;
    current.totalOrders += 1;
    current.totalSpent += totalAmount;

    if (dateMs < current.joinedDateValue) {
      current.joinedDateValue = dateMs;
      current.joinedDate = new Date(dateRaw).toLocaleDateString("sv-SE");
    }
  });

  return Array.from(grouped.values()).sort((a, b) => b.totalSpent - a.totalSpent);
}

const PAGE_SIZE = 10;
const CUSTOMER_API_PLACEHOLDER = "/api/admin/customers"; // TODO: switch to this endpoint when backend is ready

export default function AdminCustomersPage() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<CustomerRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "public" | "private">("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const loadCustomersFromOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Saknar inloggningstoken.");
        }

        let orders: unknown[] = [];

        try {
          const payload = await orderAPI.getAll(token);
          orders = Array.isArray(payload)
            ? payload
            : Array.isArray((payload as { orders?: unknown[] })?.orders)
              ? ((payload as { orders: unknown[] }).orders ?? [])
              : [];
        } catch {
          const fallbackResponse = await fetch("/api/admin/orders", { cache: "no-store" });
          if (!fallbackResponse.ok) {
            throw new Error("Kunde inte hamta bestallningar.");
          }
          const fallbackPayload = (await fallbackResponse.json()) as unknown;
          orders = Array.isArray(fallbackPayload)
            ? fallbackPayload
            : Array.isArray((fallbackPayload as { data?: unknown[] })?.data)
              ? ((fallbackPayload as { data: unknown[] }).data ?? [])
              : Array.isArray((fallbackPayload as { orders?: unknown[] })?.orders)
                ? ((fallbackPayload as { orders: unknown[] }).orders ?? [])
                : [];
        }

        setRows(groupOrdersIntoCustomers(orders as RawOrder[]));
      } catch (err: unknown) {
        setRows([]);
        setError(err instanceof Error ? err.message : "Nagot gick fel.");
      } finally {
        setLoading(false);
      }
    };

    void loadCustomersFromOrders();
  }, []);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((row) => {
      const matchSearch = !q || row.name.toLowerCase().includes(q) || row.email.toLowerCase().includes(q);
      const matchType = typeFilter === "all" || row.customerType === typeFilter;
      return matchSearch && matchType;
    });
  }, [rows, search, typeFilter]);

  useEffect(() => {
    setPage(1);
  }, [search, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const pageRows = filteredRows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Card className="rounded-xl border-0 shadow-sm">
      <CardHeader className="space-y-4">
        <CardTitle>Kunder</CardTitle>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            placeholder="Sok namn eller e-post..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="sm:max-w-sm"
          />
          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value as "all" | "public" | "private")}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm sm:w-[180px]"
          >
            <option value="all">Alla</option>
            <option value="public">Foretag</option>
            <option value="private">Privat</option>
          </select>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        ) : error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Namn</TableHead>
                    <TableHead>E-post</TableHead>
                    <TableHead>Telefon</TableHead>
                    <TableHead>Kundtyp</TableHead>
                    <TableHead>Antal ordrar</TableHead>
                    <TableHead>Totalt spenderat</TableHead>
                    <TableHead>Blev kund</TableHead>
                    <TableHead>Visa</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-16 text-center text-muted-foreground">
                        Inga kunder hittades.
                      </TableCell>
                    </TableRow>
                  ) : (
                    pageRows.map((row) => (
                      <TableRow key={row.email}>
                        <TableCell className="font-medium">{row.name}</TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell>{row.phone}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              row.customerType === "public"
                                ? "bg-blue-100 text-blue-700 hover:bg-blue-100"
                                : "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                            }
                          >
                            {row.customerType === "public" ? "Foretag" : "Privat"}
                          </Badge>
                        </TableCell>
                        <TableCell>{row.totalOrders.toLocaleString("sv-SE")}</TableCell>
                        <TableCell>{formatSEK(row.totalSpent)}</TableCell>
                        <TableCell>{row.joinedDate}</TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              window.location.assign(`/admin/orders?q=${encodeURIComponent(row.name)}`)
                            }
                          >
                            Visa
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Sida {page} av {totalPages} ({filteredRows.length} kunder)
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                >
                  Forra
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                >
                  Nasta
                </Button>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">Planerat API: {CUSTOMER_API_PLACEHOLDER}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
