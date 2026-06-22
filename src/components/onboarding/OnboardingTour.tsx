import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { useSfx } from "#/lib/sfx"
import { useTour } from "#/components/onboarding/useTour"

function tooltipPosition(rect: {
  top: number
  left: number
  width: number
  height: number
}) {
  const below = rect.top + rect.height + 16
  const fitsBelow = below + 180 < window.innerHeight
  const top = fitsBelow ? below : Math.max(16, rect.top - 196)
  const left = Math.min(
    Math.max(16, rect.left + rect.width / 2 - 150),
    window.innerWidth - 316,
  )
  return { top, left }
}

export function OnboardingTour() {
  const sfx = useSfx()
  const { active, index, rect, step, total, next, prev, skip } = useTour()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted || !active) return null

  const pad = 8
  const spotlight = rect
    ? {
        top: rect.top - pad,
        left: rect.left - pad,
        width: rect.width + pad * 2,
        height: rect.height + pad * 2,
      }
    : null

  const tip = rect ? tooltipPosition(rect) : { top: 80, left: 16 }
  const isLast = index >= total - 1

  return createPortal(
    <div className="fixed inset-0 z-[1000]">
      {spotlight ? (
        <div
          className="pointer-events-none absolute border-2 border-aqua"
          style={{
            top: spotlight.top,
            left: spotlight.left,
            width: spotlight.width,
            height: spotlight.height,
            boxShadow: "0 0 0 9999px color-mix(in oklch, var(--ink) 70%, transparent)",
          }}
          aria-hidden="true"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: "color-mix(in oklch, var(--ink) 70%, transparent)",
          }}
          aria-hidden="true"
        />
      )}

      <div
        role="dialog"
        aria-label={step.title}
        className="pixel-card absolute w-[300px] bg-card p-4"
        style={{ top: tip.top, left: tip.left }}
      >
        <p
          className="text-aqua text-sm"
          style={{ fontFamily: "var(--font-pixel)" }}
        >
          {step.title}
        </p>
        <p className="mt-2 text-ink" style={{ fontFamily: "var(--font-body)" }}>
          {step.body}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              sfx("tick")
              skip()
            }}
            className="text-xs text-ink-soft underline"
            style={{ fontFamily: "var(--font-pixel)" }}
          >
            Lewati
          </button>
          <div className="flex items-center gap-2">
            {index > 0 ? (
              <button
                type="button"
                onClick={() => {
                  sfx("tick")
                  prev()
                }}
                className="pixel-border pixel-press bg-paper-2 px-3 py-2 text-xs text-ink"
                style={{ fontFamily: "var(--font-pixel)" }}
              >
                {"<"}
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => {
                sfx("nav")
                next()
              }}
              className="pixel-border pixel-press bg-aqua px-3 py-2 text-xs text-primary-foreground"
              style={{ fontFamily: "var(--font-pixel)" }}
            >
              {isLast ? "SELESAI" : "LANJUT >"}
            </button>
          </div>
        </div>
        <p
          className="mt-3 text-center text-xs text-ink-soft"
          style={{ fontFamily: "var(--font-pixel)" }}
        >
          {index + 1}/{total}
        </p>
      </div>
    </div>,
    document.body,
  )
}
