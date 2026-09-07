import type { Metadata } from "next"

import { AboutSection } from "@/components/about-section"
import { ContactSection } from "@/components/contact-section"
import { SiteHeader } from "@/components/site-header"
import { WorkSection } from "@/components/work-section"

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Selected work, background, and contact information for Steve.",
}

export default function PortfolioPage() {
  return (
    <main id="top" className="bg-[#f8f6f0]">
      <SiteHeader />
      <section className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-[90rem] flex-col justify-between px-5 pb-10 pt-16 sm:px-8 sm:pb-14 sm:pt-24 lg:px-12">
        <div className="grid gap-8 md:grid-cols-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500 md:col-span-3">Designer + builder</p>
          <h1 className="max-w-5xl text-[clamp(3.2rem,8vw,7.8rem)] font-medium leading-[0.88] tracking-[-0.065em] text-stone-950 md:col-span-9">
            I make complex things feel clear.
          </h1>
        </div>
        <div className="mt-20 grid gap-5 border-t border-stone-900/20 pt-5 text-sm leading-6 text-stone-600 md:grid-cols-12">
          <p className="md:col-span-3">Based in India · Working worldwide</p>
          <p className="max-w-lg md:col-span-5">Product design, visual systems, and front-end craft for teams building things people rely on.</p>
          <a href="#work" className="w-fit text-stone-950 underline decoration-stone-400 underline-offset-4 md:col-span-4 md:justify-self-end">See selected work ↓</a>
        </div>
      </section>
      <WorkSection />
      <AboutSection />
      <ContactSection />
      <footer className="border-t border-stone-900/10 bg-[#f8f6f0] px-5 py-6 text-xs text-stone-500 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[90rem] justify-between gap-4">
          <span>© {new Date().getFullYear()} Steve</span>
          <a href="#top" className="hover:text-stone-950">Back to top ↑</a>
        </div>
      </footer>
    </main>
  )
}
