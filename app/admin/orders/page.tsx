"use client";

import { useEffect } from "react";
import { useMemo } from "react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

import OrdersTable from "@/components/admin/OrdersTable";
import { Skeleton } from "@/components/ui/skeleton";
import type { AdminOrder, AdminOrderStatus } from "@/lib/admin-api";
import { orderAPI } from "@/lib/api";

export default function AdminOrdersPage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [error, setError] = useState<string | null>(null);
  const searchQuery = (searchParams.get("q") || "").trim().toLowerCase();

  const normalizeStatus = (status: unknown): AdminOrderStatus => {
    if (typeof status === "number") {
      if (status === 1) return "Completed";
      if (status === 2) return "Cancelled";
      return "Pending";
    }

    const value = String(status ?? "").toLowerCase().trim();
    if (["completed", "complete", "paid", "delivered", "slutford", "fardig"].includes(value)) {
      return "Completed";
    }
    if (["cancelled", "canceled", "annullerad"].includes(value)) {
      return "Cancelled";
    }
    return "Pending";
  };

  const normalizeOrders = (rows: unknown[]): AdminOrder[] =>
    rows.slice(0, 20).map((row, index) => {
      const anyRow = row as Record<string, unknown>;
      const nestedCustomer =
        (anyRow.customer as Record<string, unknown> | undefined) ||
        (anyRow.user as Record<string, unknown> | undefined);
      const items = Array.isArray(anyRow.items) ? anyRow.items : [];
      const firstItem = (items[0] as Record<string, unknown> | undefined) || {};

      const dateRaw =
        (typeof anyRow.date === "string" && anyRow.date) ||
        (typeof anyRow.createdAt === "string" && anyRow.createdAt) ||
        "";

      return {
        orderId:
          (typeof anyRow.orderId === "string" && anyRow.orderId) ||
          (typeof anyRow.id === "string" && anyRow.id) ||
          (typeof anyRow._id === "string" && anyRow._id) ||
          `#ORD-${1000 + index}`,
        customerName:
          (typeof anyRow.customerName === "string" && anyRow.customerName) ||
          (typeof nestedCustomer?.name === "string" && nestedCustomer.name) ||
          (typeof nestedCustomer?.email === "string" && nestedCustomer.email) ||
          "Okand kund",
        productName:
          (typeof anyRow.productName === "string" && anyRow.productName) ||
          (typeof anyRow.product === "string" && anyRow.product) ||
          (typeof firstItem.name === "string" && firstItem.name) ||
          (typeof firstItem.title === "string" && firstItem.title) ||
          "Dack",
        date: dateRaw
          ? new Date(dateRaw).toLocaleDateString("sv-SE")
          : new Date().toLocaleDateString("sv-SE"),
        price:
          Number(anyRow.price) ||
          Number(anyRow.totalAmount) ||
          Number(anyRow.total) ||
          Number(anyRow.amount) ||
          0,
        status: normalizeStatus(anyRow.status ?? anyRow.orderStatus ?? anyRow.paymentStatus),
        countryCode: typeof anyRow.countryCode === "string" ? anyRow.countryCode : undefined,
      };
    });

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          setError("Saknar inloggningstoken.");
          setOrders([]);
          return;
        }

        const response = await orderAPI.getAll(token);
        const rows = Array.isArray(response)
          ? response
          : Array.isArray(response?.orders)
            ? response.orders
            : [];

        setOrders(normalizeOrders(rows));
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Kunde inte hamta bestallningar.";
        setError(message);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    void loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    if (!searchQuery) return orders;
    return orders.filter((order) => {
      const target = `${order.orderId} ${order.customerName} ${order.productName} ${order.countryCode || ""}`.toLowerCase();
      return target.includes(searchQuery);
    });
  }, [orders, searchQuery]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-52 rounded-lg" />
        <Skeleton className="h-[380px] w-full rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  return <OrdersTable rows={filteredOrders} />;
}
