"use client";

import { useEffect, useState, useMemo } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import { CircleCheck, UserPlus } from "lucide-react";
import debounce from "lodash.debounce";

export default function SearchPatients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [linkedPatientIds, setLinkedPatientIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [doctorId, setDoctorId] = useState(null);
  const supabase = createBrowserSupabaseClient();

  // Fetch doctor info & linked patients
  useEffect(() => {
    (async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData?.user) return;

      setDoctorId(authData.user.id);

      const { data: linkedPatients } = await supabase
        .from("doctor_patient")
        .select("patient_id")
        .eq("doctor_id", authData.user.id);

      setLinkedPatientIds(linkedPatients?.map((d) => d.patient_id) || []);
    })();
  }, [supabase]);

  // Debounced search
  const performSearch = useMemo(
    () =>
      debounce(async (term) => {
        if (!term) {
          setResults([]);
          return;
        }

        setLoading(true);
        const { data, error } = await supabase
          .from("users")
          .select("id, email, name")
          .eq("role", "patient")
          .ilike("email", `%${term}%`)
          .limit(5);

        if (error) toast.error("Error searching patients");
        else setResults(data || []);

        setLoading(false);
      }, 300),
    [supabase]
  );

  useEffect(() => {
    performSearch(searchTerm);
    return performSearch.cancel;
  }, [searchTerm, performSearch]);

  // Add patient
  const handleAddPatient = async (patientId) => {
    setLoading(true);

    const { error } = await supabase
      .from("doctor_patient")
      .insert([{ doctor_id: doctorId, patient_id: patientId }]);

    if (error) toast.error("Failed to add patient");
    else {
      toast.success("Patient added successfully!");
      setLinkedPatientIds((prev) => [...prev, patientId]);
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
        autoComplete="off"
        name="patientSearch"
      />

      {searchTerm && (
        <div className="absolute mt-2 w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
          {loading ? (
            <div className="p-3 space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-8 w-full rounded-lg" />
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="p-3 text-sm text-zinc-500">No results</div>
          ) : (
            results.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors rounded-lg"
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
                    disabled={loading}
                  >
                    <UserPlus size={16} /> Add
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
