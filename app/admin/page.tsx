"use client";

import { useEffect, useState } from "react";
import { CircleDollarSign, ShoppingBag, ShoppingCart, Users } from "lucide-react";

import OrdersTable from "@/components/admin/OrdersTable";
import RevenueChart from "@/components/admin/RevenueChart";
import SalesChart from "@/components/admin/SalesChart";
import StatCard from "@/components/admin/StatCard";
import LowStockTyresCard from "@/components/admin/LowStockTyresCard";
import MarginSettingsCard from "@/components/admin/MarginSettingsCard";
import TopProducts from "@/components/admin/TopProducts";
import { Skeleton } from "@/components/ui/skeleton";
import { formatSEK } from "@/lib/currency";
import { useAdminDashboardStore } from "@/lib/admin-dashboard-store";

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-32 w-full rounded-xl" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Skeleton className="h-36 rounded-xl" />
        <Skeleton className="h-36 rounded-xl" />
        <Skeleton className="h-36 rounded-xl" />
        <Skeleton className="h-36 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Skeleton className="h-[360px] rounded-xl xl:col-span-2" />
        <Skeleton className="h-[360px] rounded-xl" />
      </div>
      <Skeleton className="h-[340px] rounded-xl" />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Skeleton className="h-[280px] rounded-xl" />
        <Skeleton className="h-[280px] rounded-xl" />
        <Skeleton className="h-[280px] rounded-xl" />
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [adminName, setAdminName] = useState("Admin");
  const { loading, stats, orders, revenue, topTyres, lowStockTyres, margin, marginSaving, loadDashboard, updateMargin } =
    useAdminDashboardStore();

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const user = JSON.parse(userString);
        setAdminName(user?.name || user?.fullName || "Admin");
      } catch {
        setAdminName("Admin");
      }
    }
    void loadDashboard();
  }, [loadDashboard]);

  const formattedDate = new Date().toLocaleDateString("sv-SE", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <section className="rounded-xl border border-slate-200 bg-gradient-to-r from-teal-700 to-cyan-700 p-4 text-white shadow-sm sm:p-6">
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl md:text-3xl">Valkommen tillbaka, {adminName}</h1>
        <p className="mt-1 text-sm text-white/90">{formattedDate}</p>
        <p className="mt-2 text-sm text-white/80 sm:mt-3">
          Har ar en snabb oversikt av DackDax senaste resultat.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total omsattning"
          value={formatSEK(stats.totalRevenue)}
          growth={stats.revenueGrowth}
          icon={CircleDollarSign}
          indicatorClassName="bg-teal-500"
        />
        <StatCard
          title="Totala bestallningar"
          value={stats.totalOrders.toLocaleString("sv-SE")}
          growth={stats.ordersGrowth}
          icon={ShoppingCart}
          indicatorClassName="bg-blue-500"
        />
        <StatCard
          title="Totala kunder"
          value={stats.totalCustomers.toLocaleString("sv-SE")}
          growth={stats.customersGrowth}
          icon={Users}
          indicatorClassName="bg-violet-500"
        />
        <StatCard
          title="Totalt salda dack"
          value={stats.totalTyresSold.toLocaleString("sv-SE")}
          growth={stats.tyresGrowth}
          icon={ShoppingBag}
          indicatorClassName="bg-orange-500"
        />
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RevenueChart data={revenue} />
        </div>
        <SalesChart
          salesPercentage={stats.salesPercentage}
          totalSales={stats.totalOrders}
          totalRevenue={stats.totalRevenue}
        />
      </section>

      <section>
        <OrdersTable rows={orders} />
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <TopProducts items={topTyres} />
        <LowStockTyresCard items={lowStockTyres} />
        <MarginSettingsCard margin={margin} saving={marginSaving} onSave={updateMargin} />
      </section>
    </div>
  );
}
