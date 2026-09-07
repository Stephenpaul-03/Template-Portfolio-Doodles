export type SectionPosition = { id: string; top: number }

// Positions are relative to the viewport, so restored scroll and anchor jumps
// use the same rule as wheel, touch, and keyboard scrolling.
export function currentScrollSection(sections: readonly SectionPosition[], readingLine: number, atBottom: boolean) {
  if (atBottom && sections.length) return sections[sections.length - 1].id
  let current = "top"
  for (const section of sections) {
    if (section.top <= readingLine) current = section.id
  }
  return current
}
