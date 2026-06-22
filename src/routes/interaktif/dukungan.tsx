import { useState } from "react"
import { createFileRoute, Link } from "@tanstack/react-router"
import { Plus } from "lucide-react"
import { useAppStore } from "#/lib/store"
import { useSfx } from "#/lib/sfx"
import { api } from "#/lib/api"
import { SupportWall } from "#/components/dukungan/SupportWall"
import { SupportComposer } from "#/components/dukungan/SupportComposer"

export const Route = createFileRoute("/interaktif/dukungan")({ component: Dukungan })

function Dukungan() {
  const sfx = useSfx()
  const support = useAppStore((s) => s.support)
  const [open, setOpen] = useState(false)

  const heart = (id: string) => {
    void api.heart(id)
  }


  return (
    <section className="flex w-full flex-col items-center gap-6 px-4 py-10">
      <div className="flex w-full max-w-3xl flex-col gap-5">
        <Link
          to="/interaktif"
          onClick={() => sfx("nav")}
          className="pixel-border pixel-press inline-flex w-fit items-center gap-2 bg-paper-2 px-3 py-2 text-sm text-ink no-underline"
          style={{ fontFamily: "var(--font-pixel)" }}
        >
          <span aria-hidden="true">{"<"}</span>
          INTERAKTIF
        </Link>

        <header className="flex flex-col gap-2">
          <h1 className="text-xl text-aqua" style={{ fontFamily: "var(--font-pixel)" }}>
            DUKUNGAN
          </h1>
          <p className="text-ink-soft">
            Tinggalkan pesan dukungan, tampil langsung untuk semua yang hadir.
          </p>
        </header>

        <div className="flex items-center justify-between">
          <span
            className="text-xs text-ink-soft"
            style={{ fontFamily: "var(--font-pixel)" }}
          >
            {support.length} DUKUNGAN
          </span>
          <button
            type="button"
            onClick={() => {
              sfx("open")
              setOpen(true)
            }}
            className="pixel-card pixel-press inline-flex items-center gap-2 bg-aqua px-4 py-2 text-primary-foreground"
            style={{ fontFamily: "var(--font-pixel)" }}
          >
            <Plus className="size-4" />
            TULIS
          </button>
        </div>

        <SupportWall messages={support} onHeart={heart} />
      </div>

      <SupportComposer open={open} onOpenChange={setOpen} />
    </section>
  )
}
