import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "../../lib/supabase/server";
import Dashboard from "../../components/dashboard/Dashboard";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  return <Dashboard />;
}
