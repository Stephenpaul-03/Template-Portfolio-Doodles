import type { Metadata } from "next"
import { content } from "@/data/content"

import { AboutSection } from "@/components/about-section"
import { ExperienceSection } from "@/components/experience-section"
import { HeroSection } from "@/components/hero-section"
import { HobbiesSection } from "@/components/hobbies-section"
import { MarginScribbles } from "@/components/margin-scribbles"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { WorkSection } from "@/components/work-section"
import { ScrapbookMotion } from "@/components/scrapbook-motion"
import { PortfolioScroll } from "@/components/portfolio-scroll"
import "./scrapbook.css"
import "./scrapbook-personality.css"

export const metadata: Metadata = { title: content.site.portfolioTitle, description: content.site.portfolioDescription }

export default function PortfolioPage() {
  return <PortfolioScroll><div id="scrapbook-page" className="scrapbook">
    <a className="scrap-skip" href="#main-content">{content.ui.skipToContent}</a>
    <div id="top"/>
    <SiteHeader/>
    <ScrapbookMotion/>
    <main id="main-content">
      <div className="scrap-margin-section" data-motion-section="hero"><MarginScribbles/><HeroSection/></div>
      <div className="scrap-margin-section" data-motion-section><MarginScribbles variant={1}/><AboutSection/></div>
      <div className="scrap-margin-section" data-motion-section><MarginScribbles variant={2}/><WorkSection/></div>
      <div className="scrap-margin-section" data-motion-section><MarginScribbles variant={3}/><ExperienceSection/></div>
      <HobbiesSection/>
    </main>
    <div className="scrap-margin-section" data-motion-section><MarginScribbles variant={4}/><SiteFooter/></div>
  </div></PortfolioScroll>
}
