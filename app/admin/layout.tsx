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
    const syncAdminFromStorage = () => {
      const userString = localStorage.getItem("user");
      if (!userString) return;

      try {
        const user = JSON.parse(userString);
        setAdminName(user?.name || user?.fullName || "Admin");
        setAdminRole(user?.roleLabel || "Admin");
      } catch {
        // ignore malformed local user cache
      }
    };

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

      syncAdminFromStorage();
      setLoading(false);
    } catch {
      router.replace("/login");
    }

    const onProfileUpdated = () => syncAdminFromStorage();
    const onStorage = (event: StorageEvent) => {
      if (!event.key || event.key === "user") {
        syncAdminFromStorage();
      }
    };

    window.addEventListener("admin-profile-updated", onProfileUpdated);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("admin-profile-updated", onProfileUpdated);
      window.removeEventListener("storage", onStorage);
    };
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
    <div className="min-h-screen overflow-x-hidden bg-slate-50/70 dark:bg-slate-950">
      <AdminSidebar
        adminName={adminName}
        adminRole={adminRole}
        mobileOpen={mobileOpen}
        onMobileOpenChange={setMobileOpen}
      />
      <div className="lg:pl-72">
        <AdminNavbar adminName={adminName} onMenuClick={() => setMobileOpen(true)} />
        <main className="p-3 sm:p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
