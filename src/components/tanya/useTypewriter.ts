import { useEffect, useRef, useState } from "react"

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false
  try {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
  } catch {
    return false
  }
}

export function useTypewriter(text: string, speed = 18) {
  const [shown, setShown] = useState("")
  const [done, setDone] = useState(false)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    if (prefersReducedMotion()) {
      setShown(text)
      setDone(true)
      return
    }
    setShown("")
    setDone(false)
    let index = 0
    let last = performance.now()

    const step = (now: number) => {
      if (now - last >= speed) {
        index += 1
        setShown(text.slice(0, index))
        last = now
      }
      if (index < text.length) {
        frameRef.current = requestAnimationFrame(step)
      } else {
        setDone(true)
      }
    }

    frameRef.current = requestAnimationFrame(step)
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    }
  }, [text, speed])

  return { shown, done }
}
