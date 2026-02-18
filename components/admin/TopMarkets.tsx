import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TopMarket } from "@/lib/admin-api";
import { formatSEK } from "@/lib/currency";

export default function TopMarkets({ items }: { items: TopMarket[] }) {
  return (
    <Card className="rounded-xl border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Toppmarknader</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((item) => (
          <div
            key={item.country}
            className="flex items-center justify-between rounded-xl border bg-muted/30 px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <img
                src={`https://flagcdn.com/w40/${item.countryCode.toLowerCase()}.png`}
                alt={item.country}
                className="h-5 w-7 rounded-sm object-cover"
              />
              <p className="text-sm font-medium">{item.country}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold">{formatSEK(item.revenue)}</p>
              <p className={item.growth >= 0 ? "text-xs text-emerald-600" : "text-xs text-rose-600"}>
                {item.growth >= 0 ? "+" : ""}
                {item.growth.toFixed(1)}%
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
