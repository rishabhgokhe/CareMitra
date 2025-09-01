"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export function RightRail() {
  const members = [
    { name: "Olivia Bennett", pct: 0.2 },
    { name: "Daniel Morgan", pct: 0.65 },
    { name: "Sophie Kim", pct: 0.4 },
  ]

  const mentions = [
    { name: "Olivia Bennett", text: "@James Could you review the latest adjustments?" },
    { name: "Michael Torres", text: "@James Added the footer layout." },
  ]

  return (
    <div className="space-y-4">
      {/* Team Capacity */}
      <Card className="rounded-2xl border border-border/50 shadow-sm bg-card/80 backdrop-blur">
        <CardContent className="p-4 space-y-3">
          <div className="text-sm font-medium text-muted-foreground">Team capacity</div>
          <div className="space-y-3">
            {members.map((m) => (
              <div key={m.name} className="flex items-center gap-3 group">
                <div className="grid h-8 w-8 place-items-center rounded-full bg-muted text-xs text-muted-foreground ring-1 ring-border/40 group-hover:ring-primary/40 transition">
                  👤
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">{m.name}</div>
                  <div className="mt-1 h-2 rounded-full bg-muted overflow-hidden">
                    <span
                      className={cn(
                        "block h-full rounded-full transition-all duration-500",
                        m.pct < 0.4
                          ? "bg-amber-500"
                          : m.pct < 0.7
                          ? "bg-blue-500"
                          : "bg-emerald-500"
                      )}
                      style={{ width: `${Math.round(m.pct * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mentions */}
      <Card className="rounded-2xl border border-border/50 shadow-sm bg-card/80 backdrop-blur">
        <CardContent className="p-4 space-y-3">
          <div className="text-sm font-medium text-muted-foreground">Recent mentions</div>
          {mentions.map((m, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="grid h-8 w-8 place-items-center rounded-full bg-muted text-xs text-muted-foreground ring-1 ring-border/40">
                👤
              </div>
              <div className="flex-1 text-sm leading-snug">
                <div className="font-medium text-foreground">{m.name}</div>
                <p className="text-muted-foreground">
                  <span className="text-primary font-medium">@James</span>{" "}
                  {m.text.replace("@James", "")}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}