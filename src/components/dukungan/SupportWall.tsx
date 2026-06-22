import { Heart } from "lucide-react"
import type { SupportMessage } from "#/lib/types"
import { useSfx } from "#/lib/sfx"

type SupportWallProps = {
  messages: SupportMessage[]
  onHeart: (id: string) => void
}

export function SupportWall({ messages, onHeart }: SupportWallProps) {
  const sfx = useSfx()

  if (messages.length === 0) {
    return (
      <div
        className="pixel-border bg-card px-4 py-6 text-center text-ink-soft"
        style={{ fontFamily: "var(--font-body)" }}
      >
        Belum ada dukungan. Jadilah yang pertama.
      </div>
    )
  }

  return (
    <div className="columns-1 gap-3 sm:columns-2">
      {messages.map((msg) => (
        <article
          key={msg.id}
          className="pixel-card mb-3 flex break-inside-avoid flex-col gap-2 p-3 animate-[pixel-rise_0.3s_steps(4,end)_both]"
        >
          <p className="text-ink" style={{ fontFamily: "var(--font-body)" }}>
            {msg.message}
          </p>
          <div className="flex items-center justify-between">
            <span
              className="text-xs text-aqua"
              style={{ fontFamily: "var(--font-pixel)" }}
            >
              {msg.anonymous ? "ANONIM" : msg.name.toUpperCase()}
            </span>
            <button
              type="button"
              onClick={() => {
                sfx("tick")
                onHeart(msg.id)
              }}
              className="pixel-press inline-flex items-center gap-1 text-ink-soft hover:text-danger"
              aria-label="Suka"
            >
              <Heart className="size-4" />
              <span style={{ fontFamily: "var(--font-pixel)" }} className="text-xs">
                {msg.hearts}
              </span>
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}
