import type { GameScore } from "#/lib/types"

type LeaderboardProps = {
  scores: GameScore[]
  currentName: string | null
}

export function Leaderboard({ scores, currentName }: LeaderboardProps) {
  const top = scores.slice(0, 10)

  if (top.length === 0) {
    return (
      <div
        className="pixel-border bg-card px-4 py-6 text-center text-ink-soft"
        style={{ fontFamily: "var(--font-body)" }}
      >
        Belum ada skor. Jadilah yang pertama.
      </div>
    )
  }

  return (
    <div className="pixel-card flex flex-col gap-1 p-3">
      <p
        className="mb-2 text-xs text-aqua"
        style={{ fontFamily: "var(--font-pixel)" }}
      >
        PAPAN SKOR
      </p>
      {top.map((entry, index) => {
        const mine = currentName !== null && entry.name === currentName
        return (
          <div
            key={entry.id}
            className={
              mine
                ? "flex items-center justify-between bg-gold px-2 py-1 text-ink"
                : "flex items-center justify-between px-2 py-1 text-ink"
            }
            style={{ fontFamily: "var(--font-body)" }}
          >
            <span className="flex items-center gap-2">
              <span
                className="text-xs text-ink-soft"
                style={{ fontFamily: "var(--font-pixel)" }}
              >
                {index + 1}
              </span>
              {entry.name}
            </span>
            <span style={{ fontFamily: "var(--font-pixel)" }} className="text-sm">
              {entry.score}
            </span>
          </div>
        )
      })}
    </div>
  )
}
