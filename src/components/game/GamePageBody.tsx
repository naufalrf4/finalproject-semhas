import { useEffect, useState } from "react"
import { Link } from "@tanstack/react-router"
import { useAppStore } from "#/lib/store"
import { useSfx } from "#/lib/sfx"
import { api } from "#/lib/api"
import type { GameScore } from "#/lib/types"
import { useFeedGame } from "#/components/game/useFeedGame"
import { Tank } from "#/components/game/Tank"
import { Leaderboard } from "#/components/game/Leaderboard"

export function GamePageBody() {
  const sfx = useSfx()
  const session = useAppStore((s) => s.session)
  const [scores, setScores] = useState<GameScore[]>([])
  const { state, start, add, next, reset, foods, skim } = useFeedGame()
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    void api.listScores().then((res) => {
      if (res.ok) setScores(res.data.items)
    })
  }, [])

  useEffect(() => {
    if (state.phase === "cleared") sfx("send")
    if (state.phase === "over") sfx("lock")
  }, [state.phase, sfx])

  useEffect(() => {
    if (state.phase === "over" && !saved) {
      setSaved(true)
      void api
        .sendScore(session?.name ?? "ANON", state.score, state.round + 1)
        .then(() => api.listScores())
        .then((res) => {
          if (res.ok) setScores(res.data.items)
        })
    }
    if (state.phase === "playing" && saved) setSaved(false)
  }, [state.phase, state.score, state.round, saved, session])

  const playing = state.phase === "playing"

  return (
    <section className="flex w-full flex-col items-center gap-6 px-4 py-10">
      <div className="flex w-full max-w-2xl flex-col gap-5">
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
            BERI MAKAN DISKUS
          </h1>
          <p className="text-ink-soft">
            Beri makan tepat sesuai target. Kelebihan pakan membuat TDS naik dan air keruh.
          </p>
        </header>

        <Tank water={state.water} waterMax={5} happy={state.phase !== "over"} />

        {state.phase === "idle" ? (
          <button
            type="button"
            onClick={() => {
              sfx("start")
              start()
            }}
            className="pixel-card pixel-press bg-aqua px-4 py-3 text-primary-foreground"
            style={{ fontFamily: "var(--font-pixel)" }}
          >
            MULAI
          </button>
        ) : null}

        {playing ? (
          <div className="flex flex-col gap-3">
            <div
              className="flex items-center justify-between text-sm text-ink"
              style={{ fontFamily: "var(--font-pixel)" }}
            >
              <span>RONDE {state.round + 1}</span>
              <span>SKOR {state.score}</span>
              <span>{Math.ceil(state.timeLeft / 1000)}s</span>
            </div>
            <div
              className="pixel-card p-3 text-center"
              style={{ fontFamily: "var(--font-pixel)" }}
            >
              <span className="text-ink-soft text-xs">TARGET GIZI</span>
              <div className="text-aqua text-2xl">
                {state.total} / {state.target}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {foods.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    sfx("tick")
                    add(item)
                  }}
                  className="pixel-card pixel-press flex flex-col items-center gap-1 px-2 py-3 text-ink"
                >
                  <span className="text-lg" style={{ fontFamily: "var(--font-pixel)" }}>
                    {item.icon}
                  </span>
                  <span className="text-sm">{item.label}</span>
                  <span
                    className="text-xs text-aqua"
                    style={{ fontFamily: "var(--font-pixel)" }}
                  >
                    +{item.points}
                  </span>
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  sfx("tick")
                  add(skim)
                }}
                className="pixel-card pixel-press flex flex-col items-center gap-1 px-2 py-3 text-ink"
              >
                <span className="text-lg" style={{ fontFamily: "var(--font-pixel)" }}>
                  {skim.icon}
                </span>
                <span className="text-sm">{skim.label}</span>
                <span
                  className="text-xs text-danger"
                  style={{ fontFamily: "var(--font-pixel)" }}
                >
                  {skim.points}
                </span>
              </button>
            </div>
          </div>
        ) : null}

        {state.phase === "cleared" ? (
          <button
            type="button"
            onClick={() => {
              sfx("nav")
              next()
            }}
            className="pixel-card pixel-press bg-aqua px-4 py-3 text-primary-foreground"
            style={{ fontFamily: "var(--font-pixel)" }}
          >
            RONDE BERIKUTNYA
          </button>
        ) : null}

        {state.phase === "over" ? (
          <div className="flex flex-col gap-3">
            <div
              className="pixel-card bg-paper-2 p-4 text-center text-ink"
              style={{ fontFamily: "var(--font-pixel)" }}
            >
              <div className="text-danger">AIR TERLALU KERUH</div>
              <div className="mt-2 text-aqua text-xl">SKOR {state.score}</div>
            </div>
            <button
              type="button"
              onClick={() => {
                sfx("start")
                reset()
                start()
              }}
              className="pixel-card pixel-press bg-aqua px-4 py-3 text-primary-foreground"
              style={{ fontFamily: "var(--font-pixel)" }}
            >
              MAIN LAGI
            </button>
          </div>
        ) : null}

        <Leaderboard scores={scores} currentName={session?.name ?? null} />
      </div>
    </section>
  )
}
