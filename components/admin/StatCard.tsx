import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export default function StatCard({
  title,
  value,
  growth,
  icon: Icon,
  indicatorClassName = "bg-teal-500",
}: {
  title: string;
  value: string;
  growth: number;
  icon: LucideIcon;
  indicatorClassName?: string;
}) {
  const positive = growth >= 0;

  return (
    <Card className="rounded-xl border-0 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <CardContent className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-semibold tracking-tight">{value}</p>
          </div>
          <div className="rounded-xl bg-muted p-2.5">
            <Icon className="h-4 w-4 text-foreground" />
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className={`h-2.5 w-2.5 rounded-full ${indicatorClassName}`} />
          <span className={positive ? "text-emerald-600" : "text-rose-600"}>
            {positive ? <ArrowUpRight className="mr-1 inline h-4 w-4" /> : <ArrowDownRight className="mr-1 inline h-4 w-4" />}
            {Math.abs(growth).toFixed(1)}%
          </span>
          <span className="text-muted-foreground">jamfort med forra manaden</span>
        </div>
      </CardContent>
    </Card>
  );
}
