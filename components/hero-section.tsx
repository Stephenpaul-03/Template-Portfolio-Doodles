"use client"

import { motion, useReducedMotion } from "framer-motion"
import { ArrowDownRight, ArrowUpRight, Asterisk } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { Handwritten } from "@/components/handwritten"

const notes = ["Good questions make better starting points.", "A small prototype is worth a very long meeting.", "Leave things a little clearer than you found them."]
export function HeroSection() {
  const [note, setNote] = useState(0)
  const reduced = useReducedMotion()
  return <section className="scrap-hero scrap-container" aria-labelledby="hero-title">
    <div className="scrap-hero-copy">
      <span className="scrap-label"><span className="scrap-dot"/>Designer, builder & perpetual noticer</span>
      <h1 id="hero-title"><Handwritten text="Hello, I’m Stephen Paul."/><br/>I make things<br/><span className="scrap-underlined">make sense.</span></h1>
      <p className="scrap-intro">A designer with a builder’s curiosity. This is my corner of the internet—a collection of work, things I care about, and ideas still taking shape.</p>
      <div className="scrap-hero-links"><a href="#work" className="scrap-button">A few things I’ve made <ArrowUpRight size={17}/></a><a href="#about" className="scrap-text-link">A bit about me <ArrowDownRight size={16}/></a></div>
      <div className="scrap-hero-foot"><Handwritten className="scrap-hand" text="Glad you found your way here."/><span className="scrap-label">Based in India · Open to the world</span></div>
    </div>
    <div className="scrap-hero-collage">
      <div className="scrap-hero-graph" aria-hidden="true"><span>IDEAS, IN PROGRESS</span><div className="scrap-pencil-loop"/></div>
      <motion.figure className="scrap-hero-photo" whileHover={reduced ? undefined : { rotate: 0, y: -4 }} transition={{ duration: 0.3 }}>
        <span className="scrap-tape" aria-hidden="true"/>
        <div className="scrap-photo-image"><Image src="/images/hobbies/photography.svg" alt="Illustrated sunlit street with a quiet figure" fill sizes="(max-width: 700px) 75vw, 380px" priority/></div>
        <figcaption><span className="scrap-hand">Always looking a little closer.</span><span>01 / EVERYDAY OBSERVATIONS</span></figcaption>
      </motion.figure>
      <button onClick={() => setNote((note + 1) % notes.length)} className="scrap-postit scrap-hero-note" aria-label="Read another studio thought">
        <span className="scrap-label">A thought I keep coming back to</span><span className="scrap-note-writing" aria-live="polite"><Handwritten key={note} className="scrap-hand" text={notes[note]}/></span><span className="scrap-note-index">0{note + 1} / 03 <ArrowUpRight size={15}/></span>
      </button>
      <div className="scrap-round-stamp" aria-hidden="true"><Asterisk size={26}/><span>MADE WITH<br/>CURIOSITY</span></div>
    </div>
  </section>
}
