"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import ThemeToggle from "@/components/elements/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Bell, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SearchPatients from "./SearchPatients";
import Link from "next/link";

export default function Topnav() {
  const [name, setName] = useState(null);
  const [avatar, setAvatar] = useState("/images/profile.png");
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const supabase = createBrowserSupabaseClient();
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);

      const {
        data: { user: authUser },
        error: authErr,
      } = await supabase.auth.getUser();

      if (authErr || !authUser) {
        router.push("/login");
        return;
      }

      const { data: userData, error: userErr } = await supabase
        .from("users")
        .select("name, avatar_url, role")
        .eq("id", authUser.id)
        .maybeSingle();

      if (userErr || !userData) {
        setName(authUser.email || "Unknown User");
        setAvatar("/images/profile.png");
      } else {
        setName(userData.name || authUser.email || "Unknown User");
        setAvatar(userData.avatar_url || "/images/profile.png");
        {
          userData.role == "system_admin" || userData.role == "hospital_admin"
            ? setIsAdmin(true)
            : setIsAdmin(false);
        }
      }

      setLoading(false);
    };

    getUser();
  }, [supabase, router]);

  return (
    <header className="backdrop-blur-sm sticky top-0 z-50 pb-2">
      <div className="h-full mx-auto px-4 md:px-6 flex items-center justify-between gap-3">
        <SearchPatients />

        <div className="flex items-center gap-3 relative">
          <ThemeToggle />

          <div className="relative">
            <Button
              variant="outline"
              aria-label="Notifications"
              className="relative rounded-xl"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-amber-500" />
            </Button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-lg overflow-hidden z-50">
                <p className="text-sm text-zinc-500 dark:text-zinc-400 p-3 text-center">
                  No notifications
                </p>
              </div>
            )}
          </div>

          {isAdmin && <Link href={"/admin"}>
            <Button
              variant="outline"
              className="gap-2 rounded-xl text-red-600 dark:text-red-400 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/50"
            >
              Admin
            </Button>
          </Link>}

          <div className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
            <Image
              src={avatar}
              alt="User Profile"
              width={32}
              height={32}
              className="rounded-full border border-zinc-300 dark:border-zinc-600"
            />
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                Welcome back,
              </span>
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {name ?? "Loading..."}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
          </div>
        </div>
      </div>
    </header>
  );
}
