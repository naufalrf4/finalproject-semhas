import { useEffect, useState, type KeyboardEvent } from "react"
import { useAppStore } from "#/lib/store"
import { useSfx } from "#/lib/sfx"
import { NameGate } from "#/components/shell/NameGate"

type Phase = "title" | "name" | "done"

export function BootGate() {
  const session = useAppStore((s) => s.session)
  const boot = useAppStore((s) => s.boot)
  const sfx = useSfx()
  const [phase, setPhase] = useState<Phase>("title")

  const startGame = () => {
    if (phase !== "title") return
    sfx("start")
    if (session) {
      boot()
      setPhase("done")
    } else {
      setPhase("name")
    }
  }

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      startGame()
    }
  }

  const finishName = () => {
    boot()
    setPhase("done")
  }

  useEffect(() => {
    if (session && phase === "title") {
      const id = window.setTimeout(() => {}, 0)
      return () => window.clearTimeout(id)
    }
  }, [session, phase])

  if (phase === "done") return null

  if (phase === "name") return <NameGate onDone={finishName} />

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Mulai"
      onClick={startGame}
      onKeyDown={onKeyDown}
      className="pixel-press fixed inset-0 z-[110] flex cursor-pointer flex-col items-center justify-center gap-3 px-6 text-center"
      style={{
        background: "var(--ink)",
        backgroundImage:
          "linear-gradient(color-mix(in oklch, var(--cyan) 8%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklch, var(--cyan) 8%, transparent) 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    >
      <svg
        width={90}
        height={68}
        viewBox="0 0 32 24"
        aria-hidden="true"
        className="text-cyan"
        style={{
          imageRendering: "pixelated",
          filter: "drop-shadow(3px 3px 0 var(--shadow-pixel))",
          animation: "pixel-bob 1.4s steps(4,end) infinite",
        }}
      >
        <use href="#discus" />
      </svg>
      <p
        className="text-[11px] tracking-[3px] text-cyan"
        style={{ fontFamily: "var(--font-pixel)" }}
      >
        SELAMAT DATANG DI
      </p>
      <h1
        className="whitespace-nowrap text-2xl leading-tight tracking-[3px] sm:text-4xl"
        style={{
          fontFamily: "var(--font-pixel)",
          color: "var(--cyan)",
          textShadow:
            "3px 3px 0 var(--aqua-deep), 6px 6px 0 var(--shadow-pixel)",
        }}
      >
        PROYEK AKHIR
      </h1>
      <p className="text-xl text-paper-2 sm:text-2xl">
        Naufal R. Firdaus &nbsp;|&nbsp; J0404221090
      </p>
      <p
        className="blink mt-6 text-sm text-gold"
        style={{ fontFamily: "var(--font-pixel)" }}
      >
        PRESS START
      </p>
      <p className="text-lg text-paper-2/70">klik di mana saja</p>
    </div>
  )
}
