import { ArrowUpRight, Download } from "lucide-react"

export function ContactSection() {
  return (
    <>
      <section id="contact" className="mx-auto max-w-[90rem] scroll-mt-20 px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="grid gap-10 border-t border-stone-900/20 pt-5 md:grid-cols-12">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500 md:col-span-3">Contact</p>
          <div className="md:col-span-8">
            <h2 className="max-w-3xl text-4xl font-medium tracking-[-0.05em] sm:text-6xl">Have a project, a question, or a good tangent?</h2>
            <a href="mailto:hello@example.com" className="group mt-10 inline-flex items-center gap-3 border-b border-stone-900 pb-2 text-lg sm:text-xl">
              hello@example.com
              <ArrowUpRight className="size-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
            <div className="mt-14 flex flex-wrap gap-x-8 gap-y-3 text-sm text-stone-600">
              <a href="https://www.linkedin.com" className="hover:text-stone-950">LinkedIn</a>
              <a href="https://github.com" className="hover:text-stone-950">GitHub</a>
              <a href="https://www.instagram.com" className="hover:text-stone-950">Instagram</a>
            </div>
          </div>
        </div>
      </section>

      <section id="resume" className="scroll-mt-20 bg-stone-950 text-stone-100">
        <div className="mx-auto grid max-w-[90rem] gap-8 px-5 py-14 sm:px-8 md:grid-cols-12 md:items-center lg:px-12">
          <div className="md:col-span-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500">Resume</p>
          </div>
          <div className="md:col-span-6">
            <h2 className="text-2xl font-medium tracking-[-0.035em] sm:text-3xl">The one-page version.</h2>
            <p className="mt-2 text-sm leading-6 text-stone-400">A placeholder PDF is wired up and ready to be replaced with your current résumé.</p>
          </div>
          <div className="md:col-span-3 md:text-right">
            <a href="/files/steve-resume-placeholder.pdf" download className="inline-flex items-center gap-2 border-b border-stone-600 pb-1 text-sm transition-colors hover:border-stone-100">
              Download PDF <Download className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
