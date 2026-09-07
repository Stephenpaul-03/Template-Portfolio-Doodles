import type { Metadata } from "next"
import { AboutSection } from "@/components/about-section"
import { ExperienceSection } from "@/components/experience-section"
import { HeroSection } from "@/components/hero-section"
import { HobbiesSection } from "@/components/hobbies-section"
import { MarginScribbles } from "@/components/margin-scribbles"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { WorkSection } from "@/components/work-section"
import "./scrapbook.css"

export const metadata: Metadata = { title: "Portfolio", description: "A collection of work, observations, and things that matter to Steve." }

export default function PortfolioPage() {
  return <div id="scrapbook-page" className="scrapbook">
    <a className="scrap-skip" href="#main-content">Skip to content</a>
    <div id="top"/>
    <SiteHeader/>
    <main id="main-content">
      <div className="scrap-margin-section"><MarginScribbles/><HeroSection/></div>
      <div className="scrap-margin-section"><MarginScribbles variant={1}/><AboutSection/></div>
      <div className="scrap-margin-section"><MarginScribbles variant={2}/><WorkSection/></div>
      <div className="scrap-margin-section"><MarginScribbles variant={3}/><ExperienceSection/></div>
      <HobbiesSection/>
    </main>
    <div className="scrap-margin-section"><MarginScribbles variant={4}/><SiteFooter/></div>
  </div>
}
