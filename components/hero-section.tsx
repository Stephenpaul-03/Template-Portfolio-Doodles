"use client"

import { motion, useReducedMotion } from "framer-motion"
import { ArrowDownRight, ArrowUpRight, Asterisk } from "lucide-react"
import { Image } from "@/components/image"
import { useState } from "react"
import { Handwritten } from "@/components/handwritten"

import { content } from "@/data/content"

const { hero } = content
const { notes } = hero
export function HeroSection() {
  const [note, setNote] = useState(0)
  const reduced = useReducedMotion()
  return <section className="scrap-hero scrap-container" aria-labelledby="hero-title">
    <div className="scrap-hero-copy">
      <span className="scrap-label" data-reveal data-motion-phase={0}><span className="scrap-dot"/>{hero.eyebrow}</span>
      <h1 id="hero-title"><Handwritten text={hero.greeting} phase={0.1}/><br/><Handwritten text={hero.title} variant="words" phase={0.2}/><br/><span className="scrap-underlined"><Handwritten text={hero.titleAccent} variant="words" phase={0.3}/><svg className="scrap-underline" data-underline data-motion-phase={0.35} viewBox="0 0 300 14" preserveAspectRatio="none" fill="none" aria-hidden="true" focusable="false"><path pathLength={1} d="M2 8 Q120 14 298 3" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg></span></h1>
      <p className="scrap-intro" data-reveal data-motion-phase={0.4}>{hero.intro}</p>
      <div className="scrap-hero-links" data-reveal data-motion-phase={0.5}><a href={hero.workLink.href} className="scrap-button">{hero.workLink.label} <ArrowUpRight size={17}/></a><a href={hero.aboutLink.href} className="scrap-text-link">{hero.aboutLink.label} <ArrowDownRight size={16}/></a></div>
      <div className="scrap-hero-foot"><Handwritten className="scrap-hand" text={hero.signoff}/><span className="scrap-label" data-reveal data-motion-phase={0.6}>{hero.location}</span></div>
    </div>
    <div className="scrap-hero-collage">
      <div className="scrap-hero-graph" aria-hidden="true"><span>{hero.graphLabel}</span><div className="scrap-pencil-loop"/></div>
      <motion.figure className="scrap-hero-photo" whileHover={reduced ? undefined : { rotate: 0, y: -4 }} transition={{ duration: 0.3 }}>
        <span className="scrap-tape" aria-hidden="true"/>
        <div className="scrap-photo-image"><Image src={hero.photo.src} alt={hero.photo.alt} fill sizes="(max-width: 700px) 75vw, 380px" priority/></div>
        <figcaption><span className="scrap-hand">{hero.photo.caption}</span><span>{hero.photo.index}</span></figcaption>
      </motion.figure>
      <button onClick={() => setNote((note + 1) % notes.length)} className="scrap-postit scrap-hero-note" aria-label={hero.nextNoteLabel}>
        <span className="scrap-label">{hero.noteLabel}</span><span className="scrap-note-writing" aria-live="polite"><Handwritten key={note} className="scrap-hand" text={notes[note]}/></span><span className="scrap-note-index">{String(note + 1).padStart(2, "0")} / {String(notes.length).padStart(2, "0")} <ArrowUpRight size={15}/></span>
      </button>
      <div className="scrap-round-stamp" aria-hidden="true"><Asterisk size={26}/><span>{hero.stamp[0]}<br/>{hero.stamp[1]}</span></div>
    </div>
  </section>
}
