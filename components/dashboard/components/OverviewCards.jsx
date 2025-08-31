"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer } from "recharts"

const spark = [
  { x: 1, y: 8 },
  { x: 2, y: 12 },
  { x: 3, y: 10 },
  { x: 4, y: 14 },
  { x: 5, y: 13 },
  { x: 6, y: 16 },
  { x: 7, y: 18 },
]

const kpis = [
  {
    label: "Total Patients",
    value: "12,384",
    sub: "+4.1% vs last month",
    delta: "+4.1%",
    deltaColor: "emerald",
    data: spark,
  },
  {
    label: "Upcoming Appointments",
    value: "128",
    sub: "Today + Next 7 Days",
    delta: "+1.3%",
    deltaColor: "emerald",
    data: spark,
  },
  {
    label: "Pending Reports",
    value: "37",
    sub: "Awaiting review/sign-off",
    delta: "-2.4%",
    deltaColor: "amber",
    data: spark,
  },
  {
    label: "Blockchain-Verified",
    value: "8,902",
    sub: "Verified reports on-chain",
    delta: "+0.8%",
    deltaColor: "emerald",
    data: spark,
  },
]

export default function OverviewCards() {
  return (
    <section aria-label="Key metrics" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <Card key={kpi.label} className="rounded-2xl border-zinc-800 bg-zinc-900">
          <CardHeader className="pb-1 flex-row items-center justify-between">
            <CardTitle className="text-sm font-medium text-zinc-400">{kpi.label}</CardTitle>
            {kpi.delta ? <DeltaBadge color={kpi.deltaColor}>{kpi.delta}</DeltaBadge> : null}
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-2xl font-semibold text-zinc-100">{kpi.value}</div>
            <p className="text-xs text-zinc-400 mt-1">{kpi.sub}</p>

            <div className="mt-3 h-12">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={kpi.data}>
                  <Area
                    type="monotone"
                    dataKey="y"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="#10b98122"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  )
}

function DeltaBadge({ children, color = "emerald" }) {
  const map = {
    emerald: "border-emerald-500/20 bg-emerald-500/15 text-emerald-400",
    amber: "border-amber-500/20 bg-amber-500/15 text-amber-400",
    red: "border-red-500/20 bg-red-500/15 text-red-400",
  }
  return <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs ${map[color]}`}>{children}</span>
}