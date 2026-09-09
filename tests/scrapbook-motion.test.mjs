import assert from "node:assert/strict"
import test from "node:test"
import { readFileSync } from "node:fs"
import vm from "node:vm"
import ts from "typescript"

const source = readFileSync(new URL("../components/scrapbook-motion.tsx", import.meta.url), "utf8")
const configSource = readFileSync(new URL("../lib/scrapbook-motion-config.ts", import.meta.url), "utf8")
const compilerOptions = { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 }
const compiled = ts.transpileModule(source, { compilerOptions }).outputText
const config = {}
vm.runInNewContext(ts.transpileModule(configSource, { compilerOptions }).outputText, { exports: config })

function setup(reduced = false, rootState = reduced ? null : "pending") {
  const animations = [], observers = [], mutations = [], events = [], frames = new Map()
  let nextFrame = 0
  class Element {
    constructor(selectors = [], children = [], attributes = {}) {
      this.selectors = selectors; this.children = children; this.attributes = new Map(Object.entries(attributes))
      this.isConnected = true; this.listeners = new Map(); this.top = 100
      for (const selector of selectors) {
        const attribute = selector.match(/^\[([^=\]]+)(?:="([^"]*)")?\]$/)
        if (attribute && !this.attributes.has(attribute[1])) this.attributes.set(attribute[1], attribute[2] ?? "")
      }
      children.forEach(child => { child.parent = this })
    }
    matches(selector) {
      return selector.split(",").some(value => {
        const part = value.trim()
        const attribute = part.match(/^\[([^=\]]+)(?:="([^"]*)")?\]$/)
        if (attribute) return this.attributes.has(attribute[1]) && (attribute[2] === undefined || this.attributes.get(attribute[1]) === attribute[2])
        return this.selectors.includes(part)
      })
    }
    querySelectorAll(selector) { return this.children.flatMap(child => [...(child.matches(selector) ? [child] : []), ...child.querySelectorAll(selector)]) }
    querySelector(selector) { return this.querySelectorAll(selector)[0] ?? null }
    contains(element) { return this === element || this.children.some(child => child.contains(element)) }
    closest(selector) { return this.matches(selector) ? this : this.parent?.closest(selector) ?? null }
    getBoundingClientRect() { return { top: this.top } }
    getAttribute(name) { return this.attributes.get(name) ?? null }
    setAttribute(name, value) { this.attributes.set(name, String(value)); events.push({ type: "attribute", element: this, name, value: String(value) }) }
    removeAttribute(name) { this.attributes.delete(name); events.push({ type: "remove", element: this, name }) }
    addEventListener(type, listener) { this.listeners.set(type, listener) }
    removeEventListener(type) { this.listeners.delete(type) }
    animate(keyframes, options) {
      const timing = { ...options }
      let currentTime = null
      const animation = {
        element: this, frames: keyframes, options: timing, cancelled: false, played: false,
        effect: { getTiming: () => timing, updateTiming: next => Object.assign(timing, next) },
        get currentTime() { return currentTime },
        set currentTime(value) { currentTime = value; events.push({ type: "seek", element: this.element, animation: this, value }) },
        pause() { this.paused = true; events.push({ type: "pause", element: this.element, animation: this }) },
        play() { this.played = true; this.paused = false },
        cancel() { this.cancelled = true },
        finish() { this.onfinish?.() },
      }
      animations.push(animation)
      return animation
    }
  }
  class Observer {
    constructor(callback) { this.callback = callback; this.elements = new Set(); this.disconnected = false; observers.push(this) }
    observe(element) { this.elements.add(element) }
    unobserve(element) { this.elements.delete(element) }
    disconnect() { this.disconnected = true; this.elements.clear() }
    enter(...elements) { this.callback(elements.map(target => ({ target, isIntersecting: true }))) }
    leave(...elements) { this.callback(elements.map(target => ({ target, isIntersecting: false }))) }
  }
  class Mutations {
    constructor(callback) { this.callback = callback; mutations.push(this) }
    observe() {}
    disconnect() { this.disconnected = true }
  }
  const preference = new Element()
  preference.matches = reduced
  const html = new Element([], [], rootState === null ? {} : { "data-scrap-motion": rootState })
  const ink = new Element(["[data-ink]"])
  const writing = new Element(["[data-write]"], [ink])
  const note = new Element([".scrap-postit"], [writing])
  const heading = new Element(["[data-reveal]"])
  const path = new Element(["path"])
  const underline = new Element(["[data-underline]"], [path])
  const doodle = new Element(["[data-doodle]"])
  const header = new Element([".scrap-header-inner"])
  const doodleLifecycles = []
  // Drawing targets may precede text in DOM order, but phases win.
  const section = new Element(['[data-motion-section="hero"]'], [underline, heading, note, doodle])
  const secondHeading = new Element(["[data-reveal]"])
  const secondSection = new Element(["[data-motion-section]"], [secondHeading])
  const page = new Element([], [header, section, secondSection])
  let cleanup
  const exports = {}
  vm.runInNewContext(compiled, {
    exports, Element, IntersectionObserver: Observer, MutationObserver: Mutations,
    requestAnimationFrame: callback => { const id = ++nextFrame; frames.set(id, callback); return id },
    cancelAnimationFrame: id => frames.delete(id),
    window: { innerHeight: 800, IntersectionObserver: Observer, matchMedia: () => preference },
    document: { getElementById: () => page, documentElement: html },
    require: name => {
      if (name === "@/lib/scrapbook-motion-config") return config
      if (name === "@/lib/doodle-scroll") return { setupDoodleScroll: () => { const lifecycle = { refreshed: 0, disposed: false, refresh() { this.refreshed++ }, dispose() { this.disposed = true } }; doodleLifecycles.push(lifecycle); return lifecycle } }
      assert.equal(name, "react")
      return { useLayoutEffect: effect => { cleanup = effect() } }
    },
  })
  exports.ScrapbookMotion()
  function tick() { const pending = [...frames.values()]; frames.clear(); pending.forEach(callback => callback()) }
  function finishPlaying() { animations.filter(animation => animation.played && !animation.cancelled).forEach(animation => animation.finish()); tick() }
  const playing = () => animations.filter(animation => animation.played && !animation.cancelled).map(animation => animation.element)
  const isGated = element => !preference.matches && ["pending", "active"].includes(html.getAttribute("data-scrap-motion")) && element.getAttribute("data-motion-state") !== "visible"
  return { Element, page, html, section, secondHeading, heading, note, writing, ink, underline, doodle, header, doodleLifecycles, path, preference, animations, observers, mutations, events, frames, cleanup, tick, finishPlaying, playing, isGated }
}

