"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  FileText,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  ShoppingCart,
  Upload,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

type SidebarItem = {
  label: string;
  href?: string;
  icon: LucideIcon;
  isLogout?: boolean;
};

const sidebarItems: SidebarItem[] = [
  { label: "Instrumentpanel", href: "/admin", icon: LayoutDashboard },
  { label: "Produkter", href: "/admin/products", icon: Package },
  { label: "Bestallningar & Fakturor", href: "/admin/orders", icon: ShoppingCart },
  { label: "Kunder", href: "/admin/customers", icon: Users },
  { label: "Analys", href: "/admin/analytics", icon: BarChart3 },
  { label: "Rapporter", href: "/admin/reports", icon: FileText },
  { label: "CSV-uppladdning", href: "/admin/upload", icon: Upload },
  { label: "Installningar", href: "/admin/settings", icon: Settings },
  { label: "Logga ut", icon: LogOut, isLogout: true },
];

function SidebarContent({
  adminName,
  adminRole,
  onNavigate,
}: {
  adminName: string;
  adminRole: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/login");
    onNavigate?.();
  };

  return (
    <div className="flex h-full flex-col border-r bg-card">
      <div className="border-b px-4 py-5 sm:px-5 sm:py-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center">
  <img
    src="/logo-circle.png"
    alt="DackDax"
    className="h-16 w-16 rounded-xl object-contain bg-muted p-1 cursor-pointer"
  />
</Link>
          <div>
            <p className="text-xl font-semibold tracking-tight">DackDax</p>
            <p className="text-xs text-muted-foreground">Adminpanel</p>
          </div>
        </div>
        <div className="mt-5 flex items-center gap-3 rounded-xl border bg-muted/30 p-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{adminName}</p>
            <p className="text-xs text-muted-foreground">{adminRole}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-2.5 sm:p-3">
        {sidebarItems.map((item) => {
          if (item.isLogout) {
            return (
              <button
                key={item.label}
                onClick={logout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition hover:bg-rose-50 hover:text-rose-600"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          }

          const active = item.href === pathname;
          if (!item.href) return null;
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default function AdminSidebar({
  adminName,
  adminRole,
  mobileOpen,
  onMobileOpenChange,
}: {
  adminName: string;
  adminRole: string;
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
}) {
  return (
    <>
      <aside className="fixed left-0 top-0 z-20 hidden h-screen w-72 lg:block">
        <SidebarContent adminName={adminName} adminRole={adminRole} />
      </aside>

      <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <SheetContent side="left" className="w-[85vw] max-w-72 p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Adminnavigering</SheetTitle>
          </SheetHeader>
          <SidebarContent
            adminName={adminName}
            adminRole={adminRole}
            onNavigate={() => onMobileOpenChange(false)}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 rounded-lg"
            onClick={() => onMobileOpenChange(false)}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Stang sidomeny</span>
          </Button>
        </SheetContent>
      </Sheet>
    </>
  );
}
