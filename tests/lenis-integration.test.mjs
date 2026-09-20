import assert from "node:assert/strict"
import test from "node:test"
import { readFileSync } from "node:fs"

const read = path => readFileSync(new URL("../" + path, import.meta.url), "utf8")

test("portfolio owns one root Lenis instance on the Framer frame loop", () => {
  const provider = read("components/portfolio-scroll.tsx")
  assert.match(provider, /ReactLenis/)
  assert.match(provider, /\broot\b/)
  assert.match(provider, /autoRaf:\s*false/)
  assert.match(provider, /frame\.update\(update,\s*true\)/)
  assert.match(provider, /anchors:\s*\{/)
  assert.match(provider, /respectReducedMotion:\s*true/)
  assert.match(read("main.tsx"), /<PortfolioScroll>/)
  assert.match(read("main.tsx"), /lenis\/dist\/lenis\.css/)
})

test("scroll-reactive components consume Lenis instead of native scroll loops", () => {
  for (const path of ["components/site-header.tsx", "components/scrapbook-motion.tsx", "components/scrapbook-ui.tsx"]) {
    assert.match(read(path), /useLenis/)
  }
  for (const path of ["components/site-header.tsx", "lib/doodle-scroll.ts"]) {
    assert.doesNotMatch(read(path), /addEventListener\(\s*["']scroll["']/)
  }
  assert.match(read("components/scrapbook-motion.tsx"), /doodlesRef\.current\?\.update\(lenis\.scroll,\s*lenis\.limit\)/)
})

test("cards and page content scrub their entrances from Lenis viewport progress", () => {
  const reveal = read("components/lenis-reveal.tsx")
  assert.match(reveal, /useLenis\(lenis => sync/)
  assert.match(reveal, /getBoundingClientRect\(\)\.top/)
  assert.match(reveal, /lenis\.scroll,\s*lenis\.limit/)
  assert.match(reveal, /lowestReachableTop/)
  assert.match(reveal, /useLayoutEffect\(sync/)
  assert.match(reveal, /data-lenis-reveal/)
  assert.doesNotMatch(reveal, /IntersectionObserver/)

  for (const path of [
    "components/about-section.tsx",
    "components/work-section.tsx",
    "components/experience-section.tsx",
    "components/site-footer.tsx",
  ]) {
    assert.match(read(path), /LenisReveal/)
  }
  assert.match(read("components/hobbies-section.tsx"), /useLenisReveal/)

  const configuration = read("lib/scrapbook-motion-config.ts")
  assert.match(configuration, /\[data-lenis-reveal\]/)
  assert.match(configuration, /\[data-lenis-reveal\][\s\S]*opacity:\s*0\s*!important/)
  assert.doesNotMatch(configuration, /scrap-project, \.scrap-career-page/)
  assert.doesNotMatch(configuration, /scrap-board-item, \.scrap-envelope-bottom/)
})

test("the hobby board stays compact and contained beneath the sticky header", () => {
  const layout = read("app/portfolio/scrapbook.css")
  const personality = read("app/portfolio/scrapbook-personality.css")
  assert.match(layout, /\.scrap-hobbies-section\s*\{[^}]*isolation:\s*isolate/)
  assert.match(layout, /\.scrap-board\s*\{[^}]*height:\s*720px/)
  assert.match(layout, /height:\s*1210px/)
  assert.match(layout, /height:\s*1240px/)
  assert.doesNotMatch(personality, /\.scrap-board\s*\{[^}]*height:/)
})

test("tape, post-it, header, and footer polish retain their intended sequencing", () => {
  const reveal = read("components/lenis-reveal.tsx")
  const motion = read("components/scrapbook-motion.tsx")
  const about = read("components/about-section.tsx")
  const footer = read("components/site-footer.tsx")
  const layout = read("app/portfolio/scrapbook.css")
  const personality = read("app/portfolio/scrapbook-personality.css")

  assert.match(reveal, /const tapeProgress = useTransform\(progress/)
  assert.match(motion, /querySelectorAll\("\.scrap-tape"\)/)
  assert.match(about, /LenisReveal[^>]+scrap-scroll-postit/)
  assert.match(motion, /matches\("\.scrap-scroll-postit"\)/)
  assert.match(layout, /scale:\s*var\(--tape-progress/)
  assert.match(personality, /\.scrap-project::before[^}]+scale:\s*var\(--tape-progress/)
  assert.doesNotMatch(layout, /\.scrap-header-contact::before/)
  assert.doesNotMatch(footer, /scrap-resume-button scrap-button/)
  assert.match(layout, /\.scrap-resume-button, \.scrap-letter-socials a/)
  assert.match(layout, /\.scrap-letter-rail \.scrap-postage[^}]+top:\s*63px/)
})

test("overlays and draggable cards opt out of Lenis gesture capture", () => {
  const modal = read("components/scrapbook-modal.tsx")
  assert.match(modal, /lenis\?\.stop\(\)/)
  assert.match(modal, /lenis\?\.start\(\)/)
  assert.match(modal, /data-lenis-prevent/)
  assert.match(read("components/hobbies-section.tsx"), /data-lenis-prevent-touch/)
})
