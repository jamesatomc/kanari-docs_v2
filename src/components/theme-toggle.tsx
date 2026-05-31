"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

function getInitialTheme() {
  if (typeof window === "undefined") return false;

  const stored = window.localStorage.getItem("theme");
  if (stored === "dark") return true;
  if (stored === "light") return false;

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(getInitialTheme);

  useEffect(() => {
    setDarkMode(
      document.documentElement.classList.contains("dark") || getInitialTheme(),
    );
  }, []);

  const toggleTheme = () => {
    const nextDarkMode = !darkMode;

    document.documentElement.classList.toggle("dark", nextDarkMode);
    window.localStorage.setItem("theme", nextDarkMode ? "dark" : "light");
    setDarkMode(nextDarkMode);
  };

  return (
    <button
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      className="theme-toggle"
      onClick={toggleTheme}
      type="button"
    >
      <Sun className="sun-icon" size={19} />
      <Moon className="moon-icon" size={19} />
    </button>
  );
}
