import { useRef } from "react"
import { Link } from "@tanstack/react-router"
import { useSfx } from "#/lib/sfx"

type HubCardProps = {
  num: string
  title: string
  desc: string
  to?: string
  onClick?: () => void
  locked?: boolean
  accent?: "aqua" | "cyan" | "gold"
}

const ACCENT_TEXT: Record<NonNullable<HubCardProps["accent"]>, string> = {
  aqua: "text-aqua",
  cyan: "text-cyan",
  gold: "text-gold",
}

function HubCardInner({
  num,
  title,
  desc,
  locked,
  accent = "aqua",
}: Pick<HubCardProps, "num" | "title" | "desc" | "locked" | "accent">) {
  return (
    <>
      <span
        className="pointer-events-none absolute -left-px -top-px bg-ink px-2 py-1 text-paper text-xs"
        style={{ fontFamily: "var(--font-pixel)" }}
      >
        {num}
      </span>
      <div className="flex h-full flex-col justify-between gap-4 pt-6">
        <div className="flex flex-col gap-2">
          <h3
            className={`text-base leading-snug ${locked ? "text-ink-soft" : ACCENT_TEXT[accent]}`}
            style={{ fontFamily: "var(--font-pixel)" }}
          >
            {title}
          </h3>
          <p className="text-ink-soft leading-tight">{desc}</p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-ink-soft text-sm" style={{ fontFamily: "var(--font-pixel)" }}>
            {locked ? "TERKUNCI" : "BUKA"}
          </span>
          <span
            aria-hidden="true"
            className={`text-2xl leading-none ${locked ? "text-ink-soft" : "text-ink"}`}
            style={{ fontFamily: "var(--font-pixel)" }}
          >
            {locked ? "x" : ">"}
          </span>
        </div>
      </div>
    </>
  )
}

function useGlow() {
  const ref = useRef<HTMLDivElement>(null)
  const onMove = (event: React.MouseEvent<HTMLElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty("--glow-x", `${event.clientX - rect.left}px`)
    el.style.setProperty("--glow-y", `${event.clientY - rect.top}px`)
  }
  return { ref, onMove }
}

const GLOW_BG =
  "radial-gradient(120px circle at var(--glow-x, 50%) var(--glow-y, 50%), color-mix(in oklch, var(--cyan) 30%, transparent), transparent 70%)"

export function HubCard(props: HubCardProps) {
  const { title, to, onClick, locked, accent } = props
  const sfx = useSfx()
  const { ref, onMove } = useGlow()

  const baseClass =
    "group pixel-card pixel-hover pixel-press relative block w-full overflow-hidden p-5 text-left"
  const shakeClass = locked ? "hover:animate-[pixel-bob_0.4s_steps(4,end)]" : ""

  const glow = (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      style={{ background: GLOW_BG }}
    />
  )

  if (to && !locked) {
    return (
      <Link
        to={to}
        onMouseMove={onMove}
        onMouseEnter={() => sfx("tick")}
        className={`${baseClass} no-underline`}
        ref={ref as unknown as React.Ref<HTMLAnchorElement>}
        aria-label={title}
      >
        {glow}
        <HubCardInner {...props} accent={accent} />
      </Link>
    )
  }

  return (
    <div
      ref={ref}
      onMouseMove={locked ? undefined : onMove}
      onMouseEnter={locked ? undefined : () => sfx("tick")}
      onClick={() => {
        if (locked) {
          sfx("lock")
          return
        }
        onClick?.()
      }}
      role="button"
      tabIndex={0}
      aria-disabled={locked}
      aria-label={title}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          if (locked) {
            sfx("lock")
            return
          }
          onClick?.()
        }
      }}
      className={`${baseClass} ${shakeClass} ${locked ? "cursor-not-allowed opacity-80" : "cursor-pointer"}`}
    >
      {!locked && glow}
      <HubCardInner {...props} accent={accent} />
    </div>
  )
}
