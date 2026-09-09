"use client"

import { motion, useMotionValue, useReducedMotion, useTransform, type MotionStyle } from "framer-motion"
import { useLenis } from "lenis/react"
import { useCallback, useLayoutEffect, useRef, type ReactNode, type Ref } from "react"

export type LenisRevealVariant = "text" | "paper" | "left" | "right"
type LenisRevealTag = "div" | "article" | "aside"

function clamp(value: number) {
  return Math.max(0, Math.min(1, value))
}

export function useLenisReveal({ index = 0, variant = "text" }: { index?: number; variant?: LenisRevealVariant } = {}) {
  const ref = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()
  // Visible is the safe SSR/no-JS default. The layout effect measures and
  // prepares offscreen items before the first hydrated paint.
  const progress = useMotionValue(1)
  const verticalDistance = variant === "paper" ? 58 : variant === "text" ? 32 : 20
  const horizontalDistance = variant === "left" ? -48 : variant === "right" ? 48 : 0
  const opacity = useTransform(progress, [0, 0.24, 1], [0, 1, 1])
  const translate = useTransform(progress, value => `${horizontalDistance * (1 - value)}px ${verticalDistance * (1 - value)}px`)
  const filter = useTransform(progress, value => `blur(${(variant === "paper" ? 2 : 5) * (1 - value)}px)`)
  // Paper lands first; any tape attached to it then unfurls as a second beat.
  const tapeProgress = useTransform(progress, [0, 0.58, 0.9, 1], [0, 0, 1, 1])

  const sync = useCallback((scrollPosition = window.scrollY, scrollLimit = Math.max(0, document.documentElement.scrollHeight - window.innerHeight)) => {
    const element = ref.current
    if (!element) return

    if (reducedMotion || scrollLimit <= 1) {
      progress.set(1)
    } else {
      const viewportHeight = window.innerHeight
      const entryLine = viewportHeight * (0.98 - Math.min(index, 5) * 0.025)
      const top = element.getBoundingClientRect().top
      // Near the document end, some elements can never physically reach the
      // normal 60vh settle line. Use their top position at Lenis' scroll limit
      // as the fallback so footer pieces still reach a complete resting state.
      const lowestReachableTop = top + scrollPosition - scrollLimit
      const settledLine = Math.max(viewportHeight * 0.6, Math.min(entryLine - 1, lowestReachableTop))
      progress.set(clamp((entryLine - top) / (entryLine - settledLine)))
    }

    element.setAttribute("data-motion-state", "visible")
  }, [index, progress, reducedMotion])

  useLayoutEffect(sync, [sync])
  // Lenis is the animation clock: each interpolated scroll frame re-measures
  // this component and scrubs its reveal progress.
  useLenis(lenis => sync(lenis.scroll, lenis.limit), [sync], 0)

  return {
    ref,
    progress,
    style: { opacity, translate, filter, "--tape-progress": tapeProgress } as MotionStyle,
  }
}

export function LenisReveal({
  as = "div",
  children,
  className,
  index = 0,
  variant = "text",
  ariaLive,
}: {
  as?: LenisRevealTag
  children: ReactNode
  className?: string
  index?: number
  variant?: LenisRevealVariant
  ariaLive?: "off" | "polite" | "assertive"
}) {
  const reveal = useLenisReveal({ index, variant })
  const props = {
    className,
    style: reveal.style,
    "data-lenis-reveal": variant,
    "aria-live": ariaLive,
  }

  if (as === "article") return <motion.article ref={reveal.ref as Ref<HTMLElement>} {...props}>{children}</motion.article>
  if (as === "aside") return <motion.aside ref={reveal.ref as Ref<HTMLElement>} {...props}>{children}</motion.aside>
  return <motion.div ref={reveal.ref as Ref<HTMLDivElement>} {...props}>{children}</motion.div>
}
