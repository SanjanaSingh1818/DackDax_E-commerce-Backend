"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, ShieldCheck, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export type SidebarItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

type SidebarProps = {
  items: SidebarItem[];
  adminName: string;
};

function SidebarContent({
  items,
  adminName,
  onNavigate,
}: {
  items: SidebarItem[];
  adminName: string;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/login");
  };

  return (
    <div className="flex h-full flex-col border-r bg-card/80 backdrop-blur">
      <div className="border-b p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight">DeckDex Admin</p>
            <p className="text-xs text-muted-foreground">Premium Control Hub</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border bg-background p-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{adminName}</p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {items.map((item) => {
          const active = pathname === item.href;
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

      <div className="p-4">
        <Button
          variant="outline"
          className="w-full justify-start gap-2 rounded-xl"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 text-destructive" />
          Logout
        </Button>
      </div>
    </div>
  );
}

export function Sidebar({ items, adminName }: SidebarProps) {
  return (
    <aside className="hidden h-screen w-72 shrink-0 lg:block">
      <SidebarContent items={items} adminName={adminName} />
    </aside>
  );
}

export function MobileSidebar({
  items,
  adminName,
  open,
  onOpenChange,
}: SidebarProps & { open: boolean; onOpenChange: (open: boolean) => void }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-80 p-0">
        <SheetHeader className="sr-only">
          <SheetTitle>Admin menu</SheetTitle>
        </SheetHeader>
        <SidebarContent
          items={items}
          adminName={adminName}
          onNavigate={() => onOpenChange(false)}
        />
        <SheetClose asChild>
          <Button variant="ghost" size="sm" className="absolute right-3 top-3 rounded-lg">
            Close
          </Button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
}
