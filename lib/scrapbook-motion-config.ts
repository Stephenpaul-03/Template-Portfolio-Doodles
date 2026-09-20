// Shared by the head's pre-paint styles and the client animation controller.
// A target has exactly one entrance; containers must not duplicate child effects.
export type MotionEffect = "fade" | "paper" | "note" | "stamp" | "draw" | "write" | "words"
export const motionTargets: readonly [string, MotionEffect, number][] = [
  ['[data-write="words"]', "words", 2],
  ["[data-write]", "write", 2],
  ["[data-underline]", "draw", 0.35],
  [".scrap-header-inner", "fade", 0.4],
  ["[data-reveal]", "fade", 0],
  [".scrap-postit", "note", 1],
  [".scrap-round-stamp, .scrap-postage", "stamp", 1],
  [".scrap-hero-graph, .scrap-hero-photo", "paper", 1],
]
export const motionSelector = motionTargets.map(([match]) => match).join(", ")

// Only an early, working JS bootstrap can opt into hidden preparation.
// No JS, unsupported browsers, and reduced motion all use visible default HTML.
export const motionPrepaintStyles = `
  @media (prefers-reduced-motion: no-preference) {
    html:is([data-scrap-motion="pending"], [data-scrap-motion="active"])
    #scrapbook-page :is(${motionSelector}, [data-doodle], [data-lenis-reveal]):not([data-motion-state="visible"]) {
      opacity: 0;
    }
    html:is([data-scrap-motion="pending"], [data-scrap-motion="active"])
    #scrapbook-page [data-lenis-reveal]:not([data-motion-state="visible"]) {
      opacity: 0 !important;
    }
  }
`

export const motionBootstrap = `
  (() => {
    if (!window.matchMedia || window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        !("IntersectionObserver" in window) || !Element.prototype.animate) return;
    const root = document.documentElement;
    const initialPortfolio = true;
    root.setAttribute("data-scrap-motion", initialPortfolio ? "pending" : "idle");
    if (initialPortfolio) setTimeout(() => {
      if (root.getAttribute("data-scrap-motion") === "pending") {
        root.setAttribute("data-scrap-motion", "expired");
      }
    }, 1800);
  })();
`
