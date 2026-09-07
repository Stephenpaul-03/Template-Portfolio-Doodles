type SectionHeadingProps = {
  eyebrow: string
  title: string
  introduction?: string
}

export function SectionHeading({ eyebrow, title, introduction }: SectionHeadingProps) {
  return (
    <div className="grid gap-5 border-t border-border pt-5 md:grid-cols-12">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-muted-foreground md:col-span-3">{eyebrow}</p>
      <div className="md:col-span-8">
        <h2 className="max-w-3xl text-3xl font-medium tracking-[-0.045em] text-foreground sm:text-5xl">{title}</h2>
        {introduction ? <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">{introduction}</p> : null}
      </div>
    </div>
  )
}