test("reduced motion leaves content visible without registering entrances", () => {
  const env = setup(true)
  assert.equal(env.observers.length, 0)
  assert.equal(env.animations.length, 0)
  env.cleanup()
})

test("simultaneous intersections play heading, underline, paper, then handwriting", () => {
  const env = setup()
  env.observers[0].enter(env.underline, env.writing, env.note, env.heading)
  env.tick()
  assert.deepEqual(env.playing(), [env.heading])
  assert.ok(env.animations.filter(animation => animation.element !== env.heading).every(animation => animation.paused))
  env.finishPlaying()
  assert.deepEqual(env.playing(), [env.path])
  env.finishPlaying()
  assert.deepEqual(env.playing(), [env.note])
  env.finishPlaying()
  assert.deepEqual(env.playing(), [env.ink])
  assert.equal(env.animations.find(animation => animation.element === env.path).frames[0].strokeDashoffset, 1)
  env.finishPlaying()
  assert.deepEqual(env.playing(), [])
  env.cleanup()
})

test("same-stage cards stagger, and handwriting waits for the entire paper stage", () => {
  const env = setup()
  const second = new env.Element([".scrap-postit"])
  second.parent = env.section
  env.mutations[0].callback([{ addedNodes: [second] }])
  env.observers[0].enter(env.note, second, env.writing)
  env.tick()
  const papers = env.animations.filter(animation => animation.played)
  assert.deepEqual(papers.map(animation => animation.options.delay), [0, 60])
  papers[0].finish()
  env.tick()
  assert.ok(!env.playing().includes(env.ink))
  papers[1].finish()
  env.tick()
  assert.deepEqual(env.playing(), [env.ink])
  env.cleanup()
})

test("fast scrolling completes queued and active items without delaying the next section", () => {
  const env = setup()
  env.observers[0].enter(env.heading, env.note, env.writing, env.underline, env.secondHeading)
  env.tick()
  assert.deepEqual(env.playing(), [env.heading])
  env.observers[0].leave(env.heading, env.note, env.writing, env.underline)
  env.tick()
  assert.deepEqual(env.playing(), [env.secondHeading])
  assert.ok(env.animations.filter(animation => animation.element !== env.secondHeading).every(animation => animation.cancelled))
  env.cleanup()
})

test("entrances play once, and focus completes pending child handwriting", () => {
  const env = setup()
  env.observers[0].enter(env.note, env.writing)
  env.tick()
  env.observers[0].enter(env.note)
  assert.equal(env.animations.length, 2)
  env.page.listeners.get("focusin")({ target: env.ink })
  assert.ok(env.animations.every(animation => animation.cancelled))
  assert.equal(env.observers[0].elements.has(env.writing), false)
  env.observers[0].enter(env.note, env.writing)
  env.tick()
  assert.equal(env.animations.length, 2)
  env.cleanup()
})

test("newly selected note text is registered and removed text is released", () => {
  const env = setup()
  env.observers[0].enter(env.note, env.writing)
  env.tick()
  env.page.listeners.get("pointerdown")({ target: env.note })
  const letter = new env.Element(["[data-ink]"])
  const nextWriting = new env.Element(["[data-write]"], [letter])
  nextWriting.parent = env.note
  env.writing.isConnected = false
  env.mutations[0].callback([{ addedNodes: [nextWriting] }])
  env.observers[0].enter(nextWriting)
  env.tick()
  assert.deepEqual(env.playing(), [letter])
  assert.equal(env.observers[0].elements.has(env.writing), false)
  env.cleanup()
})

test("underline waits for the section introduction to reach the viewport", () => {
  const env = setup()
  env.heading.top = 1000
  env.observers[0].enter(env.underline)
  env.tick()
  assert.deepEqual(env.playing(), [])
  env.heading.top = 700
  env.observers[0].enter(env.heading)
  env.tick()
  assert.deepEqual(env.playing(), [env.heading])
  env.finishPlaying()
  assert.deepEqual(env.playing(), [env.path])
  env.cleanup()
})

test("preference changes and unmounting cancel active and paused animations", () => {
  const env = setup()
  env.observers[0].enter(env.note, env.writing, env.underline)
  env.tick()
  env.preference.matches = true
  env.preference.listeners.get("change")()
  assert.ok(env.animations.every(animation => animation.cancelled))
  assert.ok(env.observers[0].disconnected)
  assert.ok(env.mutations[0].disconnected)
  assert.equal(env.page.listeners.size, 0)
  assert.equal(env.frames.size, 0)
  env.cleanup()
  assert.equal(env.preference.listeners.size, 0)
})

test("layout registration keeps targets CSS-gated before the first observer callback", () => {
  const env = setup()
  assert.equal(env.html.getAttribute("data-scrap-motion"), "active")
  assert.equal(env.animations.length, 0)
  assert.equal(env.frames.size, 0)
  for (const target of [env.heading, env.note, env.writing, env.underline, env.secondHeading]) {
    assert.ok(env.observers[0].elements.has(target))
    assert.ok(env.isGated(target))
  }
  env.cleanup()
  assert.equal(env.html.getAttribute("data-scrap-motion"), "idle")
  for (const target of [env.heading, env.note, env.writing, env.underline, env.secondHeading]) {
    assert.equal(target.getAttribute("data-motion-state"), "visible")
    assert.equal(env.isGated(target), false)
  }
})

test("each first frame is paused and positioned at zero before the visible CSS handoff", () => {
  const env = setup()
  env.observers[0].enter(env.heading, env.note, env.writing, env.underline)
  assert.deepEqual(env.playing(), [])
  for (const target of [env.heading, env.note, env.writing, env.underline]) {
    const visible = env.events.findIndex(event => event.type === "attribute" && event.element === target && event.name === "data-motion-state" && event.value === "visible")
    assert.ok(visible >= 0)
    const ownAnimations = env.animations.filter(animation => animation.element === target || target === env.writing && animation.element === env.ink || target === env.underline && animation.element === env.path)
    assert.ok(ownAnimations.length > 0)
    for (const animation of ownAnimations) {
      const paused = env.events.findIndex(event => event.type === "pause" && event.animation === animation)
      const positioned = env.events.findIndex(event => event.type === "seek" && event.animation === animation && event.value === 0)
      assert.ok(paused >= 0 && paused < positioned && positioned < visible)
      assert.equal(animation.currentTime, 0)
      assert.ok(animation.paused)
      assert.equal(animation.options.fill, "backwards")
    }
    assert.equal(env.isGated(target), false)
  }
  assert.ok(env.isGated(env.secondHeading), "offscreen content keeps its preparatory gate")
  env.cleanup()
})

test("late hydration refuses to rehide content after timeout or without a working bootstrap", () => {
  for (const state of ["expired", null]) {
    const env = setup(false, state)
    assert.equal(env.html.getAttribute("data-scrap-motion"), state)
    assert.equal(env.observers.length, 0)
    assert.equal(env.animations.length, 0)
    assert.equal(env.isGated(env.heading), false)
    env.cleanup()
  }
})

test("client navigation from the landing page can prepare targets before paint", () => {
  const env = setup(false, "idle")
  assert.equal(env.html.getAttribute("data-scrap-motion"), "active")
  assert.ok(env.isGated(env.heading))
  assert.equal(env.observers.length, 1)
  env.cleanup()
})

