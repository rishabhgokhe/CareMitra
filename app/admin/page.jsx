"use client";

import React, { useState } from "react";
import RoleProtectedPage from "@/components/admin/RoleProtectedPage";
import HospitalAddDoctor from "@/components/admin/hospital/HospitalAddDoctor";
import AddNewHospital from "@/components/admin/system/AddNewHospital";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const [showHospitalForm, setShowHospitalForm] = useState(false);
  const [showDoctorForm, setShowDoctorForm] = useState(false);

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
              add new hospitals or assign doctors to existing hospitals.
            </p>
          </div>

          {/* Buttons to toggle forms */}
          <div className="flex flex-wrap gap-4 justify-center">
            {role === "system_admin" && (
              <Button
                variant="outline"
                onClick={() => setShowHospitalForm((prev) => !prev)}
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
          </div>
        </div>
      )}
    </RoleProtectedPage>
  );
}
