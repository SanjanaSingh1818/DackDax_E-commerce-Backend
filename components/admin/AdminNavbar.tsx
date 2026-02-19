"use client";

import { useEffect, useState } from "react";
import { Bell, Menu, Moon, Search, Sun, UserPlus } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteSent, setInviteSent] = useState(false);

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const runSearch = () => {
    const trimmed = query.trim();
    const params = new URLSearchParams(searchParams.toString());
    if (trimmed) {
      params.set("q", trimmed);
    } else {
      params.delete("q");
    }

    const targetPath = pathname.startsWith("/admin/orders") ? pathname : "/admin/orders";
    const queryString = params.toString();
    router.push(queryString ? `${targetPath}?${queryString}` : targetPath);
  };

  const sendInvite = async () => {
    const email = inviteEmail.trim();
    if (!email) return;

    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/register?invite=${encodeURIComponent(email)}`
      );
    } catch {
      // ignore clipboard failures
    }

    setInviteSent(true);
    setTimeout(() => {
      setInviteSent(false);
      setInviteOpen(false);
      setInviteEmail("");
    }, 1200);
  };

  return (
    <header className="sticky top-0 z-10 border-b bg-background/90 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-2 px-3 sm:gap-3 sm:px-4 lg:px-8">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Button variant="outline" size="icon" className="rounded-xl lg:hidden" onClick={onMenuClick}>
            <Menu className="h-4 w-4" />
            <span className="sr-only">Oppna meny</span>
          </Button>

          <form
            className="relative hidden w-[320px] md:block"
            onSubmit={(event) => {
              event.preventDefault();
              runSearch();
            }}
          >
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Sok dack, bestallningar, kunder..."
              className="rounded-xl border bg-muted/30 pl-9 pr-16"
            />
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 h-8 -translate-y-1/2 rounded-lg"
            >
              Sok
            </Button>
          </form>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Button className="hidden rounded-xl md:inline-flex" onClick={() => setInviteOpen(true)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Bjud in
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="rounded-xl md:hidden"
            onClick={() => setInviteOpen(true)}
          >
            <UserPlus className="h-4 w-4" />
            <span className="sr-only">Bjud in</span>
          </Button>

          <Button variant="outline" size="icon" className="relative rounded-xl">
            <Bell className="h-4 w-4" />
            <Badge className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full px-1.5 text-[10px]">3</Badge>
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

          <div className="flex items-center gap-2 rounded-xl border bg-card px-1.5 py-1.5 sm:px-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <span className="hidden text-sm font-medium sm:block">{adminName}</span>
          </div>
        </div>
      </div>

      <div className="px-3 pb-2 md:hidden">
        <form
          className="relative"
          onSubmit={(event) => {
            event.preventDefault();
            runSearch();
          }}
        >
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Sok dack, bestallningar, kunder..."
            className="rounded-xl border bg-muted/30 pl-9 pr-14"
          />
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 h-8 -translate-y-1/2 rounded-lg"
          >
            Sok
          </Button>
        </form>
      </div>

      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bjud in administrator</DialogTitle>
            <DialogDescription>
              Ange e-post. En inbjudningslank kopieras till urklipp.
            </DialogDescription>
          </DialogHeader>
          <Input
            type="email"
            value={inviteEmail}
            onChange={(event) => setInviteEmail(event.target.value)}
            placeholder="namn@foretag.se"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>
              Avbryt
            </Button>
            <Button onClick={sendInvite}>{inviteSent ? "Kopierad" : "Skicka inbjudan"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
