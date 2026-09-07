export type Project = {
  title: string
  description: string
  overview: string
  tags: readonly string[]
  thumbnail: string
  year: string
  role: string
  timeline: string
  outcomes: readonly string[]
  links: readonly {
    label: string
    href: string
  }[]
}

export const projects = [
  {
    title: "Field Notes",
    description: "A calmer research workspace that turns scattered observations into useful product decisions.",
    overview: "Field Notes explores how product teams can keep the nuance of raw research without losing the speed of a shared workspace. The system connects observations, themes, and decisions without forcing every study into the same rigid template.",
    tags: ["Product design", "Research", "React"],
    thumbnail: "/images/projects/field-notes.svg",
    year: "2026",
    role: "Product design · Front-end prototype",
    timeline: "8 weeks",
    outcomes: ["Reduced the path from note to insight", "Created a flexible evidence model", "Tested the workflow with a clickable prototype"],
    links: [{ label: "Request full case study", href: "mailto:hello@example.com?subject=Field Notes case study" }],
  },
  {
    title: "Common Ground",
    description: "An identity and digital home for a neighborhood initiative built around shared local resources.",
    overview: "A warm, practical identity system for an initiative that helps neighbors share spaces, tools, and time. The work spans positioning, visual language, service touchpoints, and a small editorial website.",
    tags: ["Brand system", "Web design", "Strategy"],
    thumbnail: "/images/projects/common-ground.svg",
    year: "2025",
    role: "Brand strategy · Design direction",
    timeline: "10 weeks",
    outcomes: ["Unified six community programs", "Built an accessible visual toolkit", "Established a repeatable editorial system"],
    links: [{ label: "Ask about the project", href: "mailto:hello@example.com?subject=Common Ground project" }],
  },
  {
    title: "Signal / Noise",
    description: "A focused monitoring tool that helps small teams see the changes that actually need attention.",
    overview: "Signal / Noise is a dashboard concept designed around attention rather than volume. It groups related changes, explains why they matter, and gives teams a calmer way to move from notification to action.",
    tags: ["UX", "Prototyping", "TypeScript"],
    thumbnail: "/images/projects/signal-noise.svg",
    year: "2025",
    role: "UX design · Interaction prototype",
    timeline: "6 weeks",
    outcomes: ["Prioritized changes by consequence", "Designed progressive detail states", "Validated navigation across screen sizes"],
    links: [{ label: "Request prototype access", href: "mailto:hello@example.com?subject=Signal / Noise prototype" }],
  },
  {
    title: "After Hours",
    description: "An editorial archive for conversations with people who keep making things after the workday ends.",
    overview: "An independent editorial experiment about creative lives that do not fit neatly into job titles. Each issue pairs a long-form conversation with studio fragments, reading lists, and process notes.",
    tags: ["Editorial", "Art direction", "Development"],
    thumbnail: "/images/projects/after-hours.svg",
    year: "2024",
    role: "Concept · Art direction · Build",
    timeline: "Ongoing",
    outcomes: ["Created a flexible issue format", "Balanced long-form reading with visual pacing", "Built a lightweight publishing workflow"],
    links: [{ label: "Discuss the archive", href: "mailto:hello@example.com?subject=After Hours archive" }],
  },
] as const satisfies readonly Project[]
