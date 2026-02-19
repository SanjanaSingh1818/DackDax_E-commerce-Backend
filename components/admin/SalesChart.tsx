"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatSEK } from "@/lib/currency";

const COLORS = ["#16a34a", "#e2e8f0"];

export default function SalesChart({
  salesPercentage,
  totalSales,
  totalRevenue,
}: {
  salesPercentage: number;
  totalSales: number;
  totalRevenue: number;
}) {
  const safePercentage = Math.max(0, Math.min(100, Number.isFinite(salesPercentage) ? salesPercentage : 0));
  const chartData = [
    { name: "Sales", value: safePercentage },
    { name: "Remaining", value: 100 - safePercentage },
  ];

  return (
    <Card className="rounded-xl border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Saljprestanda</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="mx-auto h-52 w-full max-w-[240px] sm:h-56 sm:max-w-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                innerRadius={64}
                outerRadius={84}
                startAngle={90}
                endAngle={-270}
                strokeWidth={0}
              >
                {chartData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="-mt-16 text-center sm:-mt-20">
          <p className="text-2xl font-semibold sm:text-3xl">{safePercentage.toFixed(0)}%</p>
          <p className="text-sm text-muted-foreground">Andel uppnadd malniva</p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-2">
          <div className="rounded-xl border bg-muted/30 p-3 text-center">
            <p className="text-xs text-muted-foreground">Totalt antal salj</p>
            <p className="text-lg font-semibold">{totalSales.toLocaleString("sv-SE")}</p>
          </div>
          <div className="rounded-xl border bg-muted/30 p-3 text-center">
            <p className="text-xs text-muted-foreground">Total omsattning</p>
            <p className="text-lg font-semibold">{formatSEK(totalRevenue)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
