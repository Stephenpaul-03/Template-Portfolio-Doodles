"use client"

import { motion, useReducedMotion, useScroll } from "framer-motion"
import { useRef } from "react"
import { Handwritten } from "@/components/handwritten"

export function Chapter({ number, label, title, aside }: { number: string; label: string; title: string; aside?: string }) {
  const chapter = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: chapter, offset: ["start end", "start center"] })
  return <div ref={chapter} className="scrap-chapter"><motion.span className="scrap-chapter-progress" aria-hidden="true" style={{ scaleX: reduced ? 1 : scrollYProgress }}/><div><span className="scrap-label" data-reveal data-motion-phase={0}><span className="scrap-chapter-number">{number}</span>{label}</span><h2><Handwritten text={title} variant="words" phase={0.1}/></h2></div>{aside && <p className="scrap-hand"><Handwritten text={aside}/></p>}</div>
}
