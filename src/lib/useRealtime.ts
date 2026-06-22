import { useEffect } from "react"
import { useAppStore } from "#/lib/store"
import type { SupportMessage } from "#/lib/types"

export function useRealtime() {
  const applySupport = useAppStore((s) => s.applySupportNew)
  const applyHeart = useAppStore((s) => s.applyHeart)
  const applyChat = useAppStore((s) => s.addChat)
  const setOnline = useAppStore((s) => s.setOnline)

  useEffect(() => {
    let es: EventSource | null = null
    let stopped = false
    let retry: number | null = null

    const connect = () => {
      if (stopped) return
      es = new EventSource("/api/stream")

      es.addEventListener("support:new", (e) => {
        const data = JSON.parse((e as MessageEvent).data) as SupportMessage
        applySupport(data)
      })
      es.addEventListener("support:heart", (e) => {
        const data = JSON.parse((e as MessageEvent).data) as {
          id: string
          hearts: number
        }
        applyHeart(data.id, data.hearts)
      })
      es.addEventListener("chat:new", (e) => {
        const data = JSON.parse((e as MessageEvent).data) as {
          id: string
          name: string
          text: string
          createdAt: number
        }
        applyChat({ ...data, system: false })
      })
      es.addEventListener("presence", (e) => {
        const data = JSON.parse((e as MessageEvent).data) as { online: number }
        setOnline(data.online)
      })
      es.onerror = () => {
        es?.close()
        if (!stopped) retry = window.setTimeout(connect, 3000)
      }
    }

    connect()
    return () => {
      stopped = true
      if (retry !== null) window.clearTimeout(retry)
      es?.close()
    }
  }, [applySupport, applyHeart, applyChat, setOnline])
}
