"use client"

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

const data = [
  { doctor: "Dr. Rao", appts: 42 },
  { doctor: "Dr. Iyer", appts: 38 },
  { doctor: "Dr. Shah", appts: 51 },
  { doctor: "Dr. Singh", appts: 34 },
  { doctor: "Dr. Khan", appts: 46 },
  { doctor: "Dr. Bose", appts: 29 },
]

export default function DoctorUtilizationChart() {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ left: 8, right: 8 }}>
          <CartesianGrid strokeDasharray="3 3" className="[&>line]:stroke-slate-100" />
          <XAxis dataKey="doctor" tickLine={false} axisLine={false} />
          <YAxis tickLine={false} axisLine={false} />
          <Tooltip />
          <Bar dataKey="appts" fill="#0f766e" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
