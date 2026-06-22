import { useCallback, useRef } from "react"
import { useNavigate } from "@tanstack/react-router"
import { useSfx } from "#/lib/sfx"

const OVERLAY_ID = "pixel-wipe-overlay"
const WIPE_DURATION = 360

function ensureOverlay(): HTMLDivElement {
  const existing = document.getElementById(OVERLAY_ID)
  if (existing) return existing as HTMLDivElement
  const node = document.createElement("div")
  node.id = OVERLAY_ID
  node.style.position = "fixed"
  node.style.inset = "0"
  node.style.zIndex = "90"
  node.style.pointerEvents = "none"
  node.style.transformOrigin = "left center"
  node.style.transform = "scaleX(0)"
  node.style.background = "var(--ink)"
  node.style.imageRendering = "pixelated"
  document.body.appendChild(node)
  return node
}

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

export function useWipeNav() {
  const navigate = useNavigate()
  const sfx = useSfx()
  const busy = useRef(false)

  return useCallback(
    (to: string) => {
      if (busy.current) return
      sfx("nav")
      if (typeof document === "undefined" || prefersReducedMotion()) {
        void navigate({ to })
        return
      }
      busy.current = true
      const overlay = ensureOverlay()
      overlay.style.transformOrigin = "left center"
      overlay.style.transition = `transform ${WIPE_DURATION}ms steps(6, end)`
      overlay.style.transform = "scaleX(0)"
      requestAnimationFrame(() => {
        overlay.style.transform = "scaleX(1)"
      })
      window.setTimeout(() => {
        void navigate({ to })
        overlay.style.transformOrigin = "right center"
        requestAnimationFrame(() => {
          overlay.style.transform = "scaleX(0)"
        })
        window.setTimeout(() => {
          busy.current = false
        }, WIPE_DURATION)
      }, WIPE_DURATION)
    },
    [navigate, sfx],
  )
}
