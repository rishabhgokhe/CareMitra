import AppSidebar from "@/components/dashboard/components/sidebar/Sidebar";
import Topnav from "@/components/dashboard/components/Topnav";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen p-4">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <Topnav />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
