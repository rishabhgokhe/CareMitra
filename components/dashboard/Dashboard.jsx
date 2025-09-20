"use client";

import { useState } from "react";
import AppSidebar from "@/components/dashboard/components/sidebar/Sidebar";
import Topnav from "@/components/dashboard/components/navbar/Topnav";
import Overview from "./components/overview/Overview";
import PatientsTable from "./components/paitents/PatientsTable";
import Reports from "./components/Reports";
import Appointments from "./components/appointment/Appointments";
import Settings from "./components/Settings";

export default function Dashboard() {
  const [active, setActive] = useState("Overview");

  return (
    <div className="flex min-h-screen p-4">
      <AppSidebar onNavigate={setActive} />

      <div className="flex-1 flex flex-col">
        <Topnav />
        <main className="flex-1 p-4 md:p-6">
          {active === "Overview" && <Overview />}
          {active === "Patients" && <PatientsTable />}
          {active === "Appointments" && <Appointments />}
          {active === "Reports" && <Reports />}
          {active === "Settings" && <Settings />}
        </main>
      </div>
    </div>
  );
}
