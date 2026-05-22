"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface ChartData {
  name: string;
  registrations: number;
}

export function StatsChart({ data }: { data: ChartData[] }) {
  if (data.length === 0) {
    return (
      <p className="text-text-muted text-sm text-center py-12">
        No registration data yet.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
        <XAxis
          dataKey="name"
          tick={{ fill: "#94A3B8", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "#94A3B8", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          contentStyle={{
            background: "#121826",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
          }}
          labelStyle={{ color: "#EAF2FF" }}
        />
        <Bar
          dataKey="registrations"
          fill="#00E5FF"
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
