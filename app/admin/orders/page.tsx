"use client";

import { useEffect } from "react";

import OrdersTable from "@/components/admin/OrdersTable";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminDashboardStore } from "@/lib/admin-dashboard-store";

export default function AdminOrdersPage() {
  const { loading, orders, loadDashboard } = useAdminDashboardStore();

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-52 rounded-lg" />
        <Skeleton className="h-[380px] w-full rounded-xl" />
      </div>
    );
  }

  return <OrdersTable rows={orders} />;
}
