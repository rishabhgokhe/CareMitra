"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchAppointments } from "@/utils/fetchAppointments";
import CreateAppointment from "./CreateAppointment";
import ButtonLoader from "@/components/elements/ButtonLoader";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadAppointments = async () => {
    setLoading(true);
    const { success, data, error } = await fetchAppointments();
    if (!success) {
      toast.error(error);
    } else {
      setAppointments(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  return (
    <section className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow border border-zinc-200 dark:border-zinc-800">
      <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
        Upcoming Appointments
      </h3>

      <CreateAppointment />

      {loading ? (
        <ButtonLoader text="Loading appointments..." />
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