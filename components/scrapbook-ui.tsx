"use client"

import { motion, useReducedMotion, useScroll } from "framer-motion"
import { useRef } from "react"

export function Chapter({ number, label, title, aside }: { number: string; label: string; title: string; aside?: string }) {
  const chapter = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: chapter, offset: ["start end", "start center"] })
  return <div ref={chapter} className="scrap-chapter"><motion.span className="scrap-chapter-progress" aria-hidden="true" style={{ scaleX: reduced ? 1 : scrollYProgress }}/><div><span className="scrap-label"><span className="scrap-chapter-number">{number}</span>{label}</span><h2>{title}</h2></div>{aside && <p className="scrap-hand">{aside}</p>}</div>
}
