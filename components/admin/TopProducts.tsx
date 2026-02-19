import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TopTyre } from "@/lib/admin-api";
import { formatSEK } from "@/lib/currency";

export default function TopProducts({ items }: { items: TopTyre[] }) {
  return (
    <Card className="rounded-xl border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Mest salda dack</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
        {items.length === 0 ? (
          <div className="rounded-xl border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
            Inga saljdata tillgangliga.
          </div>
        ) : (
          items.map((item) => (
            <article
              key={item.name}
              className="flex items-center gap-3 rounded-xl border bg-card p-3 transition hover:-translate-y-0.5 hover:shadow-sm"
            >
              <img
                src={
                  item.image ||
                  "https://images.unsplash.com/photo-1518306727298-4c17e1bf6942?w=200&h=200&fit=crop"
                }
                alt={item.name}
                className="h-14 w-14 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {item.salesCount.toLocaleString("sv-SE")} salda
                </p>
              </div>
              <p className="text-right text-sm font-semibold">{formatSEK(item.revenue)}</p>
            </article>
          ))
        )}
      </CardContent>
    </Card>
  );
}
