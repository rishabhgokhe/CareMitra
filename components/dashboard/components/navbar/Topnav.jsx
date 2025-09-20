"use client";

import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Bell, ChevronDown, Hospital } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import ThemeToggle from "@/components/elements/ThemeToggle";
import LogoutButton from "@/components/elements/LogoutButton";
import SearchPatients from "./SearchPatients";
import { Skeleton } from "@/components/ui/skeleton";

export default function Topnav() {
  const [user, setUser] = useState(null);
  const [hospitalName, setHospitalName] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
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

      const { data: userData } = await supabase
        .from("users")
        .select("name, avatar_url, role")
        .eq("id", authUser.id)
        .maybeSingle();

      const currentUser = {
        id: authUser.id,
        name: userData?.name ?? authUser.email ?? "Unknown User",
        avatar: userData?.avatar_url ?? "",
        role: userData?.role ?? "user",
      };

      setUser(currentUser);

      if (currentUser.role === "doctor") {
        const { data: doctorData } = await supabase
          .from("doctors")
          .select("hospital_id")
          .eq("id", currentUser.id)
          .maybeSingle();

        if (doctorData?.hospital_id) {
          const { data: hospData } = await supabase
            .from("hospitals")
            .select("name")
            .eq("id", doctorData.hospital_id)
            .maybeSingle();

          setHospitalName(hospData?.name ?? null);
        }
      }

      setLoading(false);
    };

    getUser();
  }, [supabase, router]);

  const isAdmin =
    user?.role === "system_admin" || user?.role === "hospital_admin";
  const isDoc = user?.role === "doctor";

  return (
    <header className="backdrop-blur-sm sticky top-0 z-50 pb-2">
      <div className="h-full mx-auto px-4 md:px-6 flex items-center justify-between gap-3">
        <SearchPatients />

        <div className="flex items-center gap-3 relative">
          {/* Hospital name skeleton */}
          {isDoc && (
            <div className="flex items-center pr-4 border-r border-zinc-300 dark:border-zinc-600">
              {loading ? (
                <Skeleton className="h-5 w-36 rounded-md" />
              ) : hospitalName ? (
                <span className="flex items-center gap-2 text-sm font-medium text-zinc-800 dark:text-zinc-100">
                  <Hospital className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                  {hospitalName}
                </span>
              ) : (
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  No hospital
                </span>
              )}
            </div>
          )}

          {/* Theme toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <div className="relative">
            <Button
              variant="outline"
              aria-label="Notifications"
              className="relative rounded-xl"
              onClick={() => setShowNotifications((prev) => !prev)}
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

          {/* Admin button */}
          {isAdmin && (
            <Link href="/admin">
              <Button
                variant="outline"
                className="gap-2 rounded-xl text-red-600 dark:text-red-400 cursor-pointer hover:bg-red-50 dark:hover:bg-red-900/50"
              >
                Admin
              </Button>
            </Link>
          )}

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
                {/* Skeleton avatar while loading */}
                {loading || !user?.avatar ? (
                  <Skeleton className="h-8 w-8 rounded-full" />
                ) : (
                  <Image
                    src={user.avatar}
                    alt="User Profile"
                    width={32}
                    height={32}
                    className="rounded-full border border-zinc-300 dark:border-zinc-600"
                  />
                )}

                <div className="hidden sm:flex flex-col leading-tight">
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">
                    Welcome back,
                  </span>
                  {loading ? (
                    <Skeleton className="h-4 w-24 rounded-md" />
                  ) : (
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {isDoc && "Dr."} {isAdmin && "Ad."} {user?.name}
                    </span>
                  )}
                </div>
                <ChevronDown className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem asChild>
                <Link href="/profile">Edit Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogoutButton />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
