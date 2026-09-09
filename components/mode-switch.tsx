"use client"

import { motion, useReducedMotion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useLayoutEffect } from "react"

import { routes, workshopIsReady } from "@/lib/routes"
import { content } from "@/data/content"

const copy = content.modeSwitch

export function ModeSwitch() {
  const router = useRouter()
  const reduceMotion = useReducedMotion()

  useLayoutEffect(() => {
    if (window.matchMedia("(max-width: 767px)").matches) {
      router.replace(routes.portfolio)
    }
  }, [router])

  const transition = reduceMotion ? { duration: 0 } : { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const }

  return (
    <main className="relative hidden min-h-svh overflow-hidden bg-[#0d0d0c] text-[#f0ede5] md:flex md:flex-col">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_74%_14%,rgba(150,126,80,0.12),transparent_31%),linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.018)_46%,transparent_47%)]" />
      <div aria-hidden="true" className="absolute inset-x-0 top-[19%] h-px bg-white/[0.08]" />

      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ ...transition, delay: reduceMotion ? 0 : 0.05 }}
        className="relative flex items-center justify-between px-8 py-7 text-[10px] font-medium uppercase tracking-[0.28em] text-[#8b887f] lg:px-14"
      >
        <span>{content.site.brand}</span>
        <span>{copy.intro}</span>
      </motion.header>

      <section className="relative grid flex-1 grid-cols-12 px-8 pb-10 pt-[8vh] lg:px-14 lg:pb-14">
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: reduceMotion ? 0 : 0.1 }}
          className="col-span-10 col-start-2 self-start lg:col-span-8 lg:col-start-2"
        >
          <p className="mb-6 text-[11px] uppercase tracking-[0.3em] text-[#9e8d6b]">{copy.eyebrow}</p>
          <h1 className="max-w-4xl font-[var(--font-display-system)] text-[clamp(3.5rem,7.8vw,8rem)] font-normal leading-[0.88] tracking-[-0.05em]">
            {copy.title[0]}
            <br />
            {copy.title[1]}
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...transition, delay: reduceMotion ? 0 : 0.22 }}
          className="col-span-11 col-start-2 mt-auto grid grid-cols-2 border-t border-white/15 lg:col-span-9 lg:col-start-4"
        >
          <Link
            href={routes.portfolio}
            className="group flex min-h-44 flex-col justify-between border-r border-white/15 py-6 pr-8 transition-colors duration-300 hover:bg-white/[0.035] hover:pl-5"
          >
            <span className="text-[10px] uppercase tracking-[0.28em] text-[#85827b]">{copy.normal.label}</span>
            <span className="flex items-end justify-between gap-8 text-xl font-light leading-snug lg:text-2xl">
              {copy.normal.description[0]}<br />{copy.normal.description[1]}
              <ArrowRight className="mb-1 size-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </Link>

          <button
            type="button"
            disabled={!workshopIsReady}
            className="flex min-h-44 w-full cursor-not-allowed flex-col justify-between py-6 pl-8 text-left text-[#77746d]"
          >
            <span className="flex items-center justify-between text-[10px] uppercase tracking-[0.28em]">
              <span>{copy.experience.label}</span>
              <span className="rounded-full border border-[#76684e]/50 px-2.5 py-1 text-[9px] text-[#9e8d6b]">{copy.experience.status}</span>
            </span>
            <span className="text-xl font-light leading-snug lg:text-2xl">{copy.experience.description[0]}<br />{copy.experience.description[1]}</span>
          </button>
        </motion.div>
      </section>
    </main>
  )
}
