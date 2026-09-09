"use client"

import { useLayoutEffect, useRef } from "react"
import { useLenis } from "lenis/react"
import { setupDoodleScroll } from "@/lib/doodle-scroll"
import { motionTargets as targets, motionSelector as selector, type MotionEffect as Effect } from "@/lib/scrapbook-motion-config"

type State = "waiting" | "queued" | "running" | "done"
type Item = {
  element: Element
  section: Element
  effect: Effect
  phase: number
  order: number
  state: State
  animations: Animation[]
}

const ease = "cubic-bezier(.2,.7,.2,1)"

function entrance(effect: Effect): { keyframes: Keyframe[]; duration: number } {
  if (effect === "note") return {
    duration: 520,
    keyframes: [
      { opacity: 0, translate: "8px -24px", rotate: "-8deg", scale: ".96" },
      { opacity: 1, translate: "0 2px", rotate: "1deg", scale: "1", offset: .8 },
      { opacity: 1, translate: "0 0", rotate: "0deg", scale: "1" },
    ],
  }
  if (effect === "paper") return {
    duration: 460,
    keyframes: [
      { opacity: 0, translate: "0 18px", rotate: "-2deg" },
      { opacity: 1, translate: "0 0", rotate: "0deg" },
    ],
  }
  if (effect === "stamp") return {
    duration: 300,
    keyframes: [
      { opacity: 0, scale: "1.15", rotate: "6deg" },
      { opacity: 1, scale: "1", rotate: "0deg" },
    ],
  }
  return { duration: 380, keyframes: [{ opacity: 0, translate: "0 14px" }, { opacity: 1, translate: "0 0" }] }
}

