"use client"

import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowLeft, Menu, Moon, Sun, X } from "lucide-react"
import Link from "next/link"
import { useTheme } from "@/components/theme-provider"
import { currentScrollSection } from "@/lib/scroll-navigation"

const links = [
  { href: "#about", label: "The person" },
  { href: "#work", label: "The work" },
  { href: "#experience", label: "The journey" },
  { href: "#hobbies", label: "The sidelines" },
]
const allLinks = [{ href: "#top", label: "The beginning" }, ...links, { href: "#contact", label: "Say hello" }]

export function SiteHeader() {
  const [compact, setCompact] = useState(false)
  const [active, setActive] = useState("top")
  const [open, setOpen] = useState(false)
  const menu = useRef<HTMLButtonElement>(null)
  const header = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    let frame = 0
    const sections = allLinks.flatMap(link => {
      const element = document.getElementById(link.href.slice(1))
      return element ? [{ id: link.href.slice(1), element }] : []
    })
    function update() {
      frame = 0
      const headerBottom = header.current?.getBoundingClientRect().bottom ?? 90
      const titleTop = document.getElementById("hero-title")?.getBoundingClientRect().top ?? Infinity
      setCompact(window.scrollY > 0 && titleTop <= headerBottom)
      const readingLine = headerBottom + Math.min(120, window.innerHeight * 0.15)
      const atBottom = window.scrollY > 0 && window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 4
      setActive(currentScrollSection(sections.map(({ id, element }) => ({ id, top: element.getBoundingClientRect().top })), readingLine, atBottom))
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    window.addEventListener("hashchange", schedule)
    window.addEventListener("pageshow", schedule)
    const observer = new ResizeObserver(schedule)
    const page = document.getElementById("scrapbook-page")
    if (page) observer.observe(page)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      window.removeEventListener("hashchange", schedule)
      window.removeEventListener("pageshow", schedule)
    }
  }, [])

  useEffect(() => {
    function escape(event: KeyboardEvent) {
      if (event.key === "Escape" && open) { setOpen(false); menu.current?.focus() }
    }
    window.addEventListener("keydown", escape)
    return () => window.removeEventListener("keydown", escape)
  }, [open])

  const currentLabel = allLinks.find(link => link.href === `#${active}`)?.label ?? "The beginning"
  return <header ref={header} className={`scrap-header ${compact ? "is-compact" : ""}`}>
    <div className="scrap-header-inner">
      <a className="scrap-brand" href="#top" aria-label="Stephen Paul's Workshop, back to top"><span className="scrap-monogram">s.</span><span>Stephen Paul’s Workshop<span className="scrap-brand-sub">{compact ? currentLabel : "a little collection of me"}</span></span></a>
      <nav aria-label="Main navigation" className="scrap-desktop-nav">{links.map(link => {
        const selected = link.href === `#${active}`
        return <a key={link.href} href={link.href} aria-current={selected ? "location" : undefined}>
          <AnimatePresence>
            {selected && <motion.span key={link.href} className="scrap-nav-pill"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.24, ease: "easeInOut" }} aria-hidden="true"/>}
          </AnimatePresence>
          <span>{link.label}</span>
        </a>
      })}</nav>
      <div className="scrap-header-actions">
        <Link href="/" className="scrap-mode-link" aria-label="Back to mode switch"><ArrowLeft size={14}/><span>Modes</span></Link>
        <button className="scrap-icon-button" onClick={toggleTheme} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}>{theme === "light" ? <Moon size={16}/> : <Sun size={16}/>}</button>
        <a href="#contact" className="scrap-header-contact" aria-current={active === "contact" ? "location" : undefined}>Say hello ↗</a>
        <button ref={menu} className="scrap-icon-button scrap-menu-toggle" aria-controls="scrap-menu" aria-expanded={open} onClick={() => setOpen(!open)} aria-label={open ? "Close navigation" : "Open navigation"}>{open ? <X size={18}/> : <Menu size={18}/>}</button>
      </div>
    </div>
    {open && <nav id="scrap-menu" className="scrap-mobile-nav" aria-label="Mobile navigation">{allLinks.map(link => <a key={link.href} href={link.href} aria-current={link.href === `#${active}` ? "location" : undefined} onClick={() => setOpen(false)}>{link.label}<span>↗</span></a>)}</nav>}
  </header>
}
