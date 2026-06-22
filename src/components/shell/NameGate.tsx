import { useState, type KeyboardEvent } from "react"
import { Input } from "#/components/ui/input"
import { Button } from "#/components/ui/button"
import { useAppStore } from "#/lib/store"
import { useSfx } from "#/lib/sfx"
import { validateName } from "#/lib/session"

export function NameGate({ onDone }: { onDone: () => void }) {
  const [value, setValue] = useState("")
  const [error, setError] = useState<string | null>(null)
  const enter = useAppStore((s) => s.enter)
  const sfx = useSfx()

  const submit = () => {
    const err = validateName(value)
    if (err) {
      setError(err)
      return
    }
    sfx("start")
    enter(value)
    onDone()
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      submit()
    }
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[color-mix(in_oklch,var(--shadow-pixel)_55%,transparent)] px-4">
      <div className="pixel-card flex w-full max-w-[460px] flex-col items-center p-6 sm:p-8">
        <svg
          width={60}
          height={45}
          viewBox="0 0 32 24"
          aria-hidden="true"
          className="text-cyan"
          style={{
            imageRendering: "pixelated",
            filter: "drop-shadow(2px 2px 0 var(--shadow-pixel))",
            animation: "pixel-bob 1.4s steps(4,end) infinite",
          }}
        >
          <use href="#discus" />
        </svg>
        <p
          className="mt-3 text-center text-[10px] leading-relaxed text-aqua-deep sm:text-xs"
          style={{ fontFamily: "var(--font-pixel)" }}
        >
          SIAPA NAMAMU?
        </p>
        <p className="mt-3 text-center text-ink-soft">
          Tinggalkan namamu sebelum masuk ke ruang proyek akhir.
        </p>
        <div className="mt-5">
          <Input
            autoFocus
            value={value}
            onChange={(e) => {
              setValue(e.target.value)
              if (error) setError(null)
            }}
            onKeyDown={onKeyDown}
            placeholder="Nama lengkap"
            aria-label="Nama lengkap"
            aria-invalid={error ? true : undefined}
            className="pixel-border h-11 bg-paper text-center text-lg"
          />
          {error ? (
            <p className="mt-2 text-center text-base text-danger" role="alert">
              {error}
            </p>
          ) : null}
        </div>
        <Button
          onClick={submit}
          className="pixel-border pixel-press pixel-shadow mt-5 h-11 w-full bg-gold text-ink"
          style={{ fontFamily: "var(--font-pixel)", fontSize: "10px" }}
        >
          MASUK &gt;
        </Button>
      </div>
    </div>
  )
}
