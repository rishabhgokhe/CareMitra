"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import CreateAppointment from "./CreateAppointment";
import ButtonLoader from "@/components/elements/ButtonLoader";

const Appointments = () => {
  const supabase = createBrowserSupabaseClient();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);

    try {
      const {
        data: { user: authUser },
        error: authErr,
      } = await supabase.auth.getUser();

      if (authErr || !authUser) {
        toast.error("You must be logged in as a doctor 🔒");
        setLoading(false);
        return;
      }

      const doctorId = authUser.id;

      // Fetch appointments with patient and hospital details
      const { data, error } = await supabase
        .from("appointments")
        .select(
          `
          id,
          scheduled_at,
          status,
          notes,
          patient:patient_id (id, name, email, phone, dob),
          hospital:hospital_id (id, name, location)
        `
        )
        .eq("doctor_id", doctorId)
        .order("scheduled_at", { ascending: true });

      if (error) {
        toast.error("Failed to fetch appointments ❌");
      } else {
        const formatted = data.map((appt) => ({
          id: appt.id,
          patientName: appt.patient?.name || "Unnamed Patient",
          patientEmail: appt.patient?.email || "Unknown Email",
          patientPhone: appt.patient?.phone || "Unknown Phone",
          patientAge: appt.patient?.dob
            ? Math.floor(
                (new Date() - new Date(appt.patient.dob)) /
                  (1000 * 60 * 60 * 24 * 365)
              )
            : "Unknown",
          hospitalName: appt.hospital?.name || "Unknown Hospital",
          hospitalLocation: appt.hospital?.location || "",
          scheduledAt: new Date(appt.scheduled_at),
          status: appt.status,
          notes: appt.notes,
        }));
        setAppointments(formatted);
      }
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error while fetching appointments 💥");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  return (
    <section className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow border border-zinc-200 dark:border-zinc-800">
      <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
        Upcoming Appointments
      </h3>

      <CreateAppointment />

      {loading ? (
        <p className="text-sm text-zinc-500">
          <ButtonLoader text="Loading appointments..." />
        </p>
      ) : appointments.length === 0 ? (
        <p className="text-sm text-zinc-500">No upcoming appointments.</p>
      ) : (
        <ul className="space-y-3">
          {appointments.map((a) => (
            <li
              key={a.id}
              className="p-3 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <p className="font-medium text-zinc-900 dark:text-zinc-100">
                {a.patientName} ({a.patientAge} yrs)
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {a.patientEmail} • {a.patientPhone}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                Hospital: {a.hospitalName}{" "}
                {a.hospitalLocation && `• ${a.hospitalLocation}`}
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                Scheduled at:{" "}
                {a.scheduledAt.toLocaleString([], {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </p>
              <p
                className={`mt-1 capitalize font-semibold ${
                  a.status === "scheduled"
                    ? "text-blue-600"
                    : a.status === "completed"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {a.status}
              </p>
              {a.notes && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Notes: {a.notes}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Appointments;
