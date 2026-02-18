"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";

import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [adminName, setAdminName] = useState("Admin");
  const [adminRole, setAdminRole] = useState("Admin");
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
      setAdminRole(user?.roleLabel || "Admin");
      setLoading(false);
    } catch {
      router.replace("/login");
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="rounded-xl border bg-card px-4 py-3 text-sm text-muted-foreground shadow-sm">
          Laddar instrumentpanelen...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 dark:bg-slate-950">
      <AdminSidebar
        adminName={adminName}
        adminRole={adminRole}
        mobileOpen={mobileOpen}
        onMobileOpenChange={setMobileOpen}
      />
      <div className="lg:pl-72">
        <AdminNavbar adminName={adminName} onMenuClick={() => setMobileOpen(true)} />
        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
