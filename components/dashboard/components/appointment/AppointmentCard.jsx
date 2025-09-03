"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Mail, Phone, Hospital } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

const statusVariant = {
  scheduled: "default",
  completed: "secondary",
  cancelled: "destructive",
};

export default function AppointmentCard({ appointment }) {
  const router = useRouter();

  if (!appointment) return null;

  return (
      <Card
        className={cn(
          "rounded-2xl shadow-sm border hover:shadow-md active:scale-[0.99] transition cursor-pointer overflow-hidden",
          appointment.status === "completed" &&
            "border-green-200 dark:border-green-500/40",
          appointment.status === "scheduled" &&
            "border-blue-200 dark:border-blue-500/40",
          appointment.status === "cancelled" &&
            "border-red-200 dark:border-red-500/40"
        )}
        onClick={() => router.push(`/patients/${appointment.patientId}`)}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="bg-gradient-to-br from-blue-500 to-indigo-600 dark:opacity-90 text-white">
                <AvatarFallback className="text-white">
                  {appointment.patientName?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base font-semibold">
                  {appointment.patientName || "Unknown Patient"}{" "}
                  {appointment.patientAge && (
                    <span className="font-normal text-muted-foreground">
                      ({appointment.patientAge} yrs)
                    </span>
                  )}
                </CardTitle>
              </div>
            </div>
            <Badge variant={statusVariant[appointment.status] ?? "outline"}>
              {appointment.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-blue-500" />
            <span className="text-muted-foreground">
              {appointment.patientEmail || "No email provided"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-emerald-500" />
            <span className="text-muted-foreground">
              {appointment.patientPhone || "No phone provided"}
            </span>
          </div>

          <Separator />

          <div className="flex items-center gap-2">
            <Hospital className="h-4 w-4 text-violet-500" />
            <span className="text-muted-foreground">
              {appointment.hospitalName || "Unknown Hospital"}
              {appointment.hospitalLocation &&
                ` • ${appointment.hospitalLocation}`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-amber-500" />
            <div className="flex flex-col">
              <span className="font-medium">
                {new Date(appointment.scheduledAt).toLocaleDateString([], {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <span className="text-xs text-muted-foreground">
                {new Date(appointment.scheduledAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                •{" "}
                {formatDistanceToNow(new Date(appointment.scheduledAt), {
                  addSuffix: true,
                })}
              </span>
            </div>
          </div>

          {appointment.notes && (
            <div className="bg-muted/40 dark:bg-muted/30 text-xs rounded-md p-2 border border-border/50 flex items-start gap-1.5">
              <span className="text-amber-500">💡</span>
              <span className="text-muted-foreground">{appointment.notes}</span>
            </div>
          )}
        </CardContent>
      </Card>
  );
}
