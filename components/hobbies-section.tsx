"use client"

import { AnimatePresence, LayoutGroup, motion, useDragControls, useMotionValue, useReducedMotion } from "framer-motion"
import { ArrowUpRight, GripHorizontal } from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useRef, useState, type RefObject } from "react"
import { createPortal } from "react-dom"
import { ScrapbookModal } from "@/components/scrapbook-modal"
import { Chapter } from "@/components/scrapbook-ui"

type Hobby = {
  id: string
  label: string
  image: string
  description: string
  detail: string
  facts: readonly string[]
  position: string
  rotation: number
}

const hobbies = [
  {
    id: "photography",
    label: "Photography",
    image: "/images/hobbies/photography.svg",
    description: "Odd light and quiet evidence.",
    detail: "Walking without a destination, collecting shopfronts, passing gestures, and the small evidence people leave behind. Photography keeps my attention honest: notice first, explain later.",
    facts: ["Street and observational", "Usually one lens", "Always chasing late light"],
    position: "left-[3%] top-[5%] w-[47%] sm:left-[6%] sm:top-[8%] sm:w-60 lg:w-72",
    rotation: -4,
  },
  {
    id: "cycling",
    label: "Long rides",
    image: "/images/hobbies/cycling.svg",
    description: "The longer road to a distant tea stop.",
    detail: "The best reset I know: choose a distant tea stop, take the longer road, and let the useful thoughts arrive late. Distance has a way of making difficult problems less dramatic.",
    facts: ["Early starts", "Unnecessary detours", "Tea is the destination"],
    position: "right-[3%] top-[9%] w-[43%] sm:right-[8%] sm:top-[5%] sm:w-56 lg:w-64",
    rotation: 5,
  },
  {
    id: "music",
    label: "Albums, in order",
    image: "/images/hobbies/music.svg",
    description: "Side A, pause, then side B.",
    detail: "I still like records as complete objects: sequence, cover, liner notes, and the pause before side B. Shuffle has its place, but listening in order reveals the decisions between the songs.",
    facts: ["Full albums", "Headphones after midnight", "Liner notes matter"],
    position: "left-[7%] top-[35%] w-[49%] sm:left-[31%] sm:top-[32%] sm:w-60 lg:w-72",
    rotation: 2,
  },
  {
    id: "cooking",
    label: "Cooking for people",
    image: "/images/hobbies/cooking.svg",
    description: "Recipes as scaffolding, not law.",
    detail: "Recipes are useful scaffolding. The real pleasure is adjusting by smell, feeding a table, and trying to remember what changed when everyone asks how to make it again.",
    facts: ["Feeds too many", "Measures approximately", "Cleans as it cooks"],
    position: "right-[4%] top-[48%] w-[44%] sm:right-[4%] sm:top-[42%] sm:w-56 lg:w-64",
    rotation: -5,
  },
  {
    id: "reading",
    label: "Marginalia",
    image: "/images/hobbies/reading.svg",
    description: "Books worth arguing with.",
    detail: "Essays, speculative fiction, design history, and books with enough room around the sentences to argue in the margins. A good underline is a conversation postponed.",
    facts: ["Essays and fiction", "Pencil, never pen", "More bookmarks than time"],
    position: "left-[4%] top-[68%] w-[46%] sm:left-[9%] sm:top-[60%] sm:w-56 lg:w-64",
    rotation: -7,
  },
  {
    id: "video-games",
    label: "Video games",
    image: "/images/hobbies/video-games.svg",
    description: "Good systems, strange worlds.",
    detail: "I like games that make a world feel coherent: a tiny rule set, a surprising consequence, and just enough room to get lost. They are little laboratories for curiosity and atmosphere.",
    facts: ["Story-rich worlds", "Indie and co-op", "One more round"],
    position: "left-[54%] top-[25%] w-[44%]",
    rotation: 4,
  },
  {
    id: "sketching",
    label: "Loose sketches",
    image: "/images/hobbies/sketching.svg",
    description: "Hands moving before ideas settle.",
    detail: "A page of bad drawings is often the shortest route to one useful shape. I sketch interfaces, rooms, machines, and whatever is nearby when a thought needs somewhere to land.",
    facts: ["Pen and paper", "Fast studies", "No eraser required"],
    position: "left-[28%] top-[68%] w-[44%]",
    rotation: -3,
  },
  {
    id: "film-nights",
    label: "Film nights",
    image: "/images/hobbies/film-nights.svg",
    description: "Good framing, better company.",
    detail: "A film night is part cinema, part ritual: dim lights, a shared bowl of something, and a story that stays in the room after the credits.",
    facts: ["Old and odd", "Big-screen whenever possible", "Discusses the ending"],
    position: "right-[20%] top-[75%] w-[42%]",
    rotation: 6,
  },
] as const satisfies readonly Hobby[]


