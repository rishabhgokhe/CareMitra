"use client";

import { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PatientsTable = ({ doctorId }) => {
  const supabase = createBrowserSupabaseClient();

  const [patients, setPatients] = useState([
    { id: 1, name: "Ravi Kumar", age: 45, condition: "Diabetes" },
    { id: 2, name: "Anita Sharma", age: 32, condition: "Hypertension" },
    { id: 3, name: "Sunil Yadav", age: 28, condition: "Asthma" },
  ]);

  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔍 Search Supabase users by email or name
  const handleSearch = async () => {
    setLoading(true);
    let { data, error } = await supabase
      .from("users")
      .select("id, email, full_name")
      .or(`email.ilike.%${search}%,full_name.ilike.%${search}%`)
      .limit(5);

    if (error) {
      console.error(error);
    } else {
      setResults(data);
    }
    setLoading(false);
  };

  // ➕ Add to doctor_patient table
  const handleAddPatient = async (patientId) => {
    const { error } = await supabase
      .from("doctor_patient")
      .insert([{ doctor_id: doctorId, patient_id: patientId }]);

    if (error) {
      console.error(error);
      alert("Error adding patient");
    } else {
      alert("Patient added successfully ✅");
      // optional: refresh patients list
    }
  };

  return (
    <section
      id="patients"
      className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow border border-zinc-200 dark:border-zinc-800"
    >
      <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
        Patients
      </h3>

      {/* 🔍 Search Bar */}
      <div className="flex items-center gap-2 mb-4">
        <Input
          type="text"
          placeholder="Search by email or name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      {/* Search Results */}
      {results.length > 0 && (
        <div className="mb-6 space-y-2">
          <h4 className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Search Results
          </h4>
          {results.map((u) => (
            <div
              key={u.id}
              className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-800 px-3 py-2 rounded-lg"
            >
              <div>
                <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {u.full_name || "Unnamed User"}
                </div>
                <div className="text-xs text-zinc-500">{u.email}</div>
              </div>
              <Button size="sm" onClick={() => handleAddPatient(u.id)}>
                Add Patient
              </Button>
            </div>
          ))}
        </div>
      )}

      {/* Existing Patients Table */}
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400">
            <th className="py-2">Name</th>
            <th className="py-2">Age</th>
            <th className="py-2">Condition</th>
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
              <td className="py-2 text-zinc-900 dark:text-zinc-100">{p.age}</td>
              <td className="py-2 text-zinc-900 dark:text-zinc-100">
                {p.condition}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default PatientsTable;
