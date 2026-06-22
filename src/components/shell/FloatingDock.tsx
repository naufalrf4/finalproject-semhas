import { useEffect, useRef, useState, type KeyboardEvent } from "react"
import { Volume2, VolumeX, MessageSquare, X, Send } from "lucide-react"
import { Toaster } from "#/components/ui/sonner"
import { useAppStore } from "#/lib/store"
import { useSfx } from "#/lib/sfx"
import { api } from "#/lib/api"

function OnlineIndicator() {
  const onlineCount = useAppStore((s) => s.onlineCount)
  return (
    <div className="pixel-border pixel-shadow pointer-events-auto flex items-center gap-2 bg-card px-3 py-2">
      <span
        className="inline-block size-3 bg-aqua"
        style={{ animation: "pixel-pulse 2s steps(4,end) infinite" }}
      />
      <span className="text-base text-ink-soft">{onlineCount} online</span>
    </div>
  )
}

function ChatBox() {
  const chat = useAppStore((s) => s.chat)
  const session = useAppStore((s) => s.session)
  const setChatOpen = useAppStore((s) => s.setChatOpen)
  const sfx = useSfx()
  const [draft, setDraft] = useState("")
  const listRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [chat])

  const send = () => {
    const text = draft.trim()
    if (!text || !session) return
    sfx("send")
    setDraft("")
    void api.sendChat(session.name, text)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="pixel-card pointer-events-auto flex h-[360px] w-[min(88vw,320px)] flex-col bg-card">
      <div className="flex items-center justify-between border-b-3 border-ink bg-aqua px-3 py-2">
        <span
          className="text-[10px] text-paper"
          style={{ fontFamily: "var(--font-pixel)" }}
        >
          CHAT
        </span>
        <button
          type="button"
          aria-label="Tutup chat"
          onClick={() => setChatOpen(false)}
          className="pixel-press text-paper"
        >
          <X className="size-4" />
        </button>
      </div>
      <div ref={listRef} className="flex-1 space-y-2 overflow-y-auto p-3">
        {chat.length === 0 ? (
          <p className="text-base text-ink-soft">
            Mulai obrolan. Ini ruang demo lokal.
          </p>
        ) : (
          chat.map((m) => (
            <div
              key={m.id}
              className={m.system ? "text-left" : "text-right"}
            >
              <span
                className={
                  m.system
                    ? "pixel-border inline-block max-w-[85%] bg-paper-2 px-2 py-1 text-left text-base text-ink"
                    : "pixel-border inline-block max-w-[85%] bg-cyan px-2 py-1 text-left text-base text-ink"
                }
              >
                {m.text}
              </span>
            </div>
          ))
        )}
      </div>
      <div className="flex items-center gap-2 border-t-3 border-ink p-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ketik pesan..."
          aria-label="Pesan chat"
          className="pixel-border h-9 w-full bg-paper px-2 text-base outline-none"
        />
        <button
          type="button"
          aria-label="Kirim"
          onClick={send}
          className="pixel-border pixel-press flex size-9 shrink-0 items-center justify-center bg-aqua text-paper"
        >
          <Send className="size-4" />
        </button>
      </div>
    </div>
  )
}

export function FloatingDock() {
  const muted = useAppStore((s) => s.muted)
  const toggleMute = useAppStore((s) => s.toggleMute)
  const setOnline = useAppStore((s) => s.setOnline)
  const onlineCount = useAppStore((s) => s.onlineCount)
  const chatOpen = useAppStore((s) => s.chatOpen)
  const chatUnread = useAppStore((s) => s.chatUnread)
  const setChatOpen = useAppStore((s) => s.setChatOpen)
  const sfx = useSfx()

  useEffect(() => {
    const id = window.setInterval(() => {
      const drift = Math.floor(Math.random() * 5) - 2
      setOnline(useAppStore.getState().onlineCount + drift)
    }, 6000)
    return () => window.clearInterval(id)
  }, [setOnline])

  useEffect(() => {
    setOnline(onlineCount + Math.floor(Math.random() * 7))
  }, [])

  return (
    <>
      <div className="pointer-events-none fixed bottom-4 left-4 z-[90]">
        <OnlineIndicator />
      </div>

      <div className="pointer-events-none fixed right-4 bottom-4 z-[90] flex flex-col items-end gap-3">
        {chatOpen ? <ChatBox /> : null}
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label={chatOpen ? "Tutup chat" : "Buka chat"}
            aria-expanded={chatOpen}
            onClick={() => {
              sfx("open")
              setChatOpen(!chatOpen)
            }}
            className="pixel-border pixel-press pixel-shadow pointer-events-auto relative flex size-12 items-center justify-center bg-cyan text-ink"
          >
            <MessageSquare className="size-5" />
            {chatUnread > 0 ? (
              <span className="pixel-border absolute -top-2 -right-2 flex size-5 items-center justify-center bg-danger text-[10px] text-paper">
                {chatUnread}
              </span>
            ) : null}
          </button>
          <button
            type="button"
            aria-label={muted ? "Bunyikan suara" : "Bisukan suara"}
            aria-pressed={muted}
            onClick={() => {
              toggleMute()
              if (muted) sfx("tick")
            }}
            className="pixel-border pixel-press pixel-shadow pointer-events-auto flex size-12 items-center justify-center bg-card text-ink"
          >
            {muted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
          </button>
        </div>
      </div>

      <Toaster position="top-center" />
    </>
  )
}
