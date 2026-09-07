"use client"

import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import Image from "next/image"
import { useCallback, useState } from "react"
import { createPortal } from "react-dom"
import { Chapter } from "@/components/scrapbook-ui"
import { ScrapbookModal } from "@/components/scrapbook-modal"
import { projects, type Project } from "@/data/projects"

export function WorkSection() {
  const [selected, setSelected] = useState<Project | null>(null)
  const [mounted, setMounted] = useState(false)
  const reduced = useReducedMotion()
  const close = useCallback(() => setSelected(null), [])
  return <section id="work" className="scrap-work-section"><div className="scrap-container scrap-section">
    <Chapter number="02" label="The work" title="A few things I’ve made." aside="From the working pile."/>
    <div className="scrap-projects">{projects.map((project, index) => <motion.article key={project.title} className={`scrap-project scrap-project-${index}`} whileHover={reduced ? undefined : { y: -5 }} transition={{ duration: 0.25 }}>
      <button className="scrap-project-trigger" onClick={() => { setMounted(true); setSelected(project) }} aria-label={`View ${project.title} case study`}>
        <div className="scrap-project-image"><Image src={project.thumbnail} alt={`${project.title} concept artwork`} fill sizes="(max-width: 700px) 90vw, 550px"/><span className="scrap-project-sticker">0{index + 1}</span></div>
        <div className="scrap-project-description"><span className="scrap-label">{project.tags.slice(0, 2).join(" / ")}<span>{project.year}</span></span><h3>{project.title}<ArrowUpRight size={22}/></h3><p>{project.description}</p><span className="scrap-project-read">Inside the project <span>↗</span></span></div>
      </button>
    </motion.article>)}</div>
    {mounted && createPortal(<AnimatePresence>{selected && <ScrapbookModal key={selected.title} title={selected.title} onClose={close}><div className="scrap-modal-art"><Image src={selected.thumbnail} alt="" fill sizes="800px"/></div><div className="scrap-modal-copy"><span className="scrap-label">Project file / {selected.year}</span><h2>{selected.title}</h2><p>{selected.overview}</p><dl className="scrap-project-meta"><div><dt>My role</dt><dd>{selected.role}</dd></div><div><dt>Timeframe</dt><dd>{selected.timeline}</dd></div></dl><h3>What came out of it</h3><ul>{selected.outcomes.map(outcome => <li key={outcome}>{outcome}</li>)}</ul><div className="scrap-modal-links">{selected.links.map(link => <a className="scrap-button" key={link.label} href={link.href}>{link.label}<ArrowUpRight size={16}/></a>)}</div></div></ScrapbookModal>}</AnimatePresence>, document.body)}
  </div></section>
}
