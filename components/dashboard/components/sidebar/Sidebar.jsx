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
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import Separator from "@/components/elements/separator";
import InfoCard from "./InfoCard";
import LogoutButton from "@/components/LogoutButton";

const navItems = [
  { label: "Patients", icon: Users, href: "/dashboard/patients" },
  { label: "Appointments", icon: Calendar, href: "/dashboard/appointments" },
  { label: "Reports", icon: FileText, href: "/dashboard/reports" },
  { label: "Analytics", icon: BarChart3, href: "/dashboard/analytics" },
  { label: "Settings", icon: Settings, href: "/dashboard/settings" },
];

export default function AppSidebar() {
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
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-3">
          <Image src="/svgs/Logo.svg" alt="Logo" width={32} height={32} />
          <span
            className={`font-bold text-lg text-brand transition-all duration-300
              ${expanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
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
          {navItems.map(({ label, icon: Icon, href }) => {
            const isActive = pathname === href;
            return (
              <Link key={label} href={href} passHref>
                <Button
                  variant="ghost"
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg justify-start
                    transition-colors duration-200
                    ${isActive
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/80 hover:bg-muted hover:text-foreground"}`}
                >
                  <Icon
                    className={`w-5 h-5 transition-colors duration-200
                      ${isActive ? "text-primary" : "text-foreground/50 group-hover:text-foreground"}`}
                  />
                  <span
                    className={`whitespace-nowrap transition-all duration-300
                      ${expanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
                  >
                    {label}
                  </span>
                </Button>
              </Link>
            );
          })}
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