"use client";

import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import ButtonLoader from "@/components/elements/ButtonLoader";
import { PlusCircle, Calendar as CalendarIcon, Clock } from "lucide-react";
import toast from "react-hot-toast";

export default function CreateAppointment() {
  const supabase = createBrowserSupabaseClient();

  const [patients, setPatients] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedHospital, setSelectedHospital] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [doctorId, setDoctorId] = useState(null);
  const [open, setOpen] = useState(false);

  // Date & Time states
  const [date, setDate] = useState(null);
  const [time, setTime] = useState("");

  const scheduledAtISO =
    date && time
      ? new Date(`${format(date, "yyyy-MM-dd")}T${time}:00`).toISOString()
      : null;

  // Fetch doctor, patients, hospitals
  useEffect(() => {
    (async () => {
      // Get auth user
      const { data: authData, error: authErr } = await supabase.auth.getUser();
      if (authErr || !authData.user) {
        toast.error("You must be logged in as a doctor 🔒");
        return;
      }

      // Fetch doctor record (doctor.id = auth.users.id)
      const { data: doctorData, error: doctorErr } = await supabase
        .from("doctors")
        .select("id")
        .eq("id", authData.user.id)
        .single();

      if (doctorErr || !doctorData) {
        toast.error("Doctor profile not found!");
        return;
      }

      setDoctorId(doctorData.id);

      // Fetch patients
      const { data: patientData } = await supabase
        .from("users")
        .select("id, name, email")
        .eq("role", "patient")
        .order("name", { ascending: true });
      setPatients(patientData || []);

      // Fetch hospitals
      const { data: hospitalData } = await supabase
        .from("hospitals")
        .select("id, name, location")
        .order("name", { ascending: true });
      setHospitals(hospitalData || []);
    })();
  }, [supabase]);

  const handleCreateAppointment = async () => {
    if (!selectedPatient || !selectedHospital || !scheduledAtISO) {
      toast.error("Please fill all required fields ⚠️");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("appointments").insert([
      {
        patient_id: selectedPatient,
        doctor_id: doctorId,
        hospital_id: selectedHospital,
        scheduled_at: scheduledAtISO,
        status: "scheduled",
        notes,
      },
    ]);

    console.log(
      `Patient: ${selectedPatient}, Doctor: ${doctorId}, Hospital: ${selectedHospital}, Scheduled At: ${scheduledAtISO}, Notes: ${notes}`
    );

    if (error) toast.error("Failed to create appointment ❌");
    else {
      toast.success("Appointment created successfully 🎉");
      // Reset form
      setSelectedPatient("");
      setSelectedHospital("");
      setDate(null);
      setTime("");
      setNotes("");
      setOpen(false);
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          Create Appointment <PlusCircle className="ml-2 h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Appointment</DialogTitle>
          <DialogDescription>
            Fill in details below to schedule a new appointment.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Patient Selector */}
          <div>
            <Label htmlFor="patient">Patient</Label>
            <select
              id="patient"
              className="w-full mt-1 p-2 rounded-lg border bg-white dark:bg-zinc-800"
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
            >
              <option value="">Select a patient</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.email})
                </option>
              ))}
            </select>
          </div>

          {/* Hospital Selector */}
          <div>
            <Label htmlFor="hospital">Hospital</Label>
            <select
              id="hospital"
              className="w-full mt-1 p-2 rounded-lg border bg-white dark:bg-zinc-800"
              value={selectedHospital}
              onChange={(e) => setSelectedHospital(e.target.value)}
            >
              <option value="">Select a hospital</option>
              {hospitals.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} {h.location && `- ${h.location}`}
                </option>
              ))}
            </select>
          </div>

          {/* Date & Time Selector */}
          <div className="flex flex-col gap-2">
            <Label>Scheduled Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date || undefined}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Label>Scheduled Time</Label>
            <div className="relative">
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="pr-10"
              />
              <Clock className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <textarea
              id="notes"
              className="w-full mt-1 p-2 rounded-lg border bg-white dark:bg-zinc-800"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleCreateAppointment}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <ButtonLoader text="Creating..." />
            ) : (
              "Create Appointment ✅"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
