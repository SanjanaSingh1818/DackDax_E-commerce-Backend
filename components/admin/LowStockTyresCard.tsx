import { AlertTriangle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LowStockTyre } from "@/lib/admin-api";

export default function LowStockTyresCard({ items }: { items: LowStockTyre[] }) {
  return (
    <Card className="rounded-xl border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          Lagersaldo varning
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.length === 0 ? (
          <div className="rounded-xl border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
            Inga produkter med lag saldo just nu.
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border bg-muted/30 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">Grans: {item.threshold} st</p>
              </div>
              <p className="text-sm font-semibold text-orange-600">{item.stock} kvar</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
