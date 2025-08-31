"use client"

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

const data = [
  { month: "Jan", visits: 820 },
  { month: "Feb", visits: 910 },
  { month: "Mar", visits: 1200 },
  { month: "Apr", visits: 980 },
  { month: "May", visits: 1350 },
  { month: "Jun", visits: 1520 },
  { month: "Jul", visits: 1600 },
  { month: "Aug", visits: 1480 },
  { month: "Sep", visits: 1390 },
  { month: "Oct", visits: 1700 },
  { month: "Nov", visits: 1650 },
  { month: "Dec", visits: 1820 },
]

export default function SeasonalFootfallChart() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ left: 8, right: 8 }}>
          <CartesianGrid strokeDasharray="3 3" className="[&>line]:stroke-slate-100" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip />
          <Line type="monotone" dataKey="visits" stroke="#0f766e" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
