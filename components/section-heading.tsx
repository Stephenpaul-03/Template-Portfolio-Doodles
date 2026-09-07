type SectionHeadingProps = {
  eyebrow: string
  title: string
  introduction?: string
}

export function SectionHeading({ eyebrow, title, introduction }: SectionHeadingProps) {
  return (
    <div className="grid gap-5 border-t border-stone-900/20 pt-5 md:grid-cols-12">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-stone-500 md:col-span-3">{eyebrow}</p>
      <div className="md:col-span-8">
        <h2 className="max-w-3xl text-3xl font-medium tracking-[-0.045em] text-stone-950 sm:text-5xl">{title}</h2>
        {introduction ? <p className="mt-5 max-w-2xl text-base leading-7 text-stone-600 sm:text-lg">{introduction}</p> : null}
      </div>
    </div>
  )
}
