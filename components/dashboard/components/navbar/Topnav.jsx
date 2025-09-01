"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Bell, Plus, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SearchPatients from "./SearchPatients";

export default function Topnav() {
  const [name, setName] = useState(null);
  const [avatar, setAvatar] = useState("/images/profile.png");
  const supabase = createBrowserSupabaseClient();
  const router = useRouter();

  // ✅ Get current user
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
      } else {
        setName(user.user_metadata?.displayName || user.email);
        setAvatar(user.user_metadata?.avatar_url || "/images/profile.png");
      }
    };

    getUser();
  }, [supabase, router]);

  return (
    <header className="backdrop-blur-sm sticky top-0 z-50 pb-2">
      <div className="h-full mx-auto px-4 md:px-6 flex items-center justify-between gap-3">
        {/* 🔍 Search Patients */}
        <SearchPatients />

        {/* 🔧 Right Side */}
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 rounded-xl">
            <Plus className="h-4 w-4" />
            New
          </Button>

          <ThemeToggle />

          <Button
            variant="outline"
            aria-label="Notifications"
            className="relative rounded-xl"
          >
            <Bell className="h-5 w-5" />
            <span
              className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-amber-500"
              aria-hidden
            />
          </Button>

          {/* Profile */}
          <div className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-accent transition-colors cursor-pointer">
            <Image
              src={avatar}
              alt="User Profile"
              width={32}
              height={32}
              className="rounded-full border"
            />
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-xs">Welcome back,</span>
              <span className="text-sm font-medium">
                {name ?? "Loading..."}
              </span>
            </div>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>
    </header>
  );
}