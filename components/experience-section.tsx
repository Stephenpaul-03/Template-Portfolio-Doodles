"use client"

import { ArrowUpRight } from "lucide-react"
import { Chapter } from "@/components/scrapbook-ui"
import { experience, education } from "@/data/experience"

export function ExperienceSection() {
  const current = experience[0]
  return <section id="experience" className="scrap-section scrap-container">
    <Chapter number="03" label="The journey" title="Still writing this part." aside="A work in progress, in the best way."/>
    <div className="scrap-career">
      <article className="scrap-career-page"><span className="scrap-label">Experience / Chapter one</span><div className="scrap-career-heading"><span><span className="scrap-career-period">{current.period}</span><h3>{current.role}</h3><span>{current.company}</span></span></div>
        <div id="career-details" className="scrap-career-details"><p>{current.summary}</p><ul>{current.highlights.map(item => <li key={item}>{item}</li>)}</ul></div>
      </article>
      <aside className="scrap-education"><span className="scrap-label">The foundations</span><h3>Always a student.</h3><p>{education.note}</p><div className="scrap-education-rule"/><p>Learning by asking questions,<br/>and by making things.</p><div className="scrap-tags">{education.focus.map(item => <span key={item}>{item}</span>)}</div></aside>
    </div>
    <a href="#contact" className="scrap-future"><span className="scrap-label">The next chapter</span><span className="scrap-future-title">A future <em>awaits.</em></span><span className="scrap-future-arrow"><ArrowUpRight aria-hidden="true"/></span></a>
  </section>
}
