export type Experience = {
  company: string
  role: string
  period: string
  summary: string
  highlights: readonly string[]
}

export const experience = [
  {
    company: "Independent practice",
    role: "Product designer & builder",
    period: "2024 — Now",
    summary: "Partnering with small teams to turn early ideas and difficult product problems into clear, testable experiences.",
    highlights: ["Product direction and interaction design", "Design systems and working prototypes", "Close collaboration from framing through launch"],
  },
] as const satisfies readonly Experience[]

export const education = {
  institution: "University / Design School",
  qualification: "Degree or programme title",
  period: "20XX — 20XX",
  note: "A foundation in visual communication, interaction, and the habit of testing ideas through making.",
  focus: ["Interaction and systems", "Visual communication", "Research-led practice"],
} as const
