import OverviewCards from "@/components/dashboard/components/OverviewCards";
import SeasonalFootfallChart from "@/components/dashboard/components/charts/SeasonalFootfallChart";
import DoctorUtilizationChart from "@/components/dashboard/components/charts/DoctorUtilizationChart";
import DiseaseTrendsChart from "@/components/dashboard/components/charts/DiseaseTrendsChart";
import DemographicsPieChart from "@/components/dashboard/components/charts/DemographicsPieChart";
import { MyDay } from "@/components/dashboard/components/MyDay";
import { RightRail } from "@/components/dashboard/components/RightRail";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-balance">Dashboard</h1>
        <div className="flex items-center gap-2">
          <TabPill active>Overview</TabPill>
          <TabPill>Team</TabPill>
          <TabPill>Projects</TabPill>
          <TabPill>Insights</TabPill>
        </div>
      </header>

      {/* KPIs */}
      <OverviewCards />

      {/* My Day + Right rail */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-base font-medium mb-3">My day</h2>
          <MyDay />
        </div>
        <aside className="lg:col-span-1">
          <RightRail />
        </aside>
      </section>

      {/* Analytics charts (optional, keeps parity with your existing content) */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <h2 className="text-base font-medium mb-3">Seasonal Footfall</h2>
          <SeasonalFootfallChart />
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <h2 className="text-base font-medium mb-3">Doctor Utilization</h2>
          <DoctorUtilizationChart />
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <h2 className="text-base font-medium mb-3">Disease Trends</h2>
          <DiseaseTrendsChart />
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
          <h2 className="text-base font-medium mb-3">Patient Demographics</h2>
          <DemographicsPieChart />
        </div>
      </section>
    </div>
  );
}

function TabPill({ children, active = false }) {
  return (
    <button
      type="button"
      className={
        active
          ? "rounded-full px-3 py-1.5 text-sm border border-emerald-500/20 bg-emerald-500/15 text-emerald-400"
          : "rounded-full px-3 py-1.5 text-sm border border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-zinc-100"
      }
      aria-current={active ? "page" : undefined}
    >
      {children}
    </button>
  );
}
