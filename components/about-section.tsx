"use client"

import { useState } from "react"
import { ArrowUpRight } from "lucide-react"
import { Chapter } from "@/components/scrapbook-ui"

const principles = [
  { title: "Ask better questions.", text: "I start with the person on the other side of the screen. What are they trying to do, and what is getting in their way?" },
  { title: "Make the idea tangible.", text: "Sketches, prototypes, and working code turn assumptions into something we can actually discuss and improve." },
  { title: "Care about the last 10%.", text: "The empty state, the loading moment, the handoff. Small details are often where a thoughtful product earns trust." },
]
export function AboutSection() {
  const [active, setActive] = useState(0)
  return <section id="about" className="scrap-section scrap-container">
    <Chapter number="01" label="The person" title="A little context." aside="There’s a person behind the pixels."/>
    <div className="scrap-about-layout">
      <aside className="scrap-id-card"><span className="scrap-tape" aria-hidden="true"/><div className="scrap-avatar" aria-hidden="true">s<span>.</span></div><p className="scrap-hand">Steve</p><span className="scrap-label">Designer + builder</span><div className="scrap-id-lines"><span>HOME BASE <b>India</b></span><span>DEFAULT SETTING <b>Curious</b></span><span>FAVOURITE QUESTION <b>What if?</b></span></div></aside>
      <div className="scrap-about-copy"><h3>I like the space between<br/>“what if” and <em>“it works.”</em></h3><p>I’m drawn to complicated things that don’t need to feel complicated. My work connects product thinking, visual design, and front-end craft to make everyday experiences a little more human.</p><p>I enjoy getting my hands into the details: finding the structure, trying a few directions, and staying close to the build.</p><div className="scrap-tags"><span>Product design</span><span>Visual systems</span><span>Prototyping</span><span>Front-end craft</span></div></div>
    </div>
    <div className="scrap-principles"><div><span className="scrap-label">Things I believe about the work</span><div className="scrap-principle-buttons">{principles.map((item, index) => <button key={item.title} aria-pressed={active === index} onClick={() => setActive(index)} className={active === index ? "is-active" : ""}><span>0{index + 1}</span>{item.title}<ArrowUpRight size={16}/></button>)}</div></div><div className="scrap-principle-note" aria-live="polite"><span className="scrap-paper-pin" aria-hidden="true"/><span className="scrap-hand">{principles[active].text}</span></div></div>
  </section>
}
