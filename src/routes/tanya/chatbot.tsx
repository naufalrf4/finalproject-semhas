import { useMemo, useState } from "react"
import { createFileRoute, Link } from "@tanstack/react-router"
import { QA_DATA } from "#/data/qa"
import type { QaItem } from "#/lib/types"
import { useSfx } from "#/lib/sfx"
import { ChatBubble } from "#/components/tanya/ChatBubble"
import { useTypewriter } from "#/components/tanya/useTypewriter"

export const Route = createFileRoute("/tanya/chatbot")({ component: Chatbot })

type Turn = { id: string; role: "bot" | "user" | "system"; text: string }

const GREETING =
  "Halo, saya asisten tanya-jawab proyek akhir. Pilih salah satu pertanyaan di bawah, nanti saya jawab."

function pickStarters(count: number): QaItem[] {
  return QA_DATA.slice(0, count)
}

function resolveSuggests(item: QaItem): QaItem[] {
  const mapped = item.suggests
    .map((id) => QA_DATA.find((q) => q.id === id))
    .filter((q): q is QaItem => Boolean(q))
  if (mapped.length > 0) return mapped
  return QA_DATA.filter((q) => q.id !== item.id).slice(0, 2)
}

function BotAnswer({ text }: { text: string }) {
  const { shown } = useTypewriter(text)
  return <span>{shown}</span>
}

function Chatbot() {
  const sfx = useSfx()
  const [turns, setTurns] = useState<Turn[]>([
    { id: "greet", role: "bot", text: GREETING },
  ])
  const [options, setOptions] = useState<QaItem[]>(() => pickStarters(3))
  const [seq, setSeq] = useState(0)

  const askedQuestions = useMemo(
    () => new Set(turns.filter((t) => t.role === "user").map((t) => t.text)),
    [turns],
  )

  const ask = (item: QaItem) => {
    sfx("send")
    const base = seq
    setSeq((n) => n + 2)
    setTurns((prev) => [
      ...prev,
      { id: `u-${base}`, role: "user", text: item.question },
      { id: `b-${base}`, role: "bot", text: item.answer.join(" ") },
    ])
    setOptions(resolveSuggests(item))
  }

  const reset = () => {
    sfx("tick")
    setTurns([{ id: "greet", role: "bot", text: GREETING }])
    setOptions(pickStarters(3))
    setSeq(0)
  }

  return (
    <section className="flex w-full flex-col items-center gap-6 px-4 py-10">
      <div className="flex w-full max-w-2xl flex-col gap-5">
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
            TANYA CHATBOT
          </h1>
          <p className="text-ink-soft">
            Pilih pertanyaan, jawaban muncul otomatis. Tidak perlu mengetik.
          </p>
        </header>

        <div className="pixel-card flex max-h-[60vh] flex-col gap-3 overflow-y-auto p-4">
          {turns.map((turn) =>
            turn.role === "bot" && turn.id.startsWith("b-") ? (
              <ChatBubble key={turn.id} role="bot">
                <BotAnswer text={turn.text} />
              </ChatBubble>
            ) : (
              <ChatBubble key={turn.id} role={turn.role}>
                {turn.text}
              </ChatBubble>
            ),
          )}
        </div>

        <div className="flex flex-col gap-2">
          <p
            className="text-xs text-ink-soft"
            style={{ fontFamily: "var(--font-pixel)" }}
          >
            PILIH PERTANYAAN
          </p>
          <div className="flex flex-col gap-2">
            {options.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => ask(item)}
                onMouseEnter={() => sfx("tick")}
                disabled={askedQuestions.has(item.question)}
                className="pixel-border pixel-press bg-card px-3 py-2 text-left text-ink hover:bg-paper-2 disabled:opacity-50"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {item.question}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={reset}
            className="pixel-border pixel-press mt-2 w-fit bg-paper-2 px-3 py-2 text-xs text-ink"
            style={{ fontFamily: "var(--font-pixel)" }}
          >
            MULAI ULANG
          </button>
        </div>
      </div>
    </section>
  )
}
