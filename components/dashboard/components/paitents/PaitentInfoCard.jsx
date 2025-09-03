"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Droplet, Mail, Phone, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

const PatientInfoCard = ({ patient }) => {
  const initials = patient.name
    ? patient.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <Card className="relative p-6 flex flex-col md:flex-row items-center gap-6 rounded-2xl shadow-xl border border-border bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-zinc-900 dark:to-zinc-800/50 hover:shadow-2xl transition">
      <Button
        variant="outline"
        size="sm"
        className="absolute top-4 right-4 flex items-center gap-1"
      >
        <Edit className="h-4 w-4" /> Edit
      </Button>

      <Avatar className="h-28 w-28">
        {patient.avatar_url ? (
          <AvatarImage src={patient.avatar_url} alt={patient.name} />
        ) : (
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md">
            {initials}
          </AvatarFallback>
        )}
      </Avatar>

      <div className="flex-1">
        <h2 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
          {patient.name}
        </h2>

        <p className="mt-2 text-sm text-muted-foreground flex flex-wrap gap-2 items-center">
          {patient.gender} • {patient.dob}{" "}
          {patient.age && `• ${patient.age} yrs`} •{" "}
          <span className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold dark:bg-red-800/30 dark:text-red-400">
            <Droplet className="h-3 w-3" /> {patient.blood_group}
          </span>
        </p>

        <div className="flex flex-wrap gap-6 mt-4 text-sm">
          <span className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4 text-emerald-500" />{" "}
            {patient.phone || "-"}
          </span>
          <span className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4 text-blue-500" /> {patient.email || "-"}
          </span>
        </div>
      </div>
    </Card>
  );
};

export default PatientInfoCard;
