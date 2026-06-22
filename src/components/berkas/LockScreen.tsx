import { Link } from "@tanstack/react-router"
import { ArrowLeft, Lock } from "lucide-react"
import { useEffect } from "react"
import { useSfx } from "#/lib/sfx"

type LockScreenProps = {
  title: string
  message: string
}

export function LockScreen({ title, message }: LockScreenProps) {
  const sfx = useSfx()

  useEffect(() => {
    sfx("lock")
  }, [sfx])

  return (
    <div className="flex flex-col items-center justify-center gap-6 py-16 text-center">
      <div
        className="pixel-card grid h-28 w-28 place-items-center bg-paper-2"
        style={{ animation: "pixel-rise 0.3s steps(5, end)" }}
      >
        <Lock className="h-12 w-12 text-aqua-deep" strokeWidth={2.5} />
      </div>
      <h1
        className="text-aqua-deep"
        style={{ fontFamily: "var(--font-pixel)", fontSize: "1.1rem" }}
      >
        {title}
      </h1>
      <p className="max-w-md text-ink-soft">{message}</p>
      <Link
        to="/berkas"
        onClick={() => sfx("nav")}
        className="pixel-card pixel-press inline-flex items-center gap-2 bg-card px-5 py-3 text-ink"
        style={{ fontFamily: "var(--font-pixel)", fontSize: "0.7rem" }}
      >
        <ArrowLeft className="h-4 w-4" />
        Kembali
      </Link>
    </div>
  )
}
