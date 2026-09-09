"use client"

import { AnimatePresence } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import Image from "next/image"
import { useCallback, useState } from "react"
import { createPortal } from "react-dom"
import { Chapter } from "@/components/scrapbook-ui"
import { ScrapbookModal } from "@/components/scrapbook-modal"
import { LenisReveal } from "@/components/lenis-reveal"
import { content, withTitle, type Project } from "@/data/content"

const { work } = content
const { projects, labels } = work

export function WorkSection() {
  const [selected, setSelected] = useState<Project | null>(null)
  const [mounted, setMounted] = useState(false)
  const close = useCallback(() => setSelected(null), [])
  return <section id="work" className="scrap-work-section"><div className="scrap-container scrap-section">
    <Chapter {...work.chapter}/>
    <div className="scrap-projects">{projects.map((project, index) => <LenisReveal as="article" variant="paper" index={index} key={project.title} className={`scrap-project scrap-project-${index}`}>
      <button className="scrap-project-trigger" onClick={() => { setMounted(true); setSelected(project) }} aria-label={withTitle(labels.open, project.title)}>
        <div className="scrap-project-image"><Image src={project.thumbnail} alt={withTitle(labels.imageAlt, project.title)} fill sizes="(max-width: 700px) 90vw, 550px"/><span className="scrap-project-sticker">0{index + 1}</span></div>
        <div className="scrap-project-description"><span className="scrap-label">{project.tags.slice(0, 2).join(" / ")}<span>{project.year}</span></span><h3>{project.title}<ArrowUpRight size={22}/></h3><p>{project.description}</p><span className="scrap-project-read">{labels.read} <span>↗</span></span></div>
      </button>
    </LenisReveal>)}</div>
    {mounted && createPortal(<AnimatePresence>{selected && <ScrapbookModal key={selected.title} title={selected.title} onClose={close}><div className="scrap-modal-art"><Image src={selected.thumbnail} alt="" fill sizes="800px"/></div><div className="scrap-modal-copy"><span className="scrap-label">{labels.file} / {selected.year}</span><h2>{selected.title}</h2><p>{selected.overview}</p><dl className="scrap-project-meta"><div><dt>{labels.role}</dt><dd>{selected.role}</dd></div><div><dt>{labels.timeframe}</dt><dd>{selected.timeline}</dd></div></dl><h3>{labels.outcomes}</h3><ul>{selected.outcomes.map(outcome => <li key={outcome}>{outcome}</li>)}</ul><div className="scrap-modal-links">{selected.links.map(link => <a className="scrap-button" key={link.label} href={link.href}>{link.label}<ArrowUpRight size={16}/></a>)}</div></div></ScrapbookModal>}</AnimatePresence>, document.body)}
  </div></section>
}
