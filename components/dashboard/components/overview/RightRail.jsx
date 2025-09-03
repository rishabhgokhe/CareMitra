"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Activity, Stethoscope } from "lucide-react";

export function RightRail() {
  const vitalsAlerts = [
    { patient: "Ravi Kumar", alert: "High BP detected", severity: "High" },
    { patient: "Anita Sharma", alert: "Low sugar levels", severity: "Medium" },
  ];

  const teamMentions = [
    { name: "Nurse Priya", text: "@Doctor Please check lab reports of Anita." },
    { name: "Reception", text: "@Doctor Reminder: 3 PM appointment with Mr. Mehta." },
  ];

  return (
    <div className="space-y-4">
      {/* Vitals Alerts */}
      <Card className="rounded-2xl border border-border/50 shadow-sm bg-card/80 backdrop-blur">
        <CardContent className="p-4 space-y-3">
          <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Activity className="h-4 w-4 text-red-500" />
            Patient Vitals Alerts
          </div>
          {vitalsAlerts.map((v, i) => (
            <div
              key={i}
              className={cn(
                "flex items-start gap-3 p-2 rounded-lg transition-colors",
                v.severity === "High" && "bg-red-50 dark:bg-red-500/10",
                v.severity === "Medium" && "bg-amber-50 dark:bg-amber-500/10"
              )}
            >
              <div className="grid h-8 w-8 place-items-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                {v.patient.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="flex-1 text-sm">
                <div className="font-medium text-foreground">{v.patient}</div>
                <p className="text-muted-foreground">{v.alert}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Team Mentions */}
      <Card className="rounded-2xl border border-border/50 shadow-sm bg-card/80 backdrop-blur">
        <CardContent className="p-4 space-y-3">
          <div className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-blue-500" />
            Team Mentions
          </div>
          {teamMentions.map((m, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="grid h-8 w-8 place-items-center rounded-full bg-muted text-xs text-muted-foreground ring-1 ring-border/40">
                👩‍⚕️
              </div>
              <div className="flex-1 text-sm leading-snug">
                <div className="font-medium text-foreground">{m.name}</div>
                <p className="text-muted-foreground">
                  <span className="text-primary font-medium">@Doctor</span>{" "}
                  {m.text.replace("@Doctor", "")}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}