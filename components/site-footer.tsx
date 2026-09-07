"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowUpRight, Check, Copy, Download, Github, Instagram, Linkedin } from "lucide-react"
import { Doodle, type DoodleName } from "@/components/margin-scribbles"

const email = "hello@example.com"
const footerDoodles: DoodleName[] = ["coffee", "sparkles", "plane", "orbit", "pencil"]
const socials = [
  { label: "LinkedIn", href: "https://www.linkedin.com", icon: Linkedin },
  { label: "GitHub", href: "https://github.com", icon: Github },
  { label: "Instagram", href: "https://www.instagram.com", icon: Instagram },
]

export function SiteFooter() {
  const [copyState, setCopyState] = useState("")
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => () => { if (timeout.current) clearTimeout(timeout.current) }, [])
  async function copyEmail() {
    try { await navigator.clipboard.writeText(email); setCopyState("Copied to clipboard") }
    catch { setCopyState("Select the email address to copy it.") }
    if (timeout.current) clearTimeout(timeout.current)
    timeout.current = setTimeout(() => setCopyState(""), 3000)
  }
  return <footer id="contact" className="scrap-footer"><div className="scrap-container">
    <div className="scrap-envelope">
      <div className="scrap-letter">
        <div className="scrap-letter-main">
        <div className="scrap-letter-top">
          <span className="scrap-label">A note to whoever’s next</span>
          <Doodle name="plane" className="scrap-letter-flight"/>
        </div>
        <h2>Something on your mind?<br/><em>I’d love to hear it.</em></h2>
        <p>A project, a possibility, or just a good conversation.<br/>My inbox has room for all three.</p>
        <div className="scrap-email-line">
          <a href={`mailto:${email}`}>{email}<ArrowUpRight size={24}/></a>
          <button className="scrap-icon-button" onClick={copyEmail} aria-label="Copy email address">{copyState.startsWith("Copied") ? <Check size={16}/> : <Copy size={16}/>}</button>
        </div>
        <span className="scrap-copy-state" role="status">{copyState}</span>
        <div className="scrap-letter-signoff">
          <span className="scrap-hand">Until then, Steve.</span>
        </div>
        </div>
        <div className="scrap-letter-rail">
          <span className="scrap-postage" aria-hidden="true">S.W.<span>BY HUMAN</span></span>
          <a href="/files/steve-resume-placeholder.pdf" download className="scrap-resume-button scrap-button"><Download size={15}/>My résumé</a>
        <nav className="scrap-letter-socials" aria-label="Social links">
          {socials.map(({ label, href, icon: Icon }) => <a key={label} href={href}><Icon size={16} aria-hidden="true"/><span>{label}</span></a>)}
        </nav>
        </div>
        <div className="scrap-footer-flourish" aria-hidden="true">
          {footerDoodles.map(name => <Doodle key={name} name={name}/>)}
        </div>
      </div>
      <div className="scrap-envelope-bottom">
        <Doodle name="sparkles" className="scrap-footer-base-doodle"/>
        <a href="#top" className="scrap-footer-mini-brand"><span className="scrap-monogram">s.</span><span>Steve’s Workshop</span></a>
        <span className="scrap-envelope-origin">FROM INDIA, WITH CURIOSITY.</span>
        <span className="scrap-envelope-meta">© {new Date().getFullYear()} Steve · Always a work in progress.</span>
        <a href="#top" className="scrap-envelope-back scrap-button">Back to the beginning <span aria-hidden="true">↑</span></a>
        <Doodle name="waves" className="scrap-envelope-postmark" aria-hidden="true"/>
      </div>
    </div>
  </div></footer>
}
