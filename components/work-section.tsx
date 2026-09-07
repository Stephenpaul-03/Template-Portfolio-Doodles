import { ArrowUpRight } from "lucide-react"
import Image from "next/image"

import { projects } from "@/data/projects"
import { SectionHeading } from "@/components/section-heading"

export function WorkSection() {
  return (
    <section id="work" className="mx-auto max-w-[90rem] scroll-mt-20 px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <SectionHeading eyebrow="Selected work" title="Useful things, thoughtfully made." introduction="A sample structure for case studies, product work, and independent experiments. Real project details can drop straight into the typed data file." />
      <div className="mt-14 grid gap-x-6 gap-y-12 md:grid-cols-2 lg:mt-20">
        {projects.map((project, index) => (
          <article key={project.title}>
            <a href={project.link} className="group block" aria-label={`View ${project.title} project`}>
              <div className="relative aspect-[4/3] overflow-hidden bg-stone-200">
                <Image
                  src={project.thumbnail}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                  priority={index < 2}
                />
              </div>
              <div className="flex items-start justify-between gap-5 border-b border-stone-900/15 py-5">
                <div>
                  <h3 className="text-xl font-medium tracking-[-0.025em] sm:text-2xl">{project.title}</h3>
                  <p className="mt-2 max-w-xl text-sm leading-6 text-stone-600 sm:text-base">{project.description}</p>
                </div>
                <ArrowUpRight className="mt-1 size-5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </div>
              <div className="mt-3 flex flex-col gap-2 text-[11px] uppercase tracking-[0.16em] text-stone-500 sm:flex-row sm:items-center sm:justify-between">
                <span>{project.tags.join(" · ")}</span>
                <span>{project.year}</span>
              </div>
            </a>
          </article>
        ))}
      </div>
    </section>
  )
}
