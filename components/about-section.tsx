"use client"

import { useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { Chapter } from "@/components/scrapbook-ui"
import { Handwritten } from "@/components/handwritten"

import { content } from "@/data/content"

const { about, site } = content
const { principles } = about
export function AboutSection() {
  const [active, setActive] = useState(0)
  return <section id="about" className="scrap-section scrap-container">
    <Chapter {...about.chapter}/>
    <div className="scrap-about-layout">
      <aside className="scrap-id-card"><span className="scrap-tape" aria-hidden="true"/><div className="scrap-avatar" aria-hidden="true">{site.monogram.slice(0, -1)}<span>{site.monogram.slice(-1)}</span></div><p className="scrap-hand">{site.name}</p><span className="scrap-label">{about.profile.role}</span><div className="scrap-id-lines">{about.profile.facts.map(fact => <span key={fact.label}>{fact.label} <b>{fact.value}</b></span>)}</div></aside>
      <div className="scrap-about-copy"><h3>{about.title}<br/>{about.titleSecondLine} <em>{about.titleAccent}</em></h3>{about.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}<div className="scrap-tags">{about.skills.map(skill => <span key={skill}>{skill}</span>)}</div></div>
    </div>
    <div className="scrap-principles"><div><span className="scrap-label">{about.principlesLabel}</span><div className="scrap-principle-buttons">{principles.map((item, index) => <button key={item.title} aria-pressed={active === index} onClick={() => setActive(index)} className={active === index ? "is-active" : ""}><span>0{index + 1}</span>{item.title}<ArrowUpRight size={16}/></button>)}</div></div><div className="scrap-postit scrap-principle-note" aria-live="polite"><Handwritten key={active} className="scrap-hand" text={principles[active].text}/></div></div>
  </section>
}
