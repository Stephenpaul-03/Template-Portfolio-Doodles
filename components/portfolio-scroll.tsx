"use client"

import { cancelFrame, frame } from "framer-motion"
import { ReactLenis, useLenis, type LenisRef } from "lenis/react"
import { useEffect, useRef, type ReactNode } from "react"

function LenisSignals() {
  useLenis((lenis) => {
    const root = document.documentElement
    root.style.setProperty("--lenis-scroll", String(lenis.scroll))
    root.style.setProperty("--lenis-progress", String(lenis.progress))
    root.style.setProperty("--lenis-velocity", String(lenis.velocity))
    root.dataset.scrollDirection = lenis.direction < 0 ? "up" : lenis.direction > 0 ? "down" : "idle"
  }, [], -100)
  return null
}

export function PortfolioScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null)

  useEffect(() => {
    function update({ timestamp }: { timestamp: number }) {
      lenisRef.current?.lenis?.raf(timestamp)
    }
    frame.update(update, true)
    return () => cancelFrame(update)
  }, [])

  return <ReactLenis
    root
    ref={lenisRef}
    options={{
      autoRaf: false,
      smoothWheel: true,
      lerp: 0.085,
      syncTouch: false,
      anchors: { offset: -84, duration: 1.05 },
      autoToggle: true,
      stopInertiaOnNavigate: true,
      respectReducedMotion: true,
    }}
  >
    <LenisSignals/>
    {children}
  </ReactLenis>
}
