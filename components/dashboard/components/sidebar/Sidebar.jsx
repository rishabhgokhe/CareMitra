"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Users,
  Calendar,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  PanelRightClose,
  PanelRightOpen,
  LayoutDashboard,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Separator from "@/components/elements/separator";
import InfoCard from "./InfoCard";
import LogoutButton from "@/components/LogoutButton";

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Patients", icon: Users },
  { label: "Appointments", icon: Calendar },
  { label: "Reports", icon: FileText },
  { label: "Analytics", icon: BarChart3 },
  { label: "Settings", icon: Settings },
];

export default function AppSidebar({ onNavigate }) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(true);
  const [pinned, setPinned] = useState(true);

  return (
    <aside
      className={`sticky top-4 h-[calc(100vh-2rem)] bg-background/90 backdrop-blur-lg border border-border
        rounded-2xl shadow-md flex flex-col overflow-hidden transition-all duration-300
        ${expanded ? "w-64" : "w-20"}`}
      onMouseEnter={() => !pinned && setExpanded(true)}
      onMouseLeave={() => !pinned && setExpanded(false)}
    >
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <Image src="/svgs/Logo.svg" alt="Logo" width={32} height={32} />
          <span
            className={`font-bold text-lg text-brand transition-all duration-300
              ${
                expanded
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-4"
              }`}
          >
            CareMitra
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={() => setPinned(!pinned)}
        >
          {pinned ? <PanelRightOpen /> : <PanelRightClose />}
        </Button>
      </div>

      <Separator />

      {/* Navigation */}
      <ScrollArea className="flex-1 px-2 py-4">
        <div className="space-y-1">
          {navItems.map(({ label, icon: Icon }) => (
            <Button
              key={label}
              variant="ghost"
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg justify-start
      transition-colors duration-200`}
              onClick={() => onNavigate(label)}
            >
              <Icon className="w-5 h-5" />
              <span
                className={`whitespace-nowrap transition-all duration-300 ${
                  expanded
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-4"
                }`}
              >
                {label}
              </span>
            </Button>
          ))}
        </div>
      </ScrollArea>

      <Separator />

      {/* Info Card */}
      {expanded && <InfoCard expanded={expanded} />}

      {/* Footer */}
      <div className="p-4">
        <LogoutButton expanded={expanded} />
      </div>
    </aside>
  );
}
