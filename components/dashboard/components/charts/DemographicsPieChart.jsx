"use client"

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts"

// Color palette: teal for main slices, amber as accent
const COLORS = ["#0f766e", "#14b8a6", "#0f766e", "#f59e0b"]

const data = [
  { name: "0-18", value: 12 },
  { name: "19-35", value: 34 },
  { name: "36-55", value: 28 },
  { name: "56+", value: 26 },
]

export default function DemographicsPieChart() {
  return (
    <div className="h-64">
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
            paddingAngle={2}
          >
            {data.map((_, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
