import { createFileRoute } from "@tanstack/react-router"
import { Link } from "@tanstack/react-router"
import { ArrowLeft } from "lucide-react"
import { useSfx } from "#/lib/sfx"
import { DeckEmbed } from "#/components/berkas/DeckEmbed"

export const Route = createFileRoute("/berkas/paparan")({ component: Paparan })

function Paparan() {
  const sfx = useSfx()
  return (
    <div className="flex flex-col gap-4">
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
          style={{ fontFamily: "var(--font-pixel)", fontSize: "0.8rem" }}
        >
          Paparan
        </h1>
      </div>
      <DeckEmbed src="/ppt/index.html" />
    </div>
  )
}
