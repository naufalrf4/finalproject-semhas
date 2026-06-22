import type { VisitorSession } from "#/lib/types"

const KEY = "semhas:visitor"

const PROFANITY = [
  "anjing",
  "bangsat",
  "kontol",
  "memek",
  "asu",
  "babi",
  "tai",
  "jancok",
  "goblok",
]

const KEYBOARD_MASH = /(qwer|asdf|zxcv|hjkl|wasd|qwert|asdfg)/i

export function validateName(raw: string): string | null {
  const n = (raw ?? "").trim().replace(/\s+/g, " ")
  if (n.length < 3) return "Nama minimal 3 huruf."
  if (n.length > 40) return "Nama terlalu panjang."
  if (!/[aeiou]/i.test(n)) return "Nama tidak valid."
  if (/(.)\1{3,}/.test(n)) return "Nama tidak valid."
  if (/[0-9]/.test(n)) return "Nama tidak boleh ada angka."
  if (/[^a-zA-Z\s.\u00c0-\u017f'-]/.test(n)) return "Nama hanya huruf."
  const letters = n.replace(/[^a-zA-Z]/g, "")
  const vowels = (letters.match(/[aeiou]/gi) ?? []).length
  if (letters.length === 0 || vowels / letters.length < 0.2)
    return "Nama tidak terlihat asli."
  if (KEYBOARD_MASH.test(n)) return "Nama tidak terlihat asli."
  if (PROFANITY.some((p) => n.toLowerCase().includes(p)))
    return "Mohon pakai nama yang sopan."
  return null
}

export function normalizeName(raw: string): string {
  return raw.trim().replace(/\s+/g, " ")
}

export function loadSession(): VisitorSession | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as VisitorSession
    if (!parsed?.name) return null
    return parsed
  } catch {
    return null
  }
}

export function saveSession(name: string): VisitorSession {
  const session: VisitorSession = { name: normalizeName(name), enteredAt: Date.now() }
  try {
    localStorage.setItem(KEY, JSON.stringify(session))
  } catch {
    void 0
  }
  return session
}

export function clearSession(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    void 0
  }
}
