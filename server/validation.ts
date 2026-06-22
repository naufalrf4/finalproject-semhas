export type ValidationResult = { ok: true; value: string } | { ok: false; error: string }

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

export function validateName(raw: unknown): ValidationResult {
  if (typeof raw !== "string") return { ok: false, error: "Nama tidak valid." }
  const n = raw.trim().replace(/\s+/g, " ")
  if (n.length < 3) return { ok: false, error: "Nama minimal 3 huruf." }
  if (n.length > 40) return { ok: false, error: "Nama terlalu panjang." }
  if (!/[aeiou]/i.test(n)) return { ok: false, error: "Nama tidak valid." }
  if (/(.)\1{3,}/.test(n)) return { ok: false, error: "Nama tidak valid." }
  if (/[0-9]/.test(n)) return { ok: false, error: "Nama tidak boleh ada angka." }
  if (/[^a-zA-Z\s.\u00c0-\u017f'-]/.test(n)) return { ok: false, error: "Nama hanya huruf." }
  const letters = n.replace(/[^a-zA-Z]/g, "")
  const vowels = (letters.match(/[aeiou]/gi) ?? []).length
  if (letters.length === 0 || vowels / letters.length < 0.2)
    return { ok: false, error: "Nama tidak terlihat asli." }
  if (KEYBOARD_MASH.test(n)) return { ok: false, error: "Nama tidak terlihat asli." }
  if (PROFANITY.some((p) => n.toLowerCase().includes(p)))
    return { ok: false, error: "Mohon pakai nama yang sopan." }
  return { ok: true, value: n }
}

export function validateMessage(raw: unknown, max: number): ValidationResult {
  if (typeof raw !== "string") return { ok: false, error: "Pesan tidak valid." }
  const m = raw.trim().replace(/\s+/g, " ")
  if (m.length < 1) return { ok: false, error: "Pesan kosong." }
  if (m.length > max) return { ok: false, error: "Pesan terlalu panjang." }
  if (PROFANITY.some((p) => m.toLowerCase().includes(p)))
    return { ok: false, error: "Mohon jaga bahasa." }
  return { ok: true, value: m }
}

export function validateScore(
  raw: unknown,
): { ok: true; num: number } | { ok: false; error: string } {
  const n = Number(raw)
  if (!Number.isFinite(n) || !Number.isInteger(n))
    return { ok: false, error: "Skor tidak valid." }
  if (n < 0 || n > 100000) return { ok: false, error: "Skor di luar jangkauan." }
  return { ok: true, num: n }
}
