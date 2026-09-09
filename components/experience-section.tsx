"use client"

import { ArrowUpRight } from "lucide-react"
import { Chapter } from "@/components/scrapbook-ui"
import { content } from "@/data/content"

const { journey } = content
const { experience, education } = journey

export function ExperienceSection() {
  return <section id="experience" className="scrap-section scrap-container">
    <Chapter {...journey.chapter}/>
    <div className="scrap-career">
      <div className="scrap-career-entries">{experience.map(current => <article key={`${current.company}-${current.period}`} className="scrap-career-page"><span className="scrap-label">{journey.experienceLabel}</span><div className="scrap-career-heading"><span><span className="scrap-career-period">{current.period}</span><h3>{current.role}</h3><span>{current.company}</span></span></div>
        <div className="scrap-career-details"><p>{current.summary}</p><ul>{current.highlights.map(item => <li key={item}>{item}</li>)}</ul></div>
      </article>)}</div>
      <aside className="scrap-education"><span className="scrap-label">{education.label}</span><h3>{education.title}</h3><p>{education.note}</p><div className="scrap-education-rule"/><p>{education.signoff[0]}<br/>{education.signoff[1]}</p><div className="scrap-tags">{education.focus.map(item => <span key={item}>{item}</span>)}</div></aside>
    </div>
    <a href={journey.future.href} className="scrap-future"><span className="scrap-label">{journey.future.label}</span><span className="scrap-future-title">{journey.future.title} <em>{journey.future.accent}</em></span><span className="scrap-future-arrow"><ArrowUpRight aria-hidden="true"/></span></a>
  </section>
}
