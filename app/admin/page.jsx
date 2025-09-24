"use client";

import React, { useState, useEffect } from "react";
import RoleProtectedPage from "@/components/admin/RoleProtectedPage";
import HospitalAddDoctor from "@/components/admin/hospital/HospitalAddDoctor";
import AddNewHospital from "@/components/admin/system/AddNewHospital";
import EditHospital from "@/components/admin/system/EditHospital";
import { Button } from "@/components/ui/button";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

export default function AdminPage() {
  const [showHospitalForm, setShowHospitalForm] = useState(false);
  const [showDoctorForm, setShowDoctorForm] = useState(false);
  const [editHospitalId, setEditHospitalId] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const supabase = createBrowserSupabaseClient();

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const { data, error } = await supabase.from("hospitals").select("*");
        if (error) throw error;
        setHospitals(data);
      } catch (err) {
        console.error("Failed to fetch hospitals:", err);
      }
    };
    fetchHospitals();
  }, [supabase, showHospitalForm, editHospitalId]);

  return (
    <RoleProtectedPage allowedRoles={["system_admin", "hospital_admin"]}>
      {({ role }) => (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">
              Hospital Management Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Manage hospitals and doctors efficiently. Use the buttons below to
              add new hospitals, edit existing ones, or assign doctors.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            {role === "system_admin" && (
              <Button
                variant="outline"
                onClick={() => {
                  setEditHospitalId(null); // hide edit
                  setShowHospitalForm((prev) => !prev);
                }}
              >
                {showHospitalForm ? "Hide Add Hospital" : "Add Hospital"}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => setShowDoctorForm((prev) => !prev)}
            >
              {showDoctorForm ? "Hide Add Doctor" : "Add Doctor"}
            </Button>
          </div>

          <div className="space-y-6">
            {showHospitalForm && role === "system_admin" && <AddNewHospital />}
            {showDoctorForm && <HospitalAddDoctor />}

            {/* Hospital list with Edit buttons */}
            {role === "system_admin" && (
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">Existing Hospitals</h2>
                {hospitals.map((h) => (
                  <div
                    key={h.id}
                    className="flex justify-between items-center p-2 border rounded"
                  >
                    <span>{h.name}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setShowHospitalForm(false);
                        setEditHospitalId(h.id);
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {editHospitalId && <EditHospital hospitalId={editHospitalId} />}
          </div>
        </div>
      )}
    </RoleProtectedPage>
  );
}
