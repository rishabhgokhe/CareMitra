"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
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
} from "@/components/ui/dialog";
import toast from "react-hot-toast";
import { PlusCircle } from "lucide-react";
import ButtonLoader from "@/components/elements/ButtonLoader";

export default function CreateAppointment() {
  const supabase = createBrowserSupabaseClient();
  const [patients, setPatients] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedHospital, setSelectedHospital] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [doctorId, setDoctorId] = useState(null);
  const [open, setOpen] = useState(false);

  // Fetch doctor, patients, hospitals
  useEffect(() => {
    (async () => {
      const { data: authData, error: authErr } = await supabase.auth.getUser();
      if (authErr || !authData.user) {
        toast.error("You must be logged in as a doctor 🔒");
        return;
      }
      setDoctorId(authData.user.id);

      const { data: patientData } = await supabase
        .from("users")
        .select("id, name, email")
        .eq("role", "patient")
        .order("name", { ascending: true });
      setPatients(patientData || []);

      const { data: hospitalData } = await supabase
        .from("hospitals")
        .select("id, name, location")
        .order("name", { ascending: true });
      setHospitals(hospitalData || []);
    })();
  }, [supabase]);

  const handleCreateAppointment = async () => {
    if (!selectedPatient || !selectedHospital || !scheduledAt) {
      toast.error("Please fill all required fields ⚠️");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("appointments").insert([
      {
        patient_id: selectedPatient,
        doctor_id: doctorId,
        hospital_id: selectedHospital,
        scheduled_at: new Date(scheduledAt).toISOString(),
        status: "scheduled",
        notes,
      },
    ]);

    if (error) toast.error("Failed to create appointment ❌");
    else {
      toast.success("Appointment created successfully 🎉");
      // reset form
      setSelectedPatient("");
      setSelectedHospital("");
      setScheduledAt("");
      setNotes("");
      setOpen(false);
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Create Appointment <PlusCircle /></Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Appointment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
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

          <div>
            <Label htmlFor="datetime">Scheduled Date & Time</Label>
            <Input
              id="datetime"
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
          </div>

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
            {loading ? <ButtonLoader text="Creating..." /> : "Create Appointment ✅"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}