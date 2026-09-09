import type { Metadata } from "next"
import { content } from "@/data/content"
import { motionBootstrap, motionPrepaintStyles } from "@/lib/scrapbook-motion-config"


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
    default: content.site.brand,
    template: `%s | ${content.site.brand}`,
  },
  description: content.site.description,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={content.site.language} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <style dangerouslySetInnerHTML={{ __html: motionPrepaintStyles }} />
        <script dangerouslySetInnerHTML={{ __html: motionBootstrap }} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
