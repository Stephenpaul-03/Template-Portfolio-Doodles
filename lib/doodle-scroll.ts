export function doodleProgress(top: number, scrollY: number, viewportHeight: number, maxScroll: number) {
  if (maxScroll <= 0 || viewportHeight <= 0) return 1
  const position = Math.max(0, Math.min(scrollY, maxScroll))
  const documentTop = top + scrollY
  const span = Math.min(180, viewportHeight * .3)
  const naturalStart = Math.max(0, documentTop - viewportHeight * .92)
  const end = Math.min(maxScroll, Math.max(naturalStart + span, documentTop - viewportHeight * .48))
  const start = Math.max(0, Math.min(naturalStart, end - span))
  return Math.max(0, Math.min(1, (position - start) / Math.max(1, end - start)))
}

// Paused animations are scrubbed, never played. CSS rotations and theme opacity
// remain owned by the existing doodle styles.
export function setupDoodleScroll(page: Element) {
  const doodles = new Map<Element, Animation[]>()
  let frame = 0
  let disposed = false

  function update() {
    frame = 0
    if (disposed) return
    const viewport = window.innerHeight
    const scrollY = window.scrollY
    const maxScroll = Math.max(0, document.documentElement.scrollHeight - viewport)
    // Batch layout reads before writing any animation timelines.
    const progress = [...doodles].map(([element, animations]) => ({
      animations,
      value: doodleProgress(element.getBoundingClientRect().top, scrollY, viewport, maxScroll),
    }))
    for (const { animations, value } of progress) {
      animations.forEach((animation, index) => {
        const local = Math.max(0, Math.min(1, value * (1 + (animations.length - 1) * .12) - index * .12))
        animation.currentTime = local * 1000
      })
    }
  }

  function schedule() {
    if (!disposed && !frame) frame = requestAnimationFrame(update)
  }

  function refresh() {
    if (disposed) return
    for (const [element, animations] of doodles) {
      if (!element.isConnected) {
        animations.forEach(animation => animation.cancel())
        doodles.delete(element)
      }
    }
    for (const element of page.querySelectorAll("[data-doodle]")) {
      if (doodles.has(element)) continue
      const animations = Array.from(element.querySelectorAll("path")).map(path => {
        const animation = path.animate([
          { strokeDasharray: "1 1", strokeDashoffset: 1 },
          { strokeDasharray: "1 1", strokeDashoffset: 0 },
        ], { duration: 1000, fill: "both", easing: "linear" })
        animation.pause()
        animation.currentTime = 0
        return animation
      })
      doodles.set(element, animations)
      // First stroke frames already exist when the pre-paint gate is released.
      element.setAttribute("data-motion-state", "visible")
    }
    update()
  }

  refresh()
  window.addEventListener("scroll", schedule, { passive: true })
  window.addEventListener("resize", schedule)
  window.addEventListener("pageshow", schedule)
  const resize = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule)
  resize?.observe(page)

  return {
    refresh,
    dispose() {
      disposed = true
      cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      window.removeEventListener("pageshow", schedule)
      resize?.disconnect()
      for (const [element, animations] of doodles) {
        element.setAttribute("data-motion-state", "visible")
        animations.forEach(animation => animation.cancel())
      }
      doodles.clear()
    },
  }
}
