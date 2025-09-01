"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

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
  const [isOpen, setIsOpen] = useState(false);

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
      setIsOpen(false);
    }

    setLoading(false);
  };

  return (
    <section className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow border border-zinc-200 dark:border-zinc-800 max-w-md mx-auto">
      <Button
        className="mb-4 w-full"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? "Close Form ✖️" : "Create Appointment ➕"}
      </Button>

      {isOpen && (
        <div className="space-y-4">
          {/* Patient Select */}
          <div>
            <Label
              htmlFor="patient"
              className="text-zinc-700 dark:text-zinc-300"
            >
              Patient
            </Label>
            <select
              id="patient"
              className="w-full mt-1 p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
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

          {/* Hospital Select */}
          <div>
            <Label
              htmlFor="hospital"
              className="text-zinc-700 dark:text-zinc-300"
            >
              Hospital
            </Label>
            <select
              id="hospital"
              className="w-full mt-1 p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
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

          {/* Scheduled Date & Time */}
          <div>
            <Label
              htmlFor="datetime"
              className="text-zinc-700 dark:text-zinc-300"
            >
              Scheduled Date & Time
            </Label>
            <Input
              id="datetime"
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes" className="text-zinc-700 dark:text-zinc-300">
              Notes (optional)
            </Label>
            <textarea
              id="notes"
              className="w-full mt-1 p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <Button
            onClick={handleCreateAppointment}
            disabled={loading}
            className="w-full"
          >
            {loading ? "Creating..." : "Create Appointment ✅"}
          </Button>
        </div>
      )}
    </section>
  );
}
