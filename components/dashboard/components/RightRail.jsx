"use client"

import { Card, CardContent } from "@/components/ui/card"

export function RightRail() {
  return (
    <div className="space-y-3">
      <Card className="bg-zinc-900 border-zinc-800 rounded-2xl">
        <CardContent className="p-4">
          <div className="mb-3">
            <div className="text-sm text-zinc-400">Team capacity</div>
          </div>
          <div className="space-y-3">
            {[
              { name: "Olivia Bennett", pct: 0.2 },
              { name: "Daniel Morgan", pct: 0.65 },
              { name: "Sophie Kim", pct: 0.4 },
            ].map((m) => (
              <div key={m.name} className="flex items-center gap-3">
                <div className="grid h-7 w-7 place-items-center rounded-full bg-zinc-800 text-[10px] text-zinc-300">
                  👤
                </div>
                <div className="flex-1">
                  <div className="text-sm">{m.name}</div>
                  <div className="mt-1 h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                    <span className="block h-full bg-emerald-500" style={{ width: `${Math.round(m.pct * 100)}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-800 rounded-2xl">
        <CardContent className="p-4">
          <div className="mb-3">
            <div className="text-sm text-zinc-400">Recent mentions</div>
          </div>
          <div className="space-y-3">
            {[
              { name: "Olivia Bennett", text: "@James Could you review the latest adjustments?" },
              { name: "Michael Torres", text: "@James Added the footer layout." },
            ].map((m, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="grid h-7 w-7 place-items-center rounded-full bg-zinc-800 text-[10px] text-zinc-300">
                  👤
                </div>
                <div className="flex-1 text-sm">
                  <div className="text-zinc-200">{m.name}</div>
                  <p className="text-zinc-400">
                    <span className="text-emerald-400">@James</span> {m.text.replace("@James", "")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
