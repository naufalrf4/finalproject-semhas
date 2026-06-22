import { create } from "zustand"
import type {
  ChatMessage,
  GameScore,
  GuestEntry,
  SupportMessage,
  VisitorSession,
} from "#/lib/types"
import { loadSession, saveSession } from "#/lib/session"

type AppState = {
  session: VisitorSession | null
  booted: boolean
  muted: boolean
  onboarded: boolean
  onlineCount: number
  guests: GuestEntry[]
  support: SupportMessage[]
  chat: ChatMessage[]
  scores: GameScore[]
  chatUnread: number
  chatOpen: boolean
}

type AppActions = {
  boot: () => void
  enter: (name: string) => void
  toggleMute: () => void
  setOnboarded: (v: boolean) => void
  setOnline: (n: number) => void
  addGuest: (e: GuestEntry) => void
  addSupport: (m: SupportMessage) => void
  applySupportNew: (m: SupportMessage) => void
  applyHeart: (id: string, hearts: number) => void
  heart: (id: string) => void
  addChat: (m: ChatMessage) => void
  setChatOpen: (v: boolean) => void
  addScore: (s: GameScore) => void
  hydrate: () => void
}

export const useAppStore = create<AppState & AppActions>((set, get) => ({
  session: null,
  booted: false,
  muted: false,
  onboarded: false,
  onlineCount: 1,
  guests: [],
  support: [],
  chat: [],
  scores: [],
  chatUnread: 0,
  chatOpen: false,

  boot: () => set({ booted: true }),
  enter: (name) => {
    const session = saveSession(name)
    set({ session })
  },
  toggleMute: () => set((s) => ({ muted: !s.muted })),
  setOnboarded: (v) => set({ onboarded: v }),
  setOnline: (n) => set({ onlineCount: Math.max(1, n) }),
  addGuest: (e) => set((s) => ({ guests: [e, ...s.guests] })),
  addSupport: (m) => set((s) => ({ support: [m, ...s.support] })),
  applySupportNew: (m) =>
    set((s) =>
      s.support.some((x) => x.id === m.id)
        ? s
        : { support: [m, ...s.support] },
    ),
  applyHeart: (id, hearts) =>
    set((s) => ({
      support: s.support.map((m) => (m.id === id ? { ...m, hearts } : m)),
    })),
  heart: (id) =>
    set((s) => ({
      support: s.support.map((m) =>
        m.id === id ? { ...m, hearts: m.hearts + 1 } : m,
      ),
    })),
  addChat: (m) =>
    set((s) => ({
      chat: [...s.chat, m],
      chatUnread: s.chatOpen || m.system ? s.chatUnread : s.chatUnread + 1,
    })),
  setChatOpen: (v) => set({ chatOpen: v, chatUnread: v ? 0 : get().chatUnread }),
  addScore: (s2) =>
    set((s) => ({
      scores: [...s.scores, s2].sort((a, b) => b.score - a.score).slice(0, 50),
    })),
  hydrate: () => {
    const session = loadSession()
    if (session) set({ session })
  },
}))
