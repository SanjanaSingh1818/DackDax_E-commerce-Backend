"use client";

import { Bell, Moon, Search, Sun, UserPlus } from "lucide-react";
import { useTheme } from "next-themes";
import type { ReactNode } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

type NavbarProps = {
  adminName: string;
  mobileNavTrigger: ReactNode;
};

export default function Navbar({ adminName, mobileNavTrigger }: NavbarProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-3 px-4 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="lg:hidden">{mobileNavTrigger}</div>
          <div className="relative hidden w-[320px] md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search products, orders, customers..."
              className="rounded-xl border bg-muted/40 pl-9"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button className="hidden rounded-xl md:inline-flex">
            <UserPlus className="mr-2 h-4 w-4" />
            Invite
          </Button>

          <Button variant="outline" size="icon" className="rounded-xl">
            <Bell className="h-4 w-4" />
            <span className="sr-only">Notifications</span>
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="rounded-xl"
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-auto rounded-xl px-2 py-1.5">
                <Avatar className="h-9 w-9">
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl">
              <DropdownMenuLabel>
                <p className="text-sm font-medium">{adminName}</p>
                <p className="text-xs text-muted-foreground">admin@deckdex.com</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Preferences</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
