"use client";

import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="icon-btn"
      aria-label={
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      }
    >
      {theme === "dark" ? (
        <Sun className="h-3.5 w-3.5" strokeWidth={1.5} />
      ) : (
        <Moon className="h-3.5 w-3.5" strokeWidth={1.5} />
      )}
    </button>
  );
}
