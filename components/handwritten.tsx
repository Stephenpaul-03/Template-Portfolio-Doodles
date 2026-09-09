// Assistive technology gets one complete phrase; only the decorative copy is
// split into words or letters. All copy still comes from portfolio.json.
export function Handwritten({ text, className = "", phase, variant = "letters" }: {
  text: string
  className?: string
  phase?: number
  variant?: "letters" | "words"
}) {
  return <span className={`scrap-written ${className}`} data-write={variant} data-motion-phase={phase}>
    <span className="sr-only">{text}</span>
    <span aria-hidden="true">{text.split(/(\s+)/).map((word, index) => /^\s+$/.test(word) ? word :
      <span className="scrap-written-word" key={index}>{variant === "words" ? word : Array.from(word).map((letter, letterIndex) => <span data-ink key={letterIndex}>{letter}</span>)}</span>
    )}</span>
  </span>
}
