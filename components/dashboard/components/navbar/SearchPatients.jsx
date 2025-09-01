"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function SearchPatients() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const supabase = createBrowserSupabaseClient();

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
        console.error(error); // ❌ log error for debugging
        toast.error("Error searching patients");
      } else {
        setResults(data || []);
      }

      setLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchTerm, supabase]);

  const handleAddPatient = async (patientId) => {
    // 🔑 get logged-in doctor
    const {
      data: { user: authUser },
      error: authErr,
    } = await supabase.auth.getUser();

    if (authErr || !authUser) {
      console.error(authErr);
      toast.error("Authentication error. Please log in again.");
      return;
    }

    // ✅ doctor exists in doctors table
    const { data: doctorRow, error: doctorErr } = await supabase
      .from("doctors")
      .select("id")
      .eq("id", authUser.id) // doctors.id = users.id
      .single();

    if (doctorErr || !doctorRow) {
      console.error(doctorErr);
      toast.error("Doctor record not found");
      return;
    }

    // 🛑 check if already linked
    const { data: existingLink, error: linkErr } = await supabase
      .from("doctor_patient")
      .select("id")
      .eq("doctor_id", doctorRow.id)
      .eq("patient_id", patientId)
      .maybeSingle();

    if (linkErr) {
      console.error(linkErr);
      toast.error("Error checking existing relationship");
      return;
    }

    if (existingLink) {
      toast("Patient already added", { icon: "ℹ️" });
      return;
    }

    // 🔗 insert into doctor_patient join table
    const { error } = await supabase.from("doctor_patient").insert({
      doctor_id: doctorRow.id,
      patient_id: patientId,
    });

    if (error) {
      console.error(error);
      toast.error("Error adding patient");
    } else {
      toast.success("Patient added successfully!");
    }
  };

  return (
    <div className="flex-1 max-w-md relative">
      <Input
        id="topnav-search"
        type="search"
        placeholder="Search patients by email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full rounded-xl"
      />

      {/* Dropdown */}
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
                <Button
                  size="sm"
                  className="rounded-lg"
                  onClick={() => handleAddPatient(u.id)}
                >
                  Add Patient
                </Button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
