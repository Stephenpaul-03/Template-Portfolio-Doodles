"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowUpRight, Check, Copy, Download, Github, Instagram, Linkedin } from "lucide-react"
import { Doodle, type DoodleName } from "@/components/margin-scribbles"
import { Handwritten } from "@/components/handwritten"
import { LenisReveal } from "@/components/lenis-reveal"

import { content } from "@/data/content"

const { contact, site } = content
const { email, socials } = contact
const socialIcons: Record<string, typeof Linkedin> = { linkedin: Linkedin, github: Github, instagram: Instagram }
const footerDoodles: DoodleName[] = ["coffee", "sparkles", "plane", "orbit", "pencil"]

export function SiteFooter() {
  const [copyState, setCopyState] = useState("")
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => { if (timeout.current) clearTimeout(timeout.current) }, [])
  async function copyEmail() {
    try { await navigator.clipboard.writeText(email); setCopyState(contact.copySuccess) }
    catch { setCopyState(contact.copyError) }
    if (timeout.current) clearTimeout(timeout.current)
    timeout.current = setTimeout(() => setCopyState(""), 3000)
  }
  return <footer id="contact" className="scrap-footer"><div className="scrap-container">
    <div className="scrap-envelope">
      <div className="scrap-letter">
        <LenisReveal variant="left" className="scrap-letter-main">
        <div className="scrap-letter-top">
          <span className="scrap-label">{contact.eyebrow}</span>
          <Doodle name="plane" className="scrap-letter-flight"/>
        </div>
        <h2>{contact.title}<br/><em>{contact.titleAccent}</em></h2>
        <p>{contact.description[0]}<br/>{contact.description[1]}</p>
        <div className="scrap-email-line">
          <a href={`mailto:${email}`}>{email}<ArrowUpRight size={24}/></a>
          <button className="scrap-icon-button" onClick={copyEmail} aria-label={contact.copyLabel}>{copyState === contact.copySuccess ? <Check size={16}/> : <Copy size={16}/>}</button>
        </div>
        <span className="scrap-copy-state" role="status">{copyState}</span>
        <div className="scrap-letter-signoff">
          <Handwritten className="scrap-hand" text={contact.signoff}/>
        </div>
        </LenisReveal>
        <LenisReveal variant="right" index={1} className="scrap-letter-rail">
          <span className="scrap-postage" aria-hidden="true">{contact.stamp.initials}<span>{contact.stamp.caption}</span></span>
          <a href={contact.resume.href} download className="scrap-resume-button"><Download size={15}/>{contact.resume.label}</a>
        <nav className="scrap-letter-socials" aria-label={contact.socialLabel}>
          {socials.map(({ label, href, icon }) => { const Icon = socialIcons[icon] ?? ArrowUpRight; return <a key={label} href={href}><Icon size={16} aria-hidden="true"/><span>{label}</span></a> })}
        </nav>
        </LenisReveal>
        <div className="scrap-footer-flourish" aria-hidden="true">
          {footerDoodles.map(name => <Doodle key={name} name={name}/>)}
        </div>
      </div>
      <LenisReveal variant="text" index={2} className="scrap-envelope-bottom">
        <Doodle name="sparkles" className="scrap-footer-base-doodle"/>
        <a href="#top" className="scrap-footer-mini-brand"><span className="scrap-monogram">{site.monogram}</span><span>{site.brand}</span></a>
        <span className="scrap-envelope-origin">{contact.origin}</span>
        <span className="scrap-envelope-meta">© {new Date().getFullYear()} {contact.copyrightHolder} · {contact.copyrightNote}</span>
        <a href="#top" className="scrap-envelope-back scrap-button" aria-label={contact.backToTop}><span className="scrap-envelope-back-label">{contact.backToTop}</span><span aria-hidden="true">↑</span></a>
        <Doodle name="waves" className="scrap-envelope-postmark" aria-hidden="true"/>
      </LenisReveal>
    </div>
  </div></footer>
}
