"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RevenuePoint } from "@/lib/admin-api";
import { formatSEK } from "@/lib/currency";

export default function RevenueChart({ data }: { data: RevenuePoint[] }) {
  return (
    <Card className="rounded-xl border-0 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Total vinstoversikt</CardTitle>
      </CardHeader>
      <CardContent className="h-[260px] sm:h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.3} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} />
            <YAxis
              axisLine={false}
              tickLine={false}
              fontSize={12}
              tickFormatter={(value) => `${Math.round(Number(value) / 1000)}k`}
            />
            <Tooltip
              cursor={{ fill: "rgba(15, 23, 42, 0.06)" }}
              contentStyle={{ borderRadius: "12px", borderColor: "#e2e8f0" }}
              formatter={(value) => formatSEK(Number(value))}
            />
            <Bar dataKey="revenue" fill="#0f766e" radius={[8, 8, 0, 0]} animationDuration={900} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
