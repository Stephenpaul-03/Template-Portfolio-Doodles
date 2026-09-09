"use client"

import { motion, useMotionValue, useReducedMotion } from "framer-motion"
import { useLenis } from "lenis/react"
import { useRef } from "react"
import { Handwritten } from "@/components/handwritten"

export function Chapter({ number, label, title, aside }: { number: string; label: string; title: string; aside?: string }) {
  const chapter = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const scrollYProgress = useMotionValue(0)
  useLenis(() => {
    if (!chapter.current) return
    const start = window.innerHeight
    const end = window.innerHeight * .5
    scrollYProgress.set(Math.max(0, Math.min(1, (start - chapter.current.getBoundingClientRect().top) / (start - end))))
  }, [scrollYProgress], 5)
  return <div ref={chapter} className="scrap-chapter"><motion.span className="scrap-chapter-progress" aria-hidden="true" style={{ scaleX: reduced ? 1 : scrollYProgress }}/><div><span className="scrap-label" data-reveal data-motion-phase={0}><span className="scrap-chapter-number">{number}</span>{label}</span><h2><Handwritten text={title} variant="words" phase={0.1}/></h2></div>{aside && <p className="scrap-hand"><Handwritten text={aside}/></p>}</div>
}
