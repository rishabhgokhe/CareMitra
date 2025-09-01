"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Modernized palette (works in both light/dark mode)
const COLORS = ["#0f766e", "#14b8a6", "#0d9488", "#f59e0b"];

const data = [
  { name: "0-18", value: 12 },
  { name: "19-35", value: 34 },
  { name: "36-55", value: 28 },
  { name: "56+", value: 26 },
];

export default function DemographicsPieChart() {
  return (
    <Card className="rounded-2xl border border-border/50 shadow-sm bg-card/80 backdrop-blur">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground">
          Age Demographics
        </CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              innerRadius={50}
              paddingAngle={3}
              strokeWidth={2}
            >
              {data.map((_, idx) => (
                <Cell
                  key={idx}
                  fill={COLORS[idx % COLORS.length]}
                  className="transition-all duration-300 hover:opacity-80"
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
                color: "hsl(var(--foreground))",
                fontSize: "0.85rem",
              }}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              wrapperStyle={{
                fontSize: "0.75rem",
                color: "hsl(var(--muted-foreground))",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
