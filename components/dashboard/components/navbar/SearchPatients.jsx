"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { CircleCheck, UserPlus } from "lucide-react";

export default function SearchPatients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [linkedPatientIds, setLinkedPatientIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const supabase = createBrowserSupabaseClient();

  const [doctorId, setDoctorId] = useState(null);
  useEffect(() => {
    (async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user) {
        setDoctorId(authData.user.id);

        // Fetch already linked patients
        const { data } = await supabase
          .from("doctor_patient")
          .select("patient_id")
          .eq("doctor_id", authData.user.id);
        setLinkedPatientIds(data?.map((d) => d.patient_id) || []);
      }
    })();
  }, [supabase]);

  useEffect(() => {
    if (!searchTerm) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("users")
        .select("id, email, name")
        .eq("role", "patient")
        .ilike("email", `%${searchTerm}%`)
        .limit(5);

      if (error) {
        toast.error("Error searching patients");
      } else {
        setResults(data || []);
      }

      setLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchTerm, supabase]);

  const handleAddPatient = async (patientId) => {
    setLoading(true);

    const { error: insertErr } = await supabase
      .from("doctor_patient")
      .insert([{ doctor_id: doctorId, patient_id: patientId }]);

    if (insertErr) {
      toast.error("Failed to add patient");
    } else {
      toast.success("Patient added successfully!");
      setLinkedPatientIds((prev) => [...prev, patientId]); // update state
    }

    setLoading(false);
  };

  return (
    <div className="flex-1 max-w-md relative">
      <Input
        type="search"
        placeholder="Search patients by email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full rounded-xl"
      />

      {searchTerm && (
        <div className="absolute mt-2 w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
          {loading ? (
            <div className="p-3 text-sm text-zinc-500">Searching...</div>
          ) : results.length === 0 ? (
            <div className="p-3 text-sm text-zinc-500">No results</div>
          ) : (
            results.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {u.name || "Unnamed User"}
                  </span>
                  <span className="text-xs text-zinc-500">{u.email}</span>
                </div>

                {linkedPatientIds.includes(u.id) ? (
                  <span className="flex items-center gap-1 px-3 py-1 text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-300 font-semibold rounded-full text-sm">
                    <CircleCheck size={16} /> Added
                  </span>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddPatient(u.id)}
                  >
                    <UserPlus size={16} /> Add Patient
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
