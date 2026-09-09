import assert from "node:assert/strict"
import test from "node:test"
import { readFileSync } from "node:fs"
import vm from "node:vm"
import ts from "typescript"

const compiled = ts.transpileModule(readFileSync(new URL("../lib/doodle-scroll.ts", import.meta.url), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText
const pure = {}
vm.runInNewContext(compiled, { exports: pure })

test("initial hero marks start blank and draw progressively with scroll", () => {
  assert.equal(pure.doodleProgress(100, 0, 800, 3000), 0)
  assert.equal(pure.doodleProgress(10, 90, 800, 3000), .5)
  assert.equal(pure.doodleProgress(-80, 180, 800, 3000), 1)
})
test("offscreen marks enter near the bottom and complete near mid-view", () => {
  assert.equal(pure.doodleProgress(1000, 0, 800, 3000), 0)
  const start = 1000 - 800 * .92
  const end = 1000 - 800 * .48
  const middle = (start + end) / 2
  assert.equal(pure.doodleProgress(1000 - middle, middle, 800, 3000), .5)
  assert.equal(pure.doodleProgress(1000 - end, end, 800, 3000), 1)
})
test("footer completes at the bottom, no-scroll pages stay visible, and progress clamps", () => {
  assert.equal(pure.doodleProgress(760, 3000, 800, 3000), 1)
  assert.equal(pure.doodleProgress(100, 0, 800, 0), 1)
  assert.equal(pure.doodleProgress(110, -10, 800, 3000), 0)
  assert.equal(pure.doodleProgress(-800, 4000, 800, 3000), 1)
})

function setup(scrollY = 0) {
  const animations = [], events = [], frames = new Map(), listeners = new Map()
  let nextFrame = 0
  const window = { innerHeight: 800, scrollY, addEventListener: (type, fn) => listeners.set(type, fn), removeEventListener: type => listeners.delete(type) }
  function mark(documentTop) {
    const path = { animate(keyframes, options) {
      const animation = { keyframes, options, time: null, paused: false, cancelled: false,
        pause() { this.paused = true; events.push("pause") },
        set currentTime(value) { this.time = value; events.push("seek") },
        get currentTime() { return this.time },
        play() { assert.fail("scroll doodles must never play on a timer") },
        cancel() { this.cancelled = true },
      }
      animations.push(animation)
      return animation
    } }
    return { isConnected: true, visible: false, querySelectorAll: () => [path],
      getBoundingClientRect: () => ({ top: documentTop - window.scrollY }),
      setAttribute(name, value) { assert.equal(name, "data-motion-state"); this.visible = value === "visible"; events.push("visible") },
    }
  }
  const first = mark(100)
  const marks = [first]
  const page = { querySelectorAll: () => marks }
  const exports = {}
  vm.runInNewContext(compiled, { exports, window, document: { documentElement: { scrollHeight: 3800 } },
    requestAnimationFrame: fn => { const id = ++nextFrame; frames.set(id, fn); return id },
    cancelAnimationFrame: id => frames.delete(id),
  })
  const controller = exports.setupDoodleScroll(page)
  function tick() { const pending = [...frames.values()]; frames.clear(); pending.forEach(fn => fn()) }
  return { window, animations, events, frames, listeners, marks, mark, first, controller, tick }
}
test("first stroke frame exists before the SVG is shown; scrolling pauses and reverses", () => {
  const env = setup()
  assert.deepEqual(env.events.slice(0, 3), ["pause", "seek", "visible"])
  assert.ok(env.animations[0].paused)
  assert.equal(env.animations[0].currentTime, 0)
  env.window.scrollY = 90
  env.listeners.get("scroll")()
  env.listeners.get("scroll")()
  assert.equal(env.frames.size, 1)
  env.tick()
  assert.equal(env.animations[0].currentTime, 500)
  env.tick()
  assert.equal(env.animations[0].currentTime, 500)
  env.window.scrollY = 0
  env.listeners.get("scroll")()
  env.tick()
  assert.equal(env.animations[0].currentTime, 0)
  env.controller.dispose()
})
test("restored scroll is correct immediately and resize updates are scheduled", () => {
  const env = setup(180)
  assert.equal(env.animations[0].currentTime, 1000)
  env.listeners.get("resize")()
  assert.equal(env.frames.size, 1)
  env.controller.dispose()
  assert.equal(env.frames.size, 0)
})
test("refresh registers new marks and cleanup restores visible static ink", () => {
  const env = setup()
  const second = env.mark(1200)
  env.marks.push(second)
  env.controller.refresh()
  assert.equal(env.animations.length, 2)
  env.first.isConnected = false
  env.marks.shift()
  env.controller.refresh()
  assert.ok(env.animations[0].cancelled)
  env.listeners.get("scroll")()
  env.controller.dispose()
  assert.ok(env.animations.every(animation => animation.cancelled))
  assert.equal(env.listeners.size, 0)
  assert.equal(env.frames.size, 0)
  assert.ok(second.visible)
})
