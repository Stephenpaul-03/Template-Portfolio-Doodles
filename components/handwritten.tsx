// The complete phrase remains available to assistive technology while only
// the decorative copy is split into letters for the writing animation.
export function Handwritten({ text, className = "" }: { text: string; className?: string }) {
  return <span className={`scrap-written ${className}`} data-write>
    <span className="sr-only">{text}</span>
    <span aria-hidden="true">{text.split(/(\s+)/).map((word, index) => /^\s+$/.test(word) ? word :
      <span className="scrap-written-word" key={index}>{Array.from(word).map((letter, letterIndex) => <span data-ink key={letterIndex}>{letter}</span>)}</span>
    )}</span>
  </span>
}
