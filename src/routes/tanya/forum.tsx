import { useEffect, useMemo, useState } from "react"
import { createFileRoute, Link } from "@tanstack/react-router"
import { QA_DATA } from "#/data/qa"
import type { QaCategory } from "#/lib/types"
import { useSfx } from "#/lib/sfx"
import { QaAccordion } from "#/components/tanya/QaAccordion"
import { FilterChips, type FilterValue } from "#/components/tanya/FilterChips"

export const Route = createFileRoute("/tanya/forum")({ component: Forum })

const STORAGE_KEY = "semhas:qa-ready"
const CATEGORIES: FilterValue[] = [
  "all",
  "metodologi",
  "validitas",
  "sensor",
  "keterbatasan",
  "kebaruan",
]

function loadReady(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {}
  } catch {
    return {}
  }
}

function Forum() {
  const sfx = useSfx()
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<FilterValue>("all")
  const [ready, setReady] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setReady(loadReady())
  }, [])

  const toggleReady = (id: string) => {
    sfx("tick")
    setReady((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        void 0
      }
      return next
    })
  }

  const counts = useMemo(() => {
    const result: Partial<Record<FilterValue, number>> = { all: QA_DATA.length }
    for (const item of QA_DATA) {
      result[item.category] = (result[item.category] ?? 0) + 1
    }
    return result
  }, [])

  const readyCount = useMemo(
    () => QA_DATA.filter((item) => ready[item.id]).length,
    [ready],
  )

  return (
    <section className="flex w-full flex-col items-center gap-6 px-4 py-10">
      <div className="flex w-full max-w-3xl flex-col gap-5">
        <Link
          to="/tanya"
          onClick={() => sfx("nav")}
          className="pixel-border pixel-press inline-flex w-fit items-center gap-2 bg-paper-2 px-3 py-2 text-sm text-ink no-underline"
          style={{ fontFamily: "var(--font-pixel)" }}
        >
          <span aria-hidden="true">{"<"}</span>
          TANYA-JAWAB
        </Link>

        <header className="flex flex-col gap-2">
          <h1
            className="text-xl text-aqua"
            style={{ fontFamily: "var(--font-pixel)" }}
          >
            ANTISIPASI FORUM
          </h1>
          <p className="text-ink-soft">
            Pertanyaan yang mungkin muncul saat seminar, beserta poin jawaban saya.
          </p>
        </header>

        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Cari pertanyaan..."
          className="pixel-border bg-card px-3 py-2 text-ink outline-none focus:bg-paper-2"
          style={{ fontFamily: "var(--font-body)" }}
        />

        <FilterChips
          categories={CATEGORIES}
          active={category}
          onChange={(value) => {
            sfx("tick")
            setCategory(value)
          }}
          counts={counts}
        />

        <p
          className="text-xs text-ink-soft"
          style={{ fontFamily: "var(--font-pixel)" }}
        >
          {readyCount}/{QA_DATA.length} SIAP
        </p>

        <QaAccordion
          items={QA_DATA}
          ready={ready}
          onToggleReady={toggleReady}
          query={query}
          category={category as QaCategory | "all"}
        />
      </div>
    </section>
  )
}
