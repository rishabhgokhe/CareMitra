import HomePage from "../components/home/HomePage";
import { createBrowserSupabaseClient } from "../lib/supabase/client";

export default async function Home() {
  const supabase = createBrowserSupabaseClient();

  const { data: todos, error } = await supabase.from("todos").select("*");

  if (error) {
    console.error("Supabase error:", error.message);
    return <p>❌ Failed to load todos</p>;
  }

  return <HomePage />;
}

// Just checking Supabase Connection
