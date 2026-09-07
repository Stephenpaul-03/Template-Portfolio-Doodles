import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "Steve's Workshop",
    template: "%s | Steve's Workshop",
  },
  description: "The portfolio of Steve - designer, builder, and curious problem solver.",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
