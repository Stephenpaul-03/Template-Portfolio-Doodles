"use client"

import { createContext, useContext, useEffect, useMemo, useState } from "react"

type Theme = "light" | "dark"

type ThemeContextValue = {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light")

  useEffect(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light")
  }, [])

  const value = useMemo(
    () => ({
      theme,
      toggleTheme: () => {
        const nextTheme = theme === "light" ? "dark" : "light"
        document.documentElement.classList.toggle("dark", nextTheme === "dark")
        document.documentElement.style.colorScheme = nextTheme
        setTheme(nextTheme)
        try { localStorage.setItem("steves-workshop-theme", nextTheme) } catch { /* Theme remains usable when storage is unavailable. */ }
      },
    }),
    [theme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) throw new Error("useTheme must be used within ThemeProvider")
  return context
}
