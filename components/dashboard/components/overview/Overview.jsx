"use client";

import OverviewCards from "@/components/dashboard/components/overview/OverviewCards";
import SeasonalFootfallChart from "@/components/dashboard/components/charts/SeasonalFootfallChart";
import DoctorUtilizationChart from "@/components/dashboard/components/charts/DoctorUtilizationChart";
import DiseaseTrendsChart from "@/components/dashboard/components/charts/DiseaseTrendsChart";
import DemographicsPieChart from "@/components/dashboard/components/charts/DemographicsPieChart";
import { MyDay } from "@/components/dashboard/components/overview/MyDay";
import { RightRail } from "@/components/dashboard/components/overview/RightRail";

export default function Overview() {
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Overview
        </h1>
        <nav className="flex items-center gap-2">
          <TabPill active>Overview</TabPill>
          <TabPill>Team</TabPill>
          <TabPill>Projects</TabPill>
          <TabPill>Insights</TabPill>
        </nav>
      </header>

      {/* KPI Cards */}
      <OverviewCards />

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <SectionTitle>My Day</SectionTitle>
          <MyDay />
        </div>
        <aside className="lg:col-span-1">
          <RightRail />
        </aside>
      </section>

      {/* Analytics Charts */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard title="Seasonal Footfall">
          <SeasonalFootfallChart />
        </DashboardCard>
        <DashboardCard title="Doctor Utilization">
          <DoctorUtilizationChart />
        </DashboardCard>
        <DashboardCard title="Disease Trends">
          <DiseaseTrendsChart />
        </DashboardCard>
        <DashboardCard title="Patient Demographics">
          <DemographicsPieChart />
        </DashboardCard>
      </section>
    </div>
  );
}

/* 🔹 Reusable Section Title */
function SectionTitle({ children }) {
  return (
    <h2 className="text-base font-medium text-muted-foreground">{children}</h2>
  );
}

/* 🔹 Standardized Chart/Analytics Card */
function DashboardCard({ title, children }) {
  return (
    <div className="rounded-2xl border border-border/50 bg-card/80 backdrop-blur shadow-sm p-4 space-y-3">
      <SectionTitle>{title}</SectionTitle>
      {children}
    </div>
  );
}

/* 🔹 Accessible, polished TabPill */
function TabPill({ children, active = false }) {
  return (
    <button
      type="button"
      className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2
        ${
          active
            ? "border border-emerald-500/20 bg-emerald-500/15 text-emerald-400"
            : "border border-border/50 text-muted-foreground hover:bg-muted/40"
        }`}
      aria-current={active ? "page" : undefined}
    >
      {children}
    </button>
  );
}
