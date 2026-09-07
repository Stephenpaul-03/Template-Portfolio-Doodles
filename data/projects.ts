export type Project = {
  title: string
  description: string
  tags: readonly string[]
  thumbnail: string
  link: string
  year: string
}

export const projects = [
  {
    title: "Field Notes",
    description: "A calmer research workspace that turns scattered observations into useful product decisions.",
    tags: ["Product design", "Research", "React"],
    thumbnail: "/images/projects/field-notes.svg",
    link: "#contact",
    year: "2026",
  },
  {
    title: "Common Ground",
    description: "An identity and digital home for a neighborhood initiative built around shared local resources.",
    tags: ["Brand system", "Web design", "Strategy"],
    thumbnail: "/images/projects/common-ground.svg",
    link: "#contact",
    year: "2025",
  },
  {
    title: "Signal / Noise",
    description: "A focused monitoring tool that helps small teams see the changes that actually need attention.",
    tags: ["UX", "Prototyping", "TypeScript"],
    thumbnail: "/images/projects/signal-noise.svg",
    link: "#contact",
    year: "2025",
  },
  {
    title: "After Hours",
    description: "An editorial archive for conversations with people who keep making things after the workday ends.",
    tags: ["Editorial", "Art direction", "Development"],
    thumbnail: "/images/projects/after-hours.svg",
    link: "#contact",
    year: "2024",
  },
] as const satisfies readonly Project[]