function BoardCard({ hobby, index, board, selected, onSelect, bringForward, z }: { hobby: Hobby; index: number; board: RefObject<HTMLDivElement | null>; selected: boolean; onSelect: () => void; bringForward: () => void; z: number }) {
  const card = useRef<HTMLDivElement>(null)
  const controls = useDragControls()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const reduced = useReducedMotion()
  const clamp = useCallback(() => {
    if (!card.current || !board.current) return
    const bounds = board.current.getBoundingClientRect(), item = card.current.getBoundingClientRect()
    x.set(x.get() + Math.max(bounds.left - item.left, Math.min(0, bounds.right - item.right)))
    y.set(y.get() + Math.max(bounds.top - item.top, Math.min(0, bounds.bottom - item.bottom)))
  }, [board, x, y])
  useEffect(() => {
    const observer = new ResizeObserver(clamp)
    if (board.current) observer.observe(board.current)
    return () => observer.disconnect()
  }, [board, clamp])
  return <motion.div ref={card} className={`scrap-board-item scrap-board-item-${index}`} style={{ x, y, zIndex: z }} drag dragControls={controls} dragListener={false} dragConstraints={board} dragMomentum={false} dragElastic={0} onDragStart={bringForward} onDragEnd={clamp}>
    {!selected && <motion.article layoutId={reduced ? undefined : `scrap-hobby-${hobby.id}`} className="scrap-hobby-card" transition={{ layout: { duration: reduced ? 0 : 0.42 } }}>
      <button className="scrap-drag-handle" aria-label={`Move ${hobby.label} card; use arrow keys to reposition`} onPointerDown={event => { bringForward(); controls.start(event) }} onKeyDown={event => {
        const offsets: Record<string, [number, number]> = { ArrowLeft: [-16, 0], ArrowRight: [16, 0], ArrowUp: [0, -16], ArrowDown: [0, 16] }
        const offset = offsets[event.key]
        if (offset && card.current && board.current) {
          event.preventDefault()
          bringForward()
          const bounds = board.current.getBoundingClientRect(), item = card.current.getBoundingClientRect()
          x.set(x.get() + Math.max(bounds.left - item.left, Math.min(offset[0], bounds.right - item.right)))
          y.set(y.get() + Math.max(bounds.top - item.top, Math.min(offset[1], bounds.bottom - item.bottom)))
        }
      }}><GripHorizontal size={16}/></button>
      <div className="scrap-hobby-image" onPointerDown={event => { bringForward(); controls.start(event) }}><Image src={hobby.image} alt={hobby.description} fill draggable={false} sizes="240px"/></div>
      <div className="scrap-hobby-caption"><h3>{hobby.label}</h3><p>{hobby.description}</p><button data-hobby={hobby.id} className="scrap-text-link" onClick={onSelect}>Learn more <ArrowUpRight size={14}/></button></div>
    </motion.article>}
  </motion.div>
}
export function HobbiesSection() {
  const [selected, setSelected] = useState<Hobby | null>(null)
  const [mounted, setMounted] = useState(false)
  const [layers, setLayers] = useState<Record<string, number>>({})
  const board = useRef<HTMLDivElement>(null)
  const layer = useRef(hobbies.length)
  const lastSelected = useRef<string>("")
  const close = useCallback(() => setSelected(null), [])
  return <section id="hobbies" className="scrap-hobbies-section scrap-section">
    <div className="scrap-container"><Chapter number="04" label="The sidelines" title="A life outside the browser." aside="A few of my favourite distractions."/></div>
    <LayoutGroup id="scrap-hobbies">
      <div ref={board} className="scrap-board">
        <span className="scrap-board-label scrap-hand" aria-hidden="true">Collected along the way.</span>
        <div className="scrap-board-doodle" aria-hidden="true">✳</div>
        {hobbies.map((hobby, index) => <BoardCard key={hobby.id} hobby={hobby} index={index} board={board} selected={selected?.id === hobby.id} onSelect={() => { lastSelected.current = hobby.id; setMounted(true); setSelected(hobby) }} bringForward={() => setLayers(current => ({ ...current, [hobby.id]: ++layer.current }))} z={layers[hobby.id] ?? index + 1}/>)}
      </div>
      {mounted && createPortal(<AnimatePresence onExitComplete={() => requestAnimationFrame(() => document.querySelector<HTMLButtonElement>(`[data-hobby="${lastSelected.current}"]`)?.focus())}>{selected && <ScrapbookModal key={selected.id} title={selected.label} layoutId={`scrap-hobby-${selected.id}`} onClose={close}><div className="scrap-hobby-modal"><div className="scrap-modal-art"><Image src={selected.image} alt={selected.description} fill sizes="700px"/></div><div className="scrap-modal-copy"><span className="scrap-hand">Off the clock</span><h2>{selected.label}</h2><p>{selected.detail}</p><ul>{selected.facts.map(fact => <li key={fact}>{fact}</li>)}</ul></div></div></ScrapbookModal>}</AnimatePresence>, document.body)}
    </LayoutGroup>
  </section>
}
