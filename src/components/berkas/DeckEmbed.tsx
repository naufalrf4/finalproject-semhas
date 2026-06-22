import { Maximize2, Minimize2, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useSfx } from "#/lib/sfx"

type DeckEmbedProps = {
  src: string
}

export function DeckEmbed({ src }: DeckEmbedProps) {
  const sfx = useSfx()
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setLoaded((prev) => {
        if (!prev) setFailed(true)
        return prev
      })
    }, 6000)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  useEffect(() => {
    if (!fullscreen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [fullscreen])

  const toggleFullscreen = () => {
    sfx("open")
    setFullscreen((v) => !v)
  }

  const frame = (
    <div className="relative w-full overflow-hidden pixel-border bg-paper-2">
      <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
        {!loaded && !failed ? (
          <div className="absolute inset-0 grid place-items-center bg-paper-2">
            <div className="relative h-2 w-40 overflow-hidden bg-card pixel-border">
              <div
                className="absolute inset-y-0 w-1/3 bg-aqua"
                style={{ animation: "pixel-shimmer 1.1s steps(8, end) infinite" }}
              />
            </div>
          </div>
        ) : null}
        {failed ? (
          <div className="absolute inset-0 grid place-items-center p-6 text-center">
            <p className="text-ink-soft">
              Paparan belum tersedia. Pastikan deck sudah ditempatkan di {src}.
            </p>
          </div>
        ) : (
          <iframe
            title="Paparan ELSA"
            src={src}
            onLoad={() => {
              setLoaded(true)
              setFailed(false)
            }}
            className="absolute inset-0 h-full w-full border-0"
          />
        )}
      </div>
      <button
        type="button"
        onClick={toggleFullscreen}
        aria-label={fullscreen ? "Keluar layar penuh" : "Layar penuh"}
        className="pixel-card pixel-press absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center bg-card text-ink"
      >
        {fullscreen ? (
          <Minimize2 className="h-5 w-5" />
        ) : (
          <Maximize2 className="h-5 w-5" />
        )}
      </button>
    </div>
  )

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-[120] flex flex-col gap-3 bg-paper p-4">
        <div className="flex items-center justify-between">
          <span
            className="text-aqua-deep"
            style={{ fontFamily: "var(--font-pixel)", fontSize: "0.7rem" }}
          >
            Layar Penuh
          </span>
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label="Tutup layar penuh"
            className="pixel-card pixel-press grid h-10 w-10 place-items-center bg-card text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-[min(100%,calc((100vh-7rem)*16/9))]">
            {frame}
          </div>
        </div>
      </div>
    )
  }

  return frame
}
