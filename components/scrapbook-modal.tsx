"use client"

import { motion, useReducedMotion } from "framer-motion"
import { X } from "lucide-react"
import { useEffect, useRef, type ReactNode } from "react"

export function ScrapbookModal({ title, onClose, children, layoutId }: { title: string; onClose: () => void; children: ReactNode; layoutId?: string }) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    const overflow = document.body.style.overflow
    const page = document.getElementById("scrapbook-page")
    const previousInert = page?.inert ?? false
    if (page) page.inert = true
    document.body.style.overflow = "hidden"
    dialogRef.current?.querySelector<HTMLButtonElement>("button")?.focus()
    function keydown(event: KeyboardEvent) {
      if (event.key === "Escape") { event.preventDefault(); onClose(); return }
      if (event.key !== "Tab") return
      const elements = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex="0"]') ?? [])
      const first = elements[0], last = elements[elements.length - 1]
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
    }
    document.addEventListener("keydown", keydown)
    return () => {
      document.removeEventListener("keydown", keydown)
      document.body.style.overflow = overflow
      if (page) page.inert = previousInert
      if (previous?.isConnected) previous.focus()
    }
  }, [onClose])
  return <motion.div className="scrap-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : 0.28 }}>
    <div className="scrap-backdrop" aria-hidden="true" onClick={onClose} />
    <motion.div ref={dialogRef} role="dialog" aria-modal="true" aria-label={title} layoutId={reduced ? undefined : layoutId} className="scrap-dialog"
      initial={layoutId ? false : { y: reduced ? 0 : 35, scale: reduced ? 1 : 0.97 }}
      animate={{ y: 0, scale: 1 }} exit={{ y: reduced ? 0 : 22 }}
      transition={{ duration: reduced ? 0 : 0.38, ease: [0.22, 1, 0.36, 1] }}>
      <div className="scrap-dialog-bar"><span className="scrap-label">{title}</span><button className="scrap-icon-button" onClick={onClose} aria-label="Close details"><X size={18} /></button></div>
      <motion.div layoutScroll className="scrap-dialog-content" tabIndex={0} role="region" aria-label={`${title} details`}>
        {children}
      </motion.div>
    </motion.div>
  </motion.div>
}
