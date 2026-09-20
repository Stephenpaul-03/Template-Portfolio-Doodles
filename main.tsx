import { createRoot } from "react-dom/client"
import { ThemeProvider } from "@/components/theme-provider"
import { PortfolioScroll } from "@/components/portfolio-scroll"
import { ScrapbookMotion } from "@/components/scrapbook-motion"
import { MarginScribbles } from "@/components/margin-scribbles"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { WorkSection } from "@/components/work-section"
import { ExperienceSection } from "@/components/experience-section"
import { HobbiesSection } from "@/components/hobbies-section"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { content } from "@/data/content"
import "@/app/globals.css"
import "@/app/portfolio/scrapbook.css"
import "@/app/portfolio/scrapbook-personality.css"
import "lenis/dist/lenis.css"

function Portfolio() {
  return <PortfolioScroll><div id="scrapbook-page" className="scrapbook">
    <a className="scrap-skip" href="#main-content">{content.ui.skipToContent}</a>
    <div id="top" />
    <SiteHeader />
    <ScrapbookMotion />
    <main id="main-content">
      <div className="scrap-margin-section" data-motion-section="hero"><MarginScribbles /><HeroSection /></div>
      <div className="scrap-margin-section" data-motion-section><MarginScribbles variant={1} /><AboutSection /></div>
      <div className="scrap-margin-section" data-motion-section><MarginScribbles variant={2} /><WorkSection /></div>
      <div className="scrap-margin-section" data-motion-section><MarginScribbles variant={3} /><ExperienceSection /></div>
      <HobbiesSection />
    </main>
    <div className="scrap-margin-section" data-motion-section><MarginScribbles variant={4} /><SiteFooter /></div>
  </div></PortfolioScroll>
}

createRoot(document.getElementById("root")!).render(<ThemeProvider><Portfolio /></ThemeProvider>)
