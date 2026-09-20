import assert from "node:assert/strict"
import test from "node:test"
import { readFileSync } from "node:fs"
import vm from "node:vm"
import ts from "typescript"

const root = new URL("../", import.meta.url)
const configSource = readFileSync(new URL("lib/scrapbook-motion-config.ts", root), "utf8")
const compiled = ts.transpileModule(configSource, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
const config = {}
vm.runInNewContext(compiled, { exports: config })

function bootstrap({ pathname = "/portfolio", reduced = false, unsupported } = {}) {
  const attributes = new Map()
  const timers = []
  const html = {
    setAttribute: (name, value) => attributes.set(name, String(value)),
    getAttribute: name => attributes.get(name) ?? null,
    removeAttribute: name => attributes.delete(name),
    dataset: new Proxy({}, {
      get: (_, name) => attributes.get("data-" + String(name).replace(/[A-Z]/g, letter => "-" + letter.toLowerCase())),
      set: (_, name, value) => { attributes.set("data-" + String(name).replace(/[A-Z]/g, letter => "-" + letter.toLowerCase()), String(value)); return true },
    }),
  }
  class Element {}
  if (unsupported !== "animate") Element.prototype.animate = () => {}
  const setTimeout = (callback, delay) => { timers.push({ callback, delay }); return timers.length }
  const window = { location: { pathname }, Element, setTimeout }
  if (unsupported !== "matchMedia") window.matchMedia = () => ({ matches: reduced })
  if (unsupported !== "IntersectionObserver") window.IntersectionObserver = class {}
  vm.runInNewContext(config.motionBootstrap, {
    window, document: { documentElement: html }, Element, setTimeout,
    matchMedia: window.matchMedia, IntersectionObserver: window.IntersectionObserver,
  })
  return { html, timers, state: () => html.getAttribute("data-scrap-motion") }
}

test("direct portfolio loads prepare motion before hydration and install a short fail-open timer", () => {
  const env = bootstrap()
  assert.equal(env.state(), "pending")
  assert.ok(env.timers.some(timer => timer.delay === 1800))
})

test("the root route prepares the single portfolio experience", () => {
  const env = bootstrap({ pathname: "/" })
  assert.equal(env.state(), "pending")
  env.timers.forEach(timer => timer.callback())
  assert.equal(env.state(), "expired")
})

test("reduced motion does not prepare hidden content", () => {
  const env = bootstrap({ reduced: true })
  assert.notEqual(env.state(), "pending")
  assert.notEqual(env.state(), "active")
})

test("unsupported browser APIs leave content visible instead of waiting for impossible animations", () => {
  for (const unsupported of ["matchMedia", "IntersectionObserver", "animate"]) {
    const env = bootstrap({ unsupported })
    assert.notEqual(env.state(), "pending", unsupported)
    assert.notEqual(env.state(), "active", unsupported)
  }
})

test("a hydration failure expires the preparation gate", () => {
  const env = bootstrap()
  assert.equal(env.state(), "pending")
  env.timers.forEach(timer => timer.callback())
  assert.equal(env.state(), "expired")
})

test("the fail-open timer never interrupts an active animation controller", () => {
  const env = bootstrap()
  env.html.setAttribute("data-scrap-motion", "active")
  env.timers.forEach(timer => timer.callback())
  assert.equal(env.state(), "active")
})

test("prepaint hiding is motion-preference and JavaScript-state gated, and completed targets are exempt", () => {
  const css = config.motionPrepaintStyles
  assert.match(css, /@media\s*\(\s*prefers-reduced-motion\s*:\s*no-preference\s*\)/)
  assert.match(css, /\[data-scrap-motion\s*=\s*["']?pending["']?\]/)
  assert.match(css, /\[data-scrap-motion\s*=\s*["']?active["']?\]/)
  assert.match(css, /:not\(\[data-motion-state\s*=\s*["']?visible["']?\]\)/)
  assert.doesNotMatch(css, /\[data-scrap-motion\s*=\s*["']?(?:idle|expired)["']?\]/)
})

test("motion targets do not fade an entire hero column or chapter as one chunk", () => {
  const selectors = config.motionTargets.map(([selector]) => selector).join(", ")
  assert.ok(selectors.includes("[data-reveal]"))
  assert.doesNotMatch(selectors, /\.scrap-hero-copy\b|\.scrap-chapter(?=[\s,.#\[]|$)/)
})

const heroSource = ts.createSourceFile("hero-section.tsx", readFileSync(new URL("components/hero-section.tsx", root), "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
const heroElements = []
function visit(node) {
  if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) heroElements.push(node)
  ts.forEachChild(node, visit)
}
visit(heroSource)
function attribute(node, name) {
  const attr = node.attributes.properties.find(property => ts.isJsxAttribute(property) && property.name.getText(heroSource) === name)
  if (!attr) return undefined
  if (!attr.initializer) return true
  if (ts.isStringLiteral(attr.initializer)) return attr.initializer.text
  return attr.initializer.expression?.getText(heroSource)
}
function handwritten(field) {
  return heroElements.find(node => node.tagName.getText(heroSource) === "Handwritten" && attribute(node, "text") === "hero." + field)
}

test("hero greeting is letter-split in its own early beat", () => {
  const greeting = handwritten("greeting")
  assert.ok(greeting, "greeting must use the accessible split-text component")
  assert.equal(Number(attribute(greeting, "phase")), 0.1)
  assert.notEqual(attribute(greeting, "variant"), "words")
})

test("hero title lines reveal words separately and in reading order", () => {
  const title = handwritten("title")
  const accent = handwritten("titleAccent")
  assert.ok(title)
  assert.ok(accent)
  assert.equal(attribute(title, "variant"), "words")
  assert.equal(attribute(accent, "variant"), "words")
  assert.ok(Number(attribute(title, "phase")) > 0.1)
  assert.ok(Number(attribute(accent, "phase")) > Number(attribute(title, "phase")))
})

test("hero supporting content has independent reveal targets with explicit phases", () => {
  const reveals = heroElements.filter(node => attribute(node, "data-reveal") !== undefined)
  assert.ok(reveals.length >= 3, "eyebrow, introduction and links need independent entrances")
  assert.ok(reveals.every(node => Number.isFinite(Number(attribute(node, "data-motion-phase")))))
  assert.ok(new Set(reveals.map(node => attribute(node, "data-motion-phase"))).size >= 3)
  assert.ok(reveals.every(node => attribute(node, "className") !== "scrap-hero-copy"))
})
