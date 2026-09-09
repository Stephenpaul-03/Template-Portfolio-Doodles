"use client"

import { AnimatePresence, LayoutGroup, motion, useDragControls, useMotionValue, useReducedMotion } from "framer-motion"
import { ArrowUpRight, GripHorizontal } from "lucide-react"
import Image from "next/image"
import { useCallback, useEffect, useRef, useState, type RefObject } from "react"
import { createPortal } from "react-dom"
import { ScrapbookModal } from "@/components/scrapbook-modal"
import { Chapter } from "@/components/scrapbook-ui"
import { useLenisReveal } from "@/components/lenis-reveal"

import { content, withTitle, type Hobby } from "@/data/content"

const copy = content.hobbies
const hobbies = copy.items

function BoardCard({ hobby, index, board, selected, onSelect, bringForward, z }: { hobby: Hobby; index: number; board: RefObject<HTMLDivElement | null>; selected: boolean; onSelect: () => void; bringForward: () => void; z: number }) {
  const card = useRef<HTMLDivElement>(null)
  const controls = useDragControls()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const reduced = useReducedMotion()
  const reveal = useLenisReveal({ index, variant: "paper" })
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
  return <motion.div ref={card} data-lenis-prevent-touch className={`scrap-board-item scrap-board-item-${index % 8}`} style={{ x, y, zIndex: z }} drag dragControls={controls} dragListener={false} dragConstraints={board} dragMomentum={false} dragElastic={0} onDragStart={bringForward} onDragEnd={clamp}>
    {!selected && <motion.article ref={reveal.ref} data-lenis-reveal="paper" style={reveal.style} layoutId={reduced ? undefined : `scrap-hobby-${hobby.id}`} className="scrap-hobby-card" transition={{ layout: { duration: reduced ? 0 : 0.42 } }}>
      <button className="scrap-drag-handle" aria-label={withTitle(copy.moveLabel, hobby.label)} onPointerDown={event => { bringForward(); controls.start(event) }} onKeyDown={event => {
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
      <div className="scrap-hobby-caption"><h3>{hobby.label}</h3><p>{hobby.description}</p><button data-hobby={hobby.id} className="scrap-text-link" onClick={onSelect}>{copy.learnMore} <ArrowUpRight size={14}/></button></div>
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
  return <section id="hobbies" data-motion-section className="scrap-hobbies-section scrap-section">
    <div className="scrap-container"><Chapter {...copy.chapter}/></div>
    <LayoutGroup id="scrap-hobbies">
      <div ref={board} className="scrap-board">
        <span className="scrap-board-label scrap-hand" aria-hidden="true">{copy.boardLabel}</span>
        <div className="scrap-board-doodle" aria-hidden="true">✳</div>
        {hobbies.map((hobby, index) => <BoardCard key={hobby.id} hobby={hobby} index={index} board={board} selected={selected?.id === hobby.id} onSelect={() => { lastSelected.current = hobby.id; setMounted(true); setSelected(hobby) }} bringForward={() => setLayers(current => ({ ...current, [hobby.id]: ++layer.current }))} z={layers[hobby.id] ?? index + 1}/>)}
      </div>
      {mounted && createPortal(<AnimatePresence onExitComplete={() => requestAnimationFrame(() => document.querySelector<HTMLButtonElement>(`[data-hobby="${CSS.escape(lastSelected.current)}"]`)?.focus())}>{selected && <ScrapbookModal key={selected.id} title={selected.label} layoutId={`scrap-hobby-${selected.id}`} onClose={close}><div className="scrap-hobby-modal"><div className="scrap-modal-art"><Image src={selected.image} alt={selected.description} fill sizes="700px"/></div><div className="scrap-modal-copy"><span className="scrap-hand">{copy.modalLabel}</span><h2>{selected.label}</h2><p>{selected.detail}</p><ul>{selected.facts.map(fact => <li key={fact}>{fact}</li>)}</ul></div></div></ScrapbookModal>}</AnimatePresence>, document.body)}
    </LayoutGroup>
  </section>
}
