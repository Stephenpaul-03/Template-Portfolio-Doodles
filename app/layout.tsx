import type { Metadata } from "next"

import { ThemeProvider } from "@/components/theme-provider"

import "./globals.css"

const themeScript = `
  (() => {
    const saved = localStorage.getItem("steves-workshop-theme");
    const dark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
  })();
`

export const metadata: Metadata = {
  title: {
    default: "Steve's Workshop",
    template: "%s | Steve's Workshop",
  },
  description: "The portfolio of Steve - designer, builder, and curious problem solver.",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
