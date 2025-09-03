"use client";

import { Card, CardContent } from "@/components/ui/card";
import { MessageSquareText, Paperclip, CalendarCheck2, FlaskConical, Phone } from "lucide-react";

const tasks = [
  {
    title: "Consultation with Ravi Kumar",
    due: "09:30 AM",
    priority: "High",
    status: "Confirmed",
    type: "Appointment",
    patient: "Ravi Kumar",
    comments: 2,
    attachments: 1,
  },
  {
    title: "Review MRI results - Anita Sharma",
    due: "11:00 AM",
    priority: "Medium",
    status: "Pending Review",
    type: "Report",
    patient: "Anita Sharma",
    comments: 0,
    attachments: 2,
  },
  {
    title: "Follow-up call - Arjun Mehta",
    due: "04:00 PM",
    priority: "Low",
    status: "Todo",
    type: "Follow-up",
    patient: "Arjun Mehta",
    comments: 1,
    attachments: 0,
  },
];

function Pill({ children, color = "slate" }) {
  const base = "text-xs rounded-full px-2.5 py-1 border font-medium transition-colors";
  const map = {
    emerald: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
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
                  <Pill color="slate">{t.type}</Pill>
                </div>
              </div>

              {/* Right side */}
              <div className="flex items-center gap-4">
                {/* Patient avatar initials */}
                <div className="flex -space-x-2">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-100 text-blue-600 font-semibold ring-2 ring-background">
                    {t.patient.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>

                {/* Comments + attachments */}
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