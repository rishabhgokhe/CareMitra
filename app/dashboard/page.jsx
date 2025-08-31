import LogoutButton from "../../components/LogoutButton";
import { createServerSupabaseClient } from "../../lib/supabase/server";
import Dashboard from "../../components/dashboard/Dashboard";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  // You can redirect if not logged in
  // if (error || !user) {
  //   redirect("/login");  // use next/navigation
  // }

  return <Dashboard />;
}