import assert from "node:assert/strict"
import test from "node:test"
import { readFileSync } from "node:fs"
import vm from "node:vm"
import ts from "typescript"

const source = readFileSync(new URL("../components/scrapbook-motion.tsx", import.meta.url), "utf8")
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText

function setup(reduced = false) {
  const animations = [], observers = [], mutations = []
  class Element {
    constructor(selectors = [], children = []) { this.selectors = selectors; this.children = children; this.isConnected = true; this.listeners = new Map() }
    matches(selector) { return selector.split(", ").some(part => this.selectors.includes(part)) }
    querySelectorAll(selector) { return this.children.flatMap(child => [...(child.matches(selector) ? [child] : []), ...child.querySelectorAll(selector)]) }
    contains(element) { return this === element || this.children.some(child => child.contains(element)) }
    addEventListener(type, listener) { this.listeners.set(type, listener) }
    removeEventListener(type) { this.listeners.delete(type) }
    animate(frames, options) {
      const animation = { element: this, frames, options, cancelled: false, cancel() { this.cancelled = true; this.oncancel?.() } }
      animations.push(animation)
      return animation
    }
  }
  class Observer {
    constructor(callback) { this.callback = callback; this.elements = new Set(); this.disconnected = false; observers.push(this) }
    observe(element) { this.elements.add(element) }
    unobserve(element) { this.elements.delete(element) }
    disconnect() { this.disconnected = true; this.elements.clear() }
    enter(element) { this.callback([{ target: element, isIntersecting: true }]) }
  }
  class Mutations {
    constructor(callback) { this.callback = callback; mutations.push(this) }
    observe() {}
    disconnect() { this.disconnected = true }
  }
  const preference = new Element()
  preference.matches = reduced
  const ink = new Element(["[data-ink]"])
  const writing = new Element(["[data-write]"], [ink])
  const note = new Element([".scrap-postit"], [writing])
  const path = new Element(["path"])
  const doodle = new Element(["[data-doodle]"], [path])
  const page = new Element([], [note, doodle])
  let cleanup
  const exports = {}
  vm.runInNewContext(compiled, {
    exports, Element, IntersectionObserver: Observer, MutationObserver: Mutations,
    window: { IntersectionObserver: Observer, matchMedia: () => preference },
    document: { getElementById: () => page },
    require: name => { assert.equal(name, "react"); return { useEffect: effect => { cleanup = effect() } } },
  })
  exports.ScrapbookMotion()
  return { Element, page, note, writing, ink, doodle, path, preference, animations, observers, mutations, cleanup }
}

test("reduced motion leaves content visible without registering entrances", () => {
  const env = setup(true)
  assert.equal(env.observers.length, 0)
  assert.equal(env.animations.length, 0)
  env.cleanup()
})

test("an entrance only plays once, and focusing a note ends its motion", () => {
  const env = setup()
  const observer = env.observers[0]
  observer.enter(env.note)
  assert.equal(env.animations.length, 1)
  observer.enter(env.note)
  assert.equal(env.animations.length, 1)
  env.page.listeners.get("focusin")({ target: env.ink })
  assert.equal(env.animations[0].cancelled, true)
  assert.equal(observer.elements.has(env.writing), false)
  env.cleanup()
})

test("doodle strokes animate and newly selected note text is registered", () => {
  const env = setup()
  env.observers[0].enter(env.doodle)
  assert.equal(env.animations[0].element, env.path)
  assert.equal(env.animations[0].frames[0].strokeDashoffset, 1)
  const letter = new env.Element(["[data-ink]"])
  const nextWriting = new env.Element(["[data-write]"], [letter])
  env.mutations[0].callback([{ addedNodes: [nextWriting] }])
  env.observers[0].enter(nextWriting)
  assert.equal(env.animations.at(-1).element, letter)
  env.cleanup()
})

test("changing motion preference and unmounting cancel animations and observers", () => {
  const env = setup()
  env.observers[0].enter(env.note)
  env.observers[0].enter(env.writing)
  env.preference.matches = true
  env.preference.listeners.get("change")()
  assert.ok(env.animations.every(animation => animation.cancelled))
  assert.ok(env.observers[0].disconnected)
  assert.ok(env.mutations[0].disconnected)
  assert.equal(env.page.listeners.size, 0)
  env.cleanup()
  assert.equal(env.preference.listeners.size, 0)
})
