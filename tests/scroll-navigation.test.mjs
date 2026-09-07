import assert from "node:assert/strict"
import test from "node:test"
import { currentScrollSection } from "../lib/scroll-navigation.ts"

const ids = ["top", "about", "work", "experience", "hobbies", "contact"]
const positions = scroll => ids.map((id, index) => ({ id, top: index * 700 - scroll }))

test("starts at the introduction", () => {
  assert.equal(currentScrollSection(positions(0), 210, false), "top")
})
test("tracks each section at the reading line", () => {
  ids.forEach((id, index) => assert.equal(currentScrollSection(positions(index * 700), 210, false), id))
})
test("switches when a section crosses the reading line", () => {
  assert.equal(currentScrollSection(positions(489), 210, false), "top")
  assert.equal(currentScrollSection(positions(490), 210, false), "about")
})
test("updates when scrolling back up or jumping to an anchor", () => {
  assert.equal(currentScrollSection(positions(2900), 210, false), "hobbies")
  assert.equal(currentScrollSection(positions(800), 210, false), "about")
  assert.equal(currentScrollSection(positions(0), 210, false), "top")
})
test("selects contact at the bottom of a short final section", () => {
  assert.equal(currentScrollSection(positions(3150), 210, true), "contact")
})
test("handles changed viewport offsets and absent sections", () => {
  assert.equal(currentScrollSection(positions(470), 250, false), "about")
  assert.equal(currentScrollSection([], 210, false), "top")
})
