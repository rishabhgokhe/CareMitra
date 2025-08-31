"use client";

import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Plus, ChevronDown } from "lucide-react";
import Image from "next/image";

export default function Topnav() {
  const doctorName = "Dr. John Doe";

  return (
    <header className="dark:bg-[#101010]/60 backdrop-blur-sm sticky top-0 z-50">
      <div className="h-full mx-auto px-4 md:px-6 flex items-center justify-between gap-3">
        {/* Search */}
        <form
          className="flex-1 max-w-md"
          role="search"
          aria-label="Search patients, appointments, reports"
        >
          <label htmlFor="topnav-search" className="sr-only">
            Search
          </label>
          <Input
            id="topnav-search"
            type="search"
            placeholder="Search patients, appointments, reports..."
            className="w-full  rounded-xl"
          />
        </form>

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

          {/* Profile Section */}
          <div className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-gray-100 dark:hover:bg-[#1a1a1a] transition-colors cursor-pointer">
            <Image
              src="/images/profile.png"
              alt="Doctor Profile"
              width={32}
              height={32}
              className="rounded-full border border-[#2D2D2D]"
            />
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-xs">Welcome back,</span>
              <span className="text-sm font-medium">{doctorName}</span>
            </div>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </div>
    </header>
  );
}
