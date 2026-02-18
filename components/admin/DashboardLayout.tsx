"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart3,
  FileText,
  LayoutDashboard,
  Package,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react";

import Navbar from "@/components/admin/Navbar";
import { MobileSidebar, Sidebar, type SidebarItem } from "@/components/admin/Sidebar";
import { Button } from "@/components/ui/button";

const navItems: SidebarItem[] = [
  { label: "Instrumentpanel", href: "/admin", icon: LayoutDashboard },
  { label: "Produkter", href: "/admin/products", icon: Package },
  { label: "Bestallningar & Fakturor", href: "/admin/orders", icon: ShoppingCart },
  { label: "Kunder", href: "/admin/customers", icon: Users },
  { label: "Analys", href: "/admin/analytics", icon: BarChart3 },
  { label: "Rapporter", href: "/admin/reports", icon: FileText },
  { label: "Installningar", href: "/admin/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [adminName, setAdminName] = useState("Admin");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");

    if (!token || !userString) {
      router.replace("/login");
      return;
    }

    try {
      const user = JSON.parse(userString);
      if (user?.role !== "admin") {
        router.replace("/");
        return;
      }
      setAdminName(user?.name || user?.fullName || "Admin");
      setCheckingAuth(false);
    } catch {
      router.replace("/login");
    }
  }, [router]);

  const mobileNavTrigger = useMemo(
    () => (
      <Button
        variant="outline"
        size="icon"
        className="rounded-xl"
        onClick={() => setMobileSidebarOpen(true)}
      >
        <span className="sr-only">Oppna meny</span>
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor">
          <path d="M3 6h18M3 12h18M3 18h18" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </Button>
    ),
    []
  );

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="rounded-xl border bg-card px-4 py-3 text-sm text-muted-foreground shadow-sm">
          Laddar adminpanel...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/80 dark:bg-slate-950">
      <div className="flex">
        <Sidebar items={navItems} adminName={adminName} />
        <MobileSidebar
          items={navItems}
          adminName={adminName}
          open={mobileSidebarOpen}
          onOpenChange={setMobileSidebarOpen}
        />
        <div className="min-w-0 flex-1">
          <Navbar adminName={adminName} mobileNavTrigger={mobileNavTrigger} />
          <main className="p-4 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
