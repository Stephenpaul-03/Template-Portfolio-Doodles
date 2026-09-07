import Image from "next/image"

import { SectionHeading } from "@/components/section-heading"

const skills = ["Product thinking", "Interaction design", "Visual systems", "Prototyping", "Front-end development", "Creative direction"]

export function AboutSection() {
  return (
    <section id="about" className="scroll-mt-20 bg-[#e8e3d8]">
      <div className="mx-auto max-w-[90rem] px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <SectionHeading eyebrow="About" title="Curious by default. Practical when it counts." />
        <div className="mt-14 grid gap-10 md:grid-cols-12 lg:mt-20">
          <div className="relative aspect-[4/5] overflow-hidden bg-[#c8c0b2] md:col-span-5 lg:col-span-4">
            <Image src="/images/portrait-placeholder.svg" alt="Portrait placeholder for Steve" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" />
          </div>
          <div className="md:col-span-6 md:col-start-7 lg:col-span-6 lg:col-start-7">
            <p className="text-xl leading-8 tracking-[-0.02em] text-stone-800 sm:text-2xl sm:leading-9">
              I&apos;m Steve, a designer and builder interested in the point where complicated systems become simple, useful experiences.
            </p>
            <p className="mt-6 max-w-xl text-base leading-7 text-stone-600">
              This space is ready for the short version of your story: how you work, what you care about, and the perspective you bring to a team. Replace this copy when your final bio is ready.
            </p>
            <div className="mt-12 border-t border-stone-900/20 pt-5">
              <p className="mb-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">Capabilities</p>
              <ul className="grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                {skills.map((skill) => <li key={skill} className="border-b border-stone-900/10 py-3 text-sm">{skill}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
