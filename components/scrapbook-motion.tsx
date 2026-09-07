"use client"

import { useEffect } from "react"

type Effect = "fade" | "paper" | "note" | "stamp" | "draw" | "write"
const targets: readonly [string, Effect, number][] = [
  ["[data-write]", "write", 140],
  ["[data-doodle]", "draw", 100],
  [".scrap-postit", "note", 160],
  [".scrap-round-stamp, .scrap-postage", "stamp", 240],
  [".scrap-hero-graph, .scrap-hero-photo, .scrap-id-card", "paper", 120],
  [".scrap-project, .scrap-career-page, .scrap-education", "paper", 70],
  [".scrap-chapter, .scrap-about-copy, .scrap-principle-buttons, .scrap-future", "fade", 0],
  [".scrap-hero-copy > *, .scrap-board-item, .scrap-letter-main, .scrap-envelope-bottom", "fade", 70],
]
const selector = targets.map(([match]) => match).join(", ")
const ease = "cubic-bezier(.2,.7,.2,1)"

function entrance(effect: Effect): { keyframes: Keyframe[]; duration: number } {
  if (effect === "note") return {
    duration: 850,
    keyframes: [
      { opacity: 0, translate: "12px -44px", rotate: "-12deg", scale: ".9" },
      { opacity: 1, translate: "0 3px", rotate: "2deg", scale: "1.015", offset: .8 },
      { opacity: 1, translate: "0 0", rotate: "0deg", scale: "1" },
    ],
  }
  if (effect === "paper") return {
    duration: 750,
    keyframes: [
      { opacity: 0, translate: "0 34px", rotate: "-4deg" },
      { opacity: 1, translate: "0 -2px", rotate: "1deg", offset: .8 },
      { opacity: 1, translate: "0 0", rotate: "0deg" },
    ],
  }
  if (effect === "stamp") return {
    duration: 550,
    keyframes: [
      { opacity: 0, scale: "1.35", rotate: "12deg" },
      { opacity: 1, scale: ".96", rotate: "-2deg", offset: .7 },
      { opacity: 1, scale: "1", rotate: "0deg" },
    ],
  }
  return { duration: 650, keyframes: [{ opacity: 0, translate: "0 24px" }, { opacity: 1, translate: "0 0" }] }
}

// Enhances visible HTML after hydration. No CSS or server markup hides content.
// Animations use individual transforms so card dragging and existing rotations
// keep ownership of their transform property.
export function ScrapbookMotion() {
  useEffect(() => {
    const page = document.getElementById("scrapbook-page")
    if (!page || !("IntersectionObserver" in window) || !Element.prototype.animate) return
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)")
    let dispose = () => {}

    function enable() {
      dispose()
      if (preference.matches || !page) return
      const seen = new WeakSet<Element>()
      const waiting = new Map<Element, { effect: Effect; delay: number }>()
      const running = new Map<Animation, Element>()
      const sequences = new Map<string, number>()

      function play(element: Element, frames: Keyframe[], duration: number, delay: number, easing = ease) {
        const animation = element.animate(frames, { duration, delay, easing, fill: "backwards" })
        running.set(animation, element)
        const clear = () => { running.delete(animation); animation.cancel() }
        animation.onfinish = clear
        animation.oncancel = () => running.delete(animation)
      }

      function reveal(element: Element, effect: Effect, delay: number) {
        if (effect === "draw") {
          element.querySelectorAll("path").forEach((path, index) => {
            play(path, [{ strokeDasharray: "1 1", strokeDashoffset: 1 }, { strokeDasharray: "1 1", strokeDashoffset: 0 }], 1400, delay + index * 100, "ease-in-out")
          })
        } else if (effect === "write") {
          const letters = Array.from(element.querySelectorAll("[data-ink]"))
          const step = Math.min(24, 1400 / Math.max(1, letters.length))
          letters.forEach((letter, index) => play(letter, [{ opacity: 0 }, { opacity: 1 }], 60, delay + index * step, "steps(1, end)"))
        } else {
          const { keyframes, duration } = entrance(effect)
          play(element, keyframes, duration, delay)
        }
      }

      const observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          const config = waiting.get(entry.target)
          if (config) reveal(entry.target, config.effect, config.delay)
          waiting.delete(entry.target)
          observer.unobserve(entry.target)
        }
      }, { threshold: .08, rootMargin: "0px 0px 24px 0px" })

      function register(root: Element) {
        const elements = [...(root.matches(selector) ? [root] : []), ...root.querySelectorAll(selector)]
        for (const element of elements) {
          if (seen.has(element)) continue
          seen.add(element)
          const target = targets.find(([match]) => element.matches(match))
          if (!target) continue
          const [match, effect, delay] = target
          const sequence = sequences.get(match) ?? 0
          sequences.set(match, sequence + 1)
          waiting.set(element, { effect, delay: delay + (sequence % 3) * 65 })
          observer.observe(element)
        }
      }

      // Complete an entrance immediately when a user focuses or touches it.
      // This also keeps shared-layout hobby modals clear of entrance transforms.
      function interact(event: Event) {
        if (!(event.target instanceof Element)) return
        const target = event.target
        for (const [animation, element] of running) {
          if (element.contains(target) || target.contains(element)) { animation.cancel(); running.delete(animation) }
        }
        for (const element of waiting.keys()) {
          if (element.contains(target) || target.contains(element)) { observer.unobserve(element); waiting.delete(element) }
        }
      }

      register(page)
      const mutations = new MutationObserver(records => {
        for (const record of records) {
          record.addedNodes.forEach(node => { if (node instanceof Element) register(node) })
        }
        for (const element of waiting.keys()) {
          if (!element.isConnected) { observer.unobserve(element); waiting.delete(element) }
        }
        for (const [animation, element] of running) {
          if (!element.isConnected) { animation.cancel(); running.delete(animation) }
        }
      })
      mutations.observe(page, { childList: true, subtree: true })
      page.addEventListener("pointerdown", interact, true)
      page.addEventListener("focusin", interact)
      dispose = () => {
        observer.disconnect()
        mutations.disconnect()
        page.removeEventListener("pointerdown", interact, true)
        page.removeEventListener("focusin", interact)
        for (const animation of running.keys()) animation.cancel()
        running.clear()
        waiting.clear()
      }
    }

    enable()
    preference.addEventListener("change", enable)
    return () => { dispose(); preference.removeEventListener("change", enable) }
  }, [])
  return null
}
