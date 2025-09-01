"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquareText, Paperclip } from "lucide-react";

const tasks = [
  {
    title: "Review final UI assets for marketing website",
    due: "In 2h 16m",
    priority: "High",
    status: "In Progress",
    project: "LumenForge",
    comments: 3,
    attachments: 0,
  },
  {
    title: "Oversee copy refinement for integration pages",
    due: "In 3h 25m",
    priority: "Medium",
    status: "Todo",
    project: "NebulaCart",
    comments: 1,
    attachments: 2,
  },
  {
    title: "Plan and delegate onboarding flow wireframes",
    due: "In 4h 12m",
    priority: "Medium",
    status: "Todo",
    project: "EchoSuite",
    comments: 0,
    attachments: 1,
  },
];

function Pill({ children, color = "slate" }) {
  const base =
    "text-xs rounded-full px-2.5 py-1 border font-medium transition-colors";
  const map = {
    emerald:
      "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    amber:
      "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
    red: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/20",
    slate: "bg-muted text-muted-foreground border-border",
  };
  return <span className={`${base} ${map[color]}`}>{children}</span>;
}

export function MyDay() {
  return (
    <div className="space-y-3">
      {tasks.map((t, i) => (
        <Card
          key={i}
          className="rounded-2xl border-border shadow-sm hover:shadow-md transition-all"
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              {/* Left side */}
              <div className="flex-1">
                {/* Due time */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="inline-flex h-2 w-2 rounded-full bg-muted-foreground/40" />
                    {t.due}
                  </span>
                </div>

                {/* Task title */}
                <div className="text-sm md:text-[15px] leading-6 font-medium text-foreground">
                  {t.title}
                </div>

                {/* Tags */}
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Pill
                    color={
                      t.priority === "High"
                        ? "red"
                        : t.priority === "Medium"
                        ? "amber"
                        : "slate"
                    }
                  >
                    {t.priority}
                  </Pill>
                  <Pill color="emerald">{t.status}</Pill>
                  <Pill color="slate">{t.project}</Pill>
                </div>
              </div>

              {/* Right side: avatars + comments + attachments */}
              <div className="flex items-center gap-4">
                {/* Dummy avatars */}
                <div className="flex -space-x-2">
                  {Array.from({ length: Math.min(3, 1 + (i % 3)) }).map(
                    (_, idx) => (
                      <span
                        key={idx}
                        className="grid h-7 w-7 place-items-center rounded-full bg-muted ring-2 ring-background text-[10px] text-muted-foreground"
                      >
                        👤
                      </span>
                    )
                  )}
                </div>

                <div className="flex items-center gap-3 text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <MessageSquareText className="h-4 w-4" />
                    <span className="text-sm">{t.comments}</span>
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Paperclip className="h-4 w-4" />
                    <span className="text-sm">{t.attachments}</span>
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
