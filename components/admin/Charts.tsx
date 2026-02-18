"use client";

import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import ChartCard from "@/components/admin/ChartCard";

type RevenueItem = {
  month: string;
  revenue: number;
};

const salesPerformanceData = [
  { name: "Achieved", value: 78 },
  { name: "Remaining", value: 22 },
];

const SALES_COLORS = ["#16a34a", "#e5e7eb"];

export function ProfitOverviewChart({ data }: { data: RevenueItem[] }) {
  return (
    <ChartCard title="Vinstoversikt" contentClassName="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={18}>
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip
              cursor={{ fill: "rgba(148, 163, 184, 0.1)" }}
              contentStyle={{ borderRadius: "0.8rem", borderColor: "#e2e8f0" }}
            />
            <Legend />
            <Bar dataKey="revenue" name="Omsattning" radius={[8, 8, 0, 0]} fill="#0f766e" />
          </BarChart>
        </ResponsiveContainer>
    </ChartCard>
  );
}

export function SalesPerformanceCard() {
  return (
    <ChartCard title="Saljprestanda">
        <div className="mx-auto h-[220px] w-full max-w-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={salesPerformanceData}
                dataKey="value"
                innerRadius={62}
                outerRadius={84}
                startAngle={90}
                endAngle={-270}
                strokeWidth={0}
              >
                {salesPerformanceData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={entry.name === "Achieved" ? SALES_COLORS[0] : SALES_COLORS[1]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="-mt-20 text-center">
          <p className="text-3xl font-semibold tracking-tight">78%</p>
          <p className="text-sm text-muted-foreground">Uppfyllnad av mal</p>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3">
          <div className="rounded-xl border bg-muted/40 p-3 text-center">
            <p className="text-xs text-muted-foreground">Antal salj</p>
            <p className="text-lg font-semibold">5,240</p>
          </div>
          <div className="rounded-xl border bg-muted/40 p-3 text-center">
            <p className="text-xs text-muted-foreground">Total omsattning</p>
            <p className="text-lg font-semibold">182,4k kr</p>
          </div>
        </div>
    </ChartCard>
  );
}
