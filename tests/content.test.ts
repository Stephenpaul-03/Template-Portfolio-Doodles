import assert from "node:assert/strict"
import test from "node:test"
import { existsSync, readFileSync, readdirSync } from "node:fs"
import ts from "typescript"

const root = new URL("../", import.meta.url)
const content = JSON.parse(readFileSync(new URL("data/portfolio.json", root), "utf8"))

test("content collections and copy are nonempty, and two-line fields keep both lines", () => {
  function visit(value, path) {
    if (typeof value === "string") assert.ok(value.trim(), path + " must not be empty")
    else if (Array.isArray(value)) {
      assert.ok(value.length, path + " must contain at least one item")
      value.forEach((item, index) => visit(item, path + "." + index))
    } else Object.entries(value).forEach(([key, item]) => visit(item, path + "." + key))
  }
  visit(content, "content")
  for (const section of ["site", "navigation", "hero", "about", "work", "journey", "hobbies", "contact", "ui"]) assert.ok(content[section])
  for (const lines of [content.hero.stamp, content.journey.education.signoff, content.contact.description]) assert.equal(lines.length, 2)
})

test("all configured local images and downloads exist", () => {
  const assets = [content.hero.photo.src, content.contact.resume.href, ...content.work.projects.map(project => project.thumbnail), ...content.hobbies.items.map(hobby => hobby.image)]
  for (const asset of assets) {
    assert.ok(asset.startsWith("/"))
    assert.ok(existsSync(new URL("public" + asset, root)), asset)
  }
})

test("navigation anchors, hobby IDs, links, and social icons stay usable", () => {
  const ids = ["top", "about", "work", "experience", "hobbies", "contact"]
  assert.deepEqual(content.navigation.links.map(link => link.href), ids.map(id => "#" + id))
  const hobbies = content.hobbies.items.map(hobby => hobby.id)
  assert.equal(new Set(hobbies).size, hobbies.length)
  for (const id of hobbies) assert.match(id, /^[a-z0-9-]+$/)
  for (const social of content.contact.socials) {
    assert.ok(["linkedin", "github", "instagram"].includes(social.icon))
    assert.equal(new URL(social.href).protocol, "https:")
  }
  const links = [...content.work.projects.flatMap(project => project.links), content.hero.workLink, content.hero.aboutLink, content.journey.future]
  for (const { href } of links) {
    if (href.startsWith("#")) assert.ok(ids.includes(href.slice(1)))
    else assert.ok(["https:", "mailto:"].includes(new URL(href).protocol))
  }
})

test("components contain no hardcoded editorial JSX text or accessible labels", () => {
  const files = readdirSync(new URL("components/", root)).filter(name => name.endsWith(".tsx")).map(name => "components/" + name)
  files.push("main.tsx")
  const hardcoded = []
  for (const file of files) {
    const source = ts.createSourceFile(file, readFileSync(new URL(file, root), "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)
    function visit(node) {
      if (ts.isJsxText(node) && /[A-Za-z]/.test(node.text)) hardcoded.push(file + ": " + node.text.trim())
      if (ts.isJsxAttribute(node) && ["alt", "title", "aria-label", "placeholder"].includes(node.name.getText(source)) && node.initializer && ts.isStringLiteral(node.initializer) && /[A-Za-z]/.test(node.initializer.text)) hardcoded.push(file + ": " + node.initializer.text)
      ts.forEachChild(node, visit)
    }
    visit(source)
  }
  assert.deepEqual(hardcoded, [])
})
