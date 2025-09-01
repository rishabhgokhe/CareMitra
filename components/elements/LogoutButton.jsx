"use client";

import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function LogoutButton({ expanded = true }) {
  const supabase = createBrowserSupabaseClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  return (
    <Button
      variant="outline"
      onClick={handleLogout}
      className="w-full flex items-center justify-center gap-2 rounded-lg text-destructive hover:bg-destructive/10 transition-all duration-300"
    >
      <LogOut className="w-5 h-5" />
      <span
        className={`whitespace-nowrap transition-all duration-300 ${
          expanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
        }`}
      >
        Logout
      </span>
    </Button>
  );
}