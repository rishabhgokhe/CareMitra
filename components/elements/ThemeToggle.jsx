"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";

import { ToolTipIcon } from "./ToolTipIcon";
import { Button } from "./../ui/button";
import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [icon, setIcon] = useState(<Sun />);

  useEffect(() => {
    if (theme === "dark") {
      setIcon(<Moon />);
    } else {
      setIcon(<Sun />);
    }
  }, [theme]);

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
      setIcon(<Sun />);
      toast.success("Switched to Light Mode!", {
        icon: "☀️",
        style: {
          borderRadius: "15px",
          background: "#333",
          color: "#fff",
        },
      });
    } else {
      setTheme("dark");
      setIcon(<Moon />);
      toast.success("Switched to Dark Mode!", {
        icon: "🌙",
        style: {
          borderRadius: "15px",
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  return (
    <ToolTipIcon
      name={`Switch to ${theme === "light" ? "dark" : "light"} Mode`}
      triggerJsxElement={
        <Button
          variant="outline"
          size="icon"
          className="rounded-xl h-8 w-8"
          onClick={toggleTheme}
        >
          {icon}
        </Button>
      }
    />
  );
};

export default ThemeToggle;
