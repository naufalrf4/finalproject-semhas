import { ArrowLeft } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Link } from "@tanstack/react-router"
import { useSfx } from "#/lib/sfx"

type DeckEmbedProps = {
  src: string
}

export function DeckEmbed({ src }: DeckEmbedProps) {
  const sfx = useSfx()
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
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

  return (
    <div className="fixed inset-0 z-[120] flex flex-col gap-3 bg-paper p-3 sm:p-4">
      <div className="flex items-center justify-between gap-3">
        <Link
          to="/berkas"
          onClick={() => sfx("nav")}
          className="pixel-card pixel-press inline-flex items-center gap-2 bg-card px-4 py-2 text-ink"
          style={{ fontFamily: "var(--font-pixel)", fontSize: "0.65rem" }}
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Link>
        <h1
          className="text-aqua-deep"
          style={{ fontFamily: "var(--font-pixel)", fontSize: "0.75rem" }}
        >
          Paparan
        </h1>
      </div>
      <div className="flex flex-1 items-center justify-center overflow-hidden">
        <div className="relative w-full max-w-[min(100%,calc((100vh-7rem)*16/9))] overflow-hidden pixel-border bg-paper-2">
          <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
            {!loaded && !failed ? (
              <div className="absolute inset-0 grid place-items-center bg-paper-2">
                <div className="relative h-2 w-40 overflow-hidden bg-card pixel-border">
                  <div
                    className="absolute inset-y-0 w-1/3 bg-aqua"
                    style={{
                      animation: "pixel-shimmer 1.1s steps(8, end) infinite",
                    }}
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
                title="Paparan"
                src={src}
                onLoad={() => {
                  setLoaded(true)
                  setFailed(false)
                }}
                className="absolute inset-0 h-full w-full border-0"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
