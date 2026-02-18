"use client";

import { Bell, Menu, Moon, Search, Sun, UserPlus } from "lucide-react";
import { useTheme } from "next-themes";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminNavbar({
  adminName,
  onMenuClick,
}: {
  adminName: string;
  onMenuClick: () => void;
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <header className="sticky top-0 z-10 border-b bg-background/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-3 px-4 lg:px-8">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-4 w-4" />
            <span className="sr-only">Oppna meny</span>
          </Button>
          <div className="relative hidden w-[320px] md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Sok dack, bestallningar, kunder..."
              className="rounded-xl border bg-muted/30 pl-9"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button className="hidden rounded-xl md:inline-flex">
            <UserPlus className="mr-2 h-4 w-4" />
            Bjud in
          </Button>

          <Button variant="outline" size="icon" className="relative rounded-xl">
            <Bell className="h-4 w-4" />
            <Badge className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full px-1.5 text-[10px]">
              3
            </Badge>
            <span className="sr-only">Notiser</span>
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="rounded-xl"
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span className="sr-only">Byt tema</span>
          </Button>

          <div className="flex items-center gap-2 rounded-xl border bg-card px-2 py-1.5">
            <Avatar className="h-8 w-8">
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <span className="hidden text-sm font-medium sm:block">{adminName}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
