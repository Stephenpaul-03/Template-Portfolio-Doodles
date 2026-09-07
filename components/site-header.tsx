import Link from "next/link"

const navigation = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
  { label: "Resume", href: "#resume" },
] as const

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-stone-900/10 bg-[#f8f6f0]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[90rem] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link href="/portfolio" className="text-sm font-semibold tracking-[-0.02em]">
          <span className="sm:hidden">Steve</span>
          <span className="hidden sm:inline">Steve&apos;s Workshop</span>
        </Link>
        <nav aria-label="Primary navigation">
          <ul className="flex items-center gap-3 text-[11px] text-stone-600 sm:gap-7 sm:text-sm">
            {navigation.map((item) => (
              <li key={item.href}>
                <a className="transition-colors hover:text-stone-950" href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
