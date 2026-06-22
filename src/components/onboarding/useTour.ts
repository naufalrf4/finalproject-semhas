import { useCallback, useEffect, useState } from "react"
import { useAppStore } from "#/lib/store"
import { TOUR_STEPS, ONBOARDED_KEY } from "#/components/onboarding/steps"

type Rect = { top: number; left: number; width: number; height: number }

function readRect(selector: string): Rect | null {
  const el = document.querySelector(selector)
  if (!el) return null
  const r = el.getBoundingClientRect()
  return { top: r.top, left: r.left, width: r.width, height: r.height }
}

export function useTour() {
  const onboarded = useAppStore((s) => s.onboarded)
  const setOnboarded = useAppStore((s) => s.setOnboarded)
  const session = useAppStore((s) => s.session)
  const [active, setActive] = useState(false)
  const [index, setIndex] = useState(0)
  const [rect, setRect] = useState<Rect | null>(null)

  useEffect(() => {
    let stored = false
    try {
      stored = localStorage.getItem(ONBOARDED_KEY) === "true"
    } catch {
      stored = false
    }
    if (stored && !onboarded) setOnboarded(true)
    if (!stored && !onboarded && session) {
      const id = window.setTimeout(() => setActive(true), 600)
      return () => window.clearTimeout(id)
    }
  }, [onboarded, session, setOnboarded])

  const measure = useCallback(() => {
    if (!active) return
    setRect(readRect(TOUR_STEPS[index].selector))
  }, [active, index])

  useEffect(() => {
    measure()
    window.addEventListener("resize", measure)
    window.addEventListener("scroll", measure, true)
    return () => {
      window.removeEventListener("resize", measure)
      window.removeEventListener("scroll", measure, true)
    }
  }, [measure])

  const finish = useCallback(() => {
    setActive(false)
    setOnboarded(true)
    try {
      localStorage.setItem(ONBOARDED_KEY, "true")
    } catch {
      void 0
    }
  }, [setOnboarded])

  const next = useCallback(() => {
    setIndex((i) => {
      if (i >= TOUR_STEPS.length - 1) {
        finish()
        return i
      }
      return i + 1
    })
  }, [finish])

  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), [])

  return {
    active,
    index,
    rect,
    step: TOUR_STEPS[index],
    total: TOUR_STEPS.length,
    next,
    prev,
    skip: finish,
  }
}
