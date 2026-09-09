import portfolio from "./portfolio.json"

// All visitor-facing copy, links, and image paths have one editing source.
export const content = portfolio
export type Project = (typeof content.work.projects)[number]
export type Experience = (typeof content.journey.experience)[number]
export type Hobby = (typeof content.hobbies.items)[number]

export function withTitle(template: string, title: string) {
  return template.replaceAll("{title}", title)
}
