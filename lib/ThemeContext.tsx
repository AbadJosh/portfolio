"use client";

import { createContext, useContext, useState, useEffect } from "react";

interface ThemeCtxValue { isDark: boolean; toggle: () => void; }
const ThemeCtx = createContext<ThemeCtxValue>({ isDark: false, toggle: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      setIsDark(true);
    }
  }, []);

  const toggle = () => {
    const next = !isDark;
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    localStorage.setItem("theme", next ? "dark" : "light");
    setIsDark(next);
  };

  return <ThemeCtx.Provider value={{ isDark, toggle }}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => useContext(ThemeCtx);