test("greeting letters complete before word-by-word title lines in later decimal phases", () => {
  const env = setup()
  const letters = [new env.Element(["[data-ink]"]), new env.Element(["[data-ink]"]), new env.Element(["[data-ink]"])]
  const greeting = new env.Element(["[data-write]"], letters, { "data-motion-phase": "0.1" })
  const titleWords = [new env.Element([".scrap-written-word"]), new env.Element([".scrap-written-word"])]
  const title = new env.Element(['[data-write="words"]'], titleWords, { "data-motion-phase": "0.2" })
  const accentWord = new env.Element([".scrap-written-word"])
  const accent = new env.Element(['[data-write="words"]'], [accentWord], { "data-motion-phase": "0.3" })
  for (const target of [greeting, title, accent]) { target.parent = env.section; env.section.children.push(target) }
  env.mutations[0].callback([{ addedNodes: [greeting, title, accent] }])
  env.observers[0].enter(accent, env.note, title, greeting, env.heading)
  env.tick()
  assert.deepEqual(env.playing(), [env.heading])
  env.finishPlaying()
  assert.deepEqual(env.playing(), letters)
  const greetingAnimations = env.animations.filter(animation => letters.includes(animation.element))
  assert.deepEqual(greetingAnimations.map(animation => animation.options.delay), [0, 24, 48])
  greetingAnimations.slice(0, 2).forEach(animation => animation.finish())
  env.tick()
  assert.deepEqual(env.playing(), [letters[2]])
  greetingAnimations[2].finish()
  env.tick()
  assert.deepEqual(env.playing(), titleWords)
  const titleAnimations = env.animations.filter(animation => titleWords.includes(animation.element))
  assert.deepEqual(titleAnimations.map(animation => animation.options.delay), [0, 85])
  assert.ok(titleAnimations.every(animation => animation.options.duration === 180))
  env.finishPlaying()
  assert.deepEqual(env.playing(), [accentWord])
  env.finishPlaying()
  assert.deepEqual(env.playing(), [env.note])
  env.cleanup()
})

test("turning reduced motion on then off never hides already exposed content again", () => {
  const env = setup()
  env.observers[0].enter(env.heading, env.note, env.writing)
  env.tick()
  env.preference.matches = true
  env.preference.listeners.get("change")()
  assert.equal(env.html.getAttribute("data-scrap-motion"), "idle")
  assert.ok(env.animations.every(animation => animation.cancelled))
  const animationCount = env.animations.length
  env.preference.matches = false
  env.preference.listeners.get("change")()
  assert.equal(env.html.getAttribute("data-scrap-motion"), "idle")
  assert.equal(env.observers.length, 1)
  assert.equal(env.animations.length, animationCount)
  for (const target of [env.heading, env.note, env.writing, env.underline, env.secondHeading]) {
    assert.equal(target.getAttribute("data-motion-state"), "visible")
    assert.equal(env.isGated(target), false)
  }
  env.cleanup()
})

test("starting with reduced motion keeps static content visible when the preference later changes", () => {
  const env = setup(true)
  env.preference.matches = false
  env.preference.listeners.get("change")()
  assert.equal(env.observers.length, 0)
  assert.equal(env.animations.length, 0)
  assert.equal(env.isGated(env.heading), false)
  env.cleanup()
})

test("reduced motion between bootstrap and hydration releases pending CSS permanently", () => {
  const env = setup(true, "pending")
  assert.equal(env.html.getAttribute("data-scrap-motion"), "idle")
  env.preference.matches = false
  env.preference.listeners.get("change")()
  assert.equal(env.html.getAttribute("data-scrap-motion"), "idle")
  assert.equal(env.observers.length, 0)
  assert.equal(env.isGated(env.heading), false)
  env.cleanup()
})

test("header waits for accent words and underline instead of appearing ahead of the hero", () => {
  const env = setup()
  const word = new env.Element([".scrap-written-word"])
  const accent = new env.Element(['[data-write="words"]'], [word], { "data-motion-phase": "0.3" })
  accent.parent = env.section
  env.mutations[0].callback([{ addedNodes: [accent] }])
  env.observers[0].enter(env.header, env.underline, accent)
  env.tick()
  assert.deepEqual(env.playing(), [word])
  env.finishPlaying()
  assert.deepEqual(env.playing(), [env.path])
  env.finishPlaying()
  assert.deepEqual(env.playing(), [env.header])
  env.cleanup()
})

test("doodles use an independent scroll lifecycle, never the timed entrance queue", () => {
  const env = setup()
  assert.equal(env.doodleLifecycles.length, 1)
  assert.equal(env.observers[0].elements.has(env.doodle), false)
  env.observers[0].enter(env.doodle)
  env.tick()
  assert.equal(env.animations.length, 0)
  env.mutations[0].callback([{ addedNodes: [] }])
  assert.equal(env.doodleLifecycles[0].refreshed, 1)
  env.preference.matches = true
  env.preference.listeners.get("change")()
  assert.equal(env.doodleLifecycles[0].disposed, true)
  env.cleanup()
  const reduced = setup(true)
  assert.equal(reduced.doodleLifecycles.length, 0)
  reduced.cleanup()
})