// CSS holds the first frame before hydration; the controller hands each target
// to WAAPI before releasing that gate. Individual transforms preserve card dragging.
export function ScrapbookMotion() {
  const doodlesRef = useRef<ReturnType<typeof setupDoodleScroll> | null>(null)
  const syncViewportRef = useRef<(() => void) | null>(null)
  useLenis((lenis) => {
    doodlesRef.current?.update(lenis.scroll, lenis.limit)
    syncViewportRef.current?.()
  }, [], -20)

  useLayoutEffect(() => {
    const page = document.getElementById("scrapbook-page")
    if (!page || !window.matchMedia || !("IntersectionObserver" in window) || !Element.prototype.animate) return
    const root = document.documentElement
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)")
    let dispose = () => {}
    let motionDisabled = false

    function enable() {
      dispose()
      if (preference.matches) motionDisabled = true
      if (motionDisabled) root.setAttribute("data-scrap-motion", "idle")
      // Once content has been shown statically, never hide it again on a late
      // hydration or preference change. Client navigation starts from "idle".
      if (motionDisabled || !page || !["pending", "idle"].includes(root.getAttribute("data-scrap-motion") ?? "")) return
      const items = new Map<Element, Item>()
      const active = new Set<Item>()
      let frame = 0
      let disposed = false

      function schedule() {
        if (!disposed && !frame) frame = requestAnimationFrame(pump)
      }

      function complete(item: Item) {
        item.element.setAttribute("data-motion-state", "visible")
        item.state = "done"
        active.delete(item)
        observer.unobserve(item.element)
        for (const animation of item.animations) {
          animation.onfinish = null
          animation.cancel()
        }
        item.animations = []
        schedule()
      }

      function prepare(item: Item) {
        function add(element: Element, frames: Keyframe[], duration: number, delay = 0, easing = ease) {
          const animation = element.animate(frames, { duration, delay, easing, fill: "backwards" })
          animation.pause()
          animation.currentTime = 0
          item.animations.push(animation)
        }
        if (item.effect === "draw") {
          item.element.querySelectorAll("path").forEach((path, index) => {
            add(path, [{ strokeDasharray: "1 1", strokeDashoffset: 1 }, { strokeDasharray: "1 1", strokeDashoffset: 0 }], 320, Math.min(index * 50, 150), "ease-in-out")
          })
        } else if (item.effect === "words") {
          item.element.querySelectorAll(".scrap-written-word").forEach((word, index) => {
            add(word, [{ opacity: 0, translate: "0 7px" }, { opacity: 1, translate: "0 0" }], 180, index * 85)
          })
        } else if (item.effect === "write") {
          const letters = Array.from(item.element.querySelectorAll("[data-ink]"))
          const step = Math.min(item.phase < 1 ? 24 : 16, 600 / Math.max(1, letters.length))
          letters.forEach((letter, index) => add(letter, [{ opacity: 0 }, { opacity: 1 }], 32, index * step, "steps(1, end)"))
        } else {
          const { keyframes, duration } = entrance(item.effect)
          add(item.element, keyframes, item.phase < 1 ? 260 : duration)
          if (item.effect === "paper") {
            item.element.querySelectorAll(".scrap-tape").forEach(tape => {
              add(tape, [
                { opacity: 0, scale: "0 1", transformOrigin: "left center" },
                { opacity: 1, scale: "1 1", transformOrigin: "left center" },
              ], 260, duration)
            })
          }
        }
        // First frames are now installed synchronously, including child ink.
        item.element.setAttribute("data-motion-state", "visible")
      }

      function pump() {
        frame = 0
        if (disposed || active.size) return
        // Only visible, queued items participate. Scrolling past an item completes
        // it immediately, so a previous section cannot hold up the next one.
        const queued = [...items.values()].filter(item => item.state === "queued")
        const first = queued.find(item => {
          const introduction = [...items.values()].find(candidate => candidate.section === item.section && candidate.phase === 0)
          return !introduction || introduction.state !== "waiting" || introduction.element.getBoundingClientRect().top < window.innerHeight
        })
        if (!first) return
        const sectionItems = queued.filter(item => item.section === first.section)
        const phase = Math.min(...sectionItems.map(item => item.phase))
        const batch = sectionItems.filter(item => item.phase === phase).sort((a, b) => a.order - b.order)
        for (const item of batch) { item.state = "running"; active.add(item) }
        batch.forEach((item, index) => {
          if (!item.animations.length) { complete(item); return }
          let remaining = item.animations.length
          for (const animation of item.animations) {
            const delay = Number(animation.effect?.getTiming().delay ?? 0)
            animation.effect?.updateTiming({ delay: delay + Math.min(index * 60, 240) })
            animation.onfinish = () => {
              // No forward fill: cancelling restores normal styles, not inline locks.
              animation.onfinish = null
              animation.cancel()
              if (--remaining === 0) complete(item)
            }
            animation.play()
          }
        })
      }

      function syncViewport() {
        const viewportBottom = window.innerHeight - 24
        for (const item of items.values()) {
          if (item.state === "done") continue
          const rect = item.element.getBoundingClientRect()
          const bottom = Number.isFinite(rect.bottom) ? rect.bottom : rect.top + 1
          const visible = rect.top < viewportBottom && bottom > 0
          if (visible && item.state === "waiting") {
            item.state = "queued"
            prepare(item)
          } else if (!visible && item.state !== "waiting") {
            complete(item)
          }
        }
        schedule()
      }

      const observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          const item = items.get(entry.target)
          if (!item || item.state === "done") continue
          if (!entry.isIntersecting) {
            if (item.state !== "waiting") complete(item)
            continue
          }
          if (item.state === "waiting") {
            item.state = "queued"
            prepare(item)
          }
        }
        schedule()
      }, { threshold: .08, rootMargin: "0px 0px -24px 0px" })

      function register(root: Element) {
        const elements = [...(root.matches(selector) ? [root] : []), ...root.querySelectorAll(selector)]
        for (const element of elements) {
          if (items.has(element)) continue
          // Scroll-scrubbed notes own their reversible lifecycle through Lenis.
          if (element.matches(".scrap-scroll-postit")) continue
          const target = targets.find(([match]) => element.matches(match))
          if (!target) continue
          const [, effect, defaultPhase] = target
          const configuredPhase = Number(element.getAttribute("data-motion-phase") ?? defaultPhase)
          const phase = Number.isFinite(configuredPhase) ? configuredPhase : defaultPhase
          element.removeAttribute("data-motion-state")
          const section = element.matches(".scrap-header-inner")
            ? page!.querySelector('[data-motion-section="hero"]') ?? page!
            : element.closest("[data-motion-section]") ?? page!
          items.set(element, { element, section, effect, phase, order: items.size, state: "waiting", animations: [] })
          observer.observe(element)
        }
      }

      // Interaction always wins over choreography, including queued child text.
      function interact(event: Event) {
        if (!(event.target instanceof Element)) return
        const target = event.target
        for (const item of items.values()) {
          if (item.state !== "done" && (item.element.contains(target) || target.contains(item.element))) complete(item)
        }
      }

      const doodles = setupDoodleScroll(page)
      doodlesRef.current = doodles
      syncViewportRef.current = syncViewport
      register(page)
      const mutations = new MutationObserver(records => {
        for (const record of records) {
          record.addedNodes.forEach(node => { if (node instanceof Element) register(node) })
        }
        doodles.refresh()
        for (const [element, item] of items) {
          if (!element.isConnected) { complete(item); items.delete(element) }
        }
      })
      mutations.observe(page, { childList: true, subtree: true })
      page.addEventListener("pointerdown", interact, true)
      page.addEventListener("focusin", interact)
      root.setAttribute("data-scrap-motion", "active")
      dispose = () => {
        disposed = true
        root.setAttribute("data-scrap-motion", "idle")
        cancelAnimationFrame(frame)
        observer.disconnect()
        mutations.disconnect()
        doodles.dispose()
        if (doodlesRef.current === doodles) doodlesRef.current = null
        if (syncViewportRef.current === syncViewport) syncViewportRef.current = null
        page.removeEventListener("pointerdown", interact, true)
        page.removeEventListener("focusin", interact)
        for (const item of items.values()) complete(item)
        active.clear()
        items.clear()
      }
    }

    enable()
    preference.addEventListener("change", enable)
    return () => { dispose(); preference.removeEventListener("change", enable) }
  }, [])
  return null
}
