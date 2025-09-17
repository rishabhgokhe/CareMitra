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
  PanelRightClose,
  PanelRightOpen,
  LayoutDashboard,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import InfoCard from "./InfoCard";
import LogoutButton from "@/components/elements/LogoutButton";
import Separator from "../../../elements/Separator"

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
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <aside
      className={`fixed md:sticky top-0 md:top-4 left-0 z-40
        h-full md:h-[calc(100vh-2rem)]
        bg-background/90 backdrop-blur-lg border border-border
        rounded-none md:rounded-2xl shadow-lg
        flex flex-col overflow-hidden transition-all duration-500 ease-in-out
        ${expanded ? "w-64" : "w-20"}
      `}
      onMouseEnter={() => !pinned && setExpanded(true)}
      onMouseLeave={() => !pinned && setExpanded(false)}
    >
      {/* Logo + Pin */}
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3 overflow-hidden">
          <Image src="/svgs/Logo.svg" alt="Logo" width={32} height={32} />
          <span
            className={`font-bold text-lg text-brand transition-all duration-500 ease-in-out
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
          className="h-8 w-8 rounded-full shrink-0"
          onClick={() => setPinned(!pinned)}
        >
          {pinned ? <PanelRightOpen /> : <PanelRightClose />}
        </Button>
      </div>

      <Separator />

      {/* Navigation */}
      <ScrollArea className="flex-1 px-2 py-4">
        <div className="space-y-1">
          {navItems.map(({ label, icon: Icon }) => {
            const isActive = activeTab === label;

            return (
              <Button
                key={label}
                variant={isActive ? "secondary" : "ghost"}
                className={`group relative w-full flex items-center gap-3 px-3 py-2 rounded-lg justify-start
                  transition-all duration-300 ease-in-out ${
                    isActive
                      ? "bg-muted text-foreground shadow-sm"
                      : "hover:bg-accent hover:text-accent-foreground"
                  }`}
                onClick={() => {
                  setActiveTab(label);
                  onNavigate(label);
                }}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span
                  className={`whitespace-nowrap transition-all duration-500 ease-in-out ${
                    expanded
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-4"
                  }`}
                >
                  {label}
                </span>

                {/* Tooltip on collapse */}
                {!expanded && (
                  <span className="absolute left-full ml-2 rounded-md bg-popover px-2 py-1 text-xs text-popover-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md">
                    {label}
                  </span>
                )}
              </Button>
            );
          })}
        </div>
      </ScrollArea>

      <Separator />

      {/* Info Card - only visible when expanded */}
      <div className="transition-all duration-500 ease-in-out">
        {expanded && <InfoCard expanded={expanded} />}
      </div>

      {/* Footer */}
      <div className="p-4">
        <LogoutButton expanded={expanded} />
      </div>
    </aside>
  );
}
