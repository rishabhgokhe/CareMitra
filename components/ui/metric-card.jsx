"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer } from "recharts"
import { cn } from "@/lib/utils"

export function MetricCard({
  title,
  value,
  delta,
  deltaColor = "emerald",
  avatars,
  data = [],
}) {
  const colorMap = {
    emerald: "#10b981",
    amber: "#f59e0b",
    red: "#ef4444",
  }

  return (
    <Card className="rounded-2xl border-zinc-800 bg-zinc-900">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm text-zinc-400">{title}</div>
            <div className="mt-1 text-2xl font-semibold">{value}</div>
          </div>
          {delta ? (
            <span
              className={cn(
                "mt-0.5 inline-flex items-center rounded-full border px-2 py-0.5 text-xs",
                deltaColor === "emerald" && "border-emerald-500/20 bg-emerald-500/15 text-emerald-400",
                deltaColor === "amber" && "border-amber-500/20 bg-amber-500/15 text-amber-400",
                deltaColor === "red" && "border-red-500/20 bg-red-500/15 text-red-400",
              )}
            >
              {delta}
            </span>
          ) : avatars ? (
            <div className="flex -space-x-2">
              {Array.from({ length: avatars }).map((_, i) => (
                <span
                  key={i}
                  className="grid h-6 w-6 place-items-center rounded-full bg-zinc-800 ring-1 ring-zinc-800 text-[10px] text-zinc-300"
                >
                  👤
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-3 h-14">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="y"
                stroke="#10b981"
                strokeWidth={2}
                fill="url(#spark)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}