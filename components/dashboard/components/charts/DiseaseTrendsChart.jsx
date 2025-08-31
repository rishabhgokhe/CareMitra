"use client"

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

const data = [
  { name: "Hypertension", count: 340 },
  { name: "Diabetes", count: 295 },
  { name: "Thyroid", count: 180 },
  { name: "CBC", count: 410 },
  { name: "Lipid", count: 260 },
]

export default function DiseaseTrendsChart() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: 8, right: 8 }}>
          <CartesianGrid strokeDasharray="3 3" className="[&>line]:stroke-slate-100" />
          <XAxis dataKey="name" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#0f766e" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
