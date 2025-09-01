"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import ButtonLoader from "@/components/elements/ButtonLoader";

const PatientsTable = () => {
  const supabase = createBrowserSupabaseClient();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPatients = async () => {
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

      // 2️⃣ Get all patient_ids linked to this doctor
      const { data: links, error: linkErr } = await supabase
        .from("doctor_patient")
        .select("patient_id")
        .eq("doctor_id", doctorId);

      if (linkErr) {
        toast.error("Failed to load linked patients IDs");
        setLoading(false);
        return;
      }

      const patientIds = links.map((l) => l.patient_id);
      if (patientIds.length === 0) {
        setPatients([]);
        setLoading(false);
        return;
      }

      // Fetch full patient details from users table
      const { data: patientData, error: patientErr } = await supabase
        .from("users")
        .select("id, name, email, dob")
        .in("id", patientIds);

      if (patientErr) {
        toast.error("Failed to load patient details");
        setLoading(false);
        return;
      }

      const formatted = patientData.map((p) => ({
        id: p.id,
        name: p.name || "Unnamed Patient",
        email: p.email,
        age: p.dob
          ? Math.floor(
              (new Date() - new Date(p.dob)) / (1000 * 60 * 60 * 24 * 365)
            )
          : "Unknown",
      }));

      setPatients(formatted);
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error while fetching patients");
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <section className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow border border-zinc-200 dark:border-zinc-800">
      <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
        Linked Patients
      </h3>

      {loading ? (
        <p className="text-sm text-zinc-500">
          <ButtonLoader text="Loading patients..." />
        </p>
      ) : patients.length === 0 ? (
        <p className="text-sm text-zinc-500">No patients linked yet.</p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400">
              <th className="py-2">Name</th>
              <th className="py-2">Age</th>
              <th className="py-2">Email</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr
                key={p.id}
                className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <td className="py-2 text-zinc-900 dark:text-zinc-100">
                  {p.name}
                </td>
                <td className="py-2 text-zinc-900 dark:text-zinc-100">
                  {p.age}
                </td>
                <td className="py-2 text-zinc-900 dark:text-zinc-100">
                  {p.email}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
};

export default PatientsTable;
