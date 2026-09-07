import type { CSSProperties, SVGProps } from "react"

const marks = {
  spiral: "M15 56 C2 24 69 12 65 48 C62 78 14 81 20 47 C25 23 58 33 51 56 C45 76 30 60 37 48 M17 90 Q40 103 66 88",
  star: "M39 12 L44 40 L67 28 L52 51 L74 61 L48 65 L50 92 L35 71 L14 89 L25 64 L7 51 L31 47 Z M12 17 L19 25 M66 89 L71 98",
  arrow: "M17 14 C64 18 66 43 31 48 C1 52 9 86 52 77 C78 72 65 103 40 109 M34 99 L40 110 L53 104",
  planet: "M61 44 C54 20 20 24 18 53 C16 83 54 88 63 61 M9 77 C-3 67 70 29 75 39 C88 56 14 88 9 77 M25 39 L29 36 M47 74 L51 71 M13 16 L13 26 M8 21 L18 21 M65 94 L65 104 M60 99 L70 99",
  sun: "M41 36 C13 33 13 76 39 77 C68 78 70 37 41 36 Z M39 14 L38 25 M62 22 L57 31 M72 48 L79 47 M66 77 L73 87 M43 89 L44 104 M21 85 L14 96 M7 62 L0 63 M17 33 L8 25",
  plane: "M7 48 L72 22 L51 91 L35 63 L7 48 Z M35 63 L72 22 M35 63 L29 83 L43 76 M8 79 Q-1 104 25 109",
  lightning: "M47 13 L16 63 L38 61 L28 107 L68 49 L45 52 L47 13 Z M13 24 L20 29 M60 92 L70 97",
  pencil: "M21 86 L50 20 Q53 13 61 18 L65 23 L36 91 L18 104 L21 86 Z M21 86 L36 91 M25 85 L54 22 M49 23 L63 29 M18 104 L26 99 M37 107 Q54 96 70 106",
  leaf: "M20 102 Q25 61 58 22 M29 77 Q4 48 26 31 Q32 49 31 63 M38 60 Q64 73 69 44 Q54 43 41 54 M46 38 Q34 18 55 8 Q65 23 46 38",
  waves: "M7 36 Q17 16 28 36 T49 36 T72 36 M7 56 Q17 36 28 56 T49 56 T72 56 M7 76 Q17 56 28 76 T49 76 T72 76 M16 96 L62 96",
  mountains: "M4 86 L29 29 L47 65 L58 43 L76 86 Z M19 52 L29 58 L36 44 M50 60 L58 66 L63 58 M48 19 A9 9 0 1 0 66 19 A9 9 0 1 0 48 19 M13 98 Q41 102 68 96",
  camera: "M9 39 L24 38 L29 28 L49 27 L55 38 L71 40 L70 85 L9 83 Z M24 60 A16 16 0 1 0 56 60 A16 16 0 1 0 24 60 M32 57 Q33 50 40 50 M59 48 L65 48 M16 96 Q40 103 62 94",
  paperclip: "M52 81 L52 31 Q52 7 32 9 Q16 10 17 32 L18 90 Q20 110 38 108 Q62 106 62 84 L61 32 M29 83 L29 32 Q31 20 40 29 L40 84 Q39 94 29 89 Z",
  checker: "M13 29 L65 28 L67 82 L12 84 Z M30 29 L30 83 M48 29 L49 82 M13 46 L66 45 M13 64 L66 63 M16 33 L26 43 M16 39 L20 43 M35 50 L44 60 M35 56 L39 60 M53 68 L63 78 M53 74 L57 78 M16 99 L63 95",
  coffee: "M12 46 L57 44 L53 84 Q33 96 17 84 Z M57 51 Q82 42 73 66 Q68 75 55 73 M7 96 Q40 105 68 94 M25 32 C12 21 37 18 25 7 M43 32 C29 23 54 14 43 5",
  sparkles: "M27 24 Q27 47 9 49 Q29 50 29 76 Q30 52 49 49 Q29 47 27 24 Z M60 67 Q60 80 49 82 Q61 84 61 98 Q63 85 73 82 Q61 80 60 67 Z M59 13 L59 27 M52 20 L66 20",
  orbit: "M9 64 C-5 27 81 20 71 60 C63 98 14 83 9 64 Z M22 91 C-5 76 39 5 60 26 C82 51 49 113 22 91 Z M35 55 A5 5 0 1 0 45 55 A5 5 0 1 0 35 55",
  steps: "M10 100 L10 78 L25 78 L25 59 L40 59 L40 41 L56 41 L56 21 L72 21 M17 110 Q43 112 69 103 M6 44 L16 34 L25 44 M16 34 L17 63",
} as const

export type DoodleName = keyof typeof marks

export function Doodle({ name, className = "", style, ...props }: { name: DoodleName; className?: string; style?: CSSProperties } & SVGProps<SVGSVGElement>) {
  return <svg className={className} style={style} data-doodle={name} viewBox="0 0 80 120" fill="none" aria-hidden="true" focusable="false" {...props}>
    <path d={marks[name]} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
}

const names = Object.keys(marks) as DoodleName[]

// Fixed scatter patterns keep server/client rendering identical. Each mark has
// its own height, horizontal lane, size, and angle within the available gutter.
const scatter = [
  [[10, .08, .44, -18], [23, .78, .34, 22], [43, .82, .54, 9], [51, .12, .48, -23], [76, .35, .38, -11], [83, .66, .56, 17]],
  [[18, .72, .36, 16], [9, .15, .52, -12], [49, .04, .55, -21], [44, .88, .38, 26], [81, .6, .42, 8], [72, .28, .58, -15]],
  [[8, .4, .56, -27], [26, .06, .4, 11], [39, .86, .33, 18], [58, .69, .54, -19], [74, .12, .48, -9], [84, .92, .34, 25]],
] as const

export function MarginScribbles({ variant = 0 }: { variant?: number }) {
  return <div className="scrap-margin-scribbles" aria-hidden="true">
    {scatter[variant % scatter.length].map(([top, lane, size, tilt], index) => (
      <Doodle key={index} name={names[(variant * 5 + index) % names.length]}
        className={`scrap-margin-mark scrap-margin-mark-${index % 2 === 0 ? "left" : "right"}`}
        style={{ top: `${top}%`, "--doodle-lane": lane, "--doodle-size": size, "--doodle-tilt": `${tilt}deg` } as CSSProperties}/>
    ))}
  </div>
}
