"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchAppointments } from "@/utils/fetchAppointments";
import CreateAppointment from "./CreateAppointment";
import AppointmentCard from "./AppointmentCard";
import AppointmentsSkeleton from "./AppointmentsSkeleton";

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
    <section className="rounded-2xl p-6 shadow border border-zinc-200 dark:border-zinc-800">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
          Upcoming Appointments
        </h3>
        <CreateAppointment />
      </div>

      {loading ? (
        <AppointmentsSkeleton />
      ) : appointments.length === 0 ? (
        <p className="text-sm text-zinc-500">No upcoming appointments.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {appointments.map((appt) => (
            <AppointmentCard key={appt.id} appointment={appt} />
          ))}
        </div>
      )}
    </section>
  );
};

export default Appointments;
