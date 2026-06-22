import type { SupportMessage, GameScore, GuestEntry } from "#/lib/types"

type ApiOk<T> = { ok: true; data: T }
type ApiErr = { ok: false; error: string }
export type ApiResult<T> = ApiOk<T> | ApiErr

async function request<T>(
  path: string,
  init?: RequestInit,
): Promise<ApiResult<T>> {
  try {
    const res = await fetch(`/api${path}`, {
      headers: { "Content-Type": "application/json" },
      ...init,
    })
    const json = (await res.json().catch(() => ({}))) as Record<string, unknown>
    if (!res.ok) {
      return { ok: false, error: (json.error as string) ?? "Gangguan jaringan." }
    }
    return { ok: true, data: json as T }
  } catch {
    return { ok: false, error: "Tidak dapat terhubung ke server." }
  }
}

export const api = {
  listSupport: () =>
    request<{ items: SupportMessage[] }>("/support"),
  sendSupport: (message: string, name: string, anonymous: boolean) =>
    request<{ item: SupportMessage }>("/support", {
      method: "POST",
      body: JSON.stringify({ message, name, anonymous }),
    }),
  heart: (id: string) =>
    request<{ item: SupportMessage }>(`/support/${id}/heart`, {
      method: "POST",
    }),
  listScores: () => request<{ items: GameScore[] }>("/scores"),
  sendScore: (name: string, score: number, rounds: number) =>
    request<{ item: GameScore }>("/scores", {
      method: "POST",
      body: JSON.stringify({ name, score, rounds }),
    }),
  joinGuestbook: (name: string) =>
    request<{ item: GuestEntry }>("/guests", {
      method: "POST",
      body: JSON.stringify({ name }),
    }),
  listGuests: () => request<{ items: GuestEntry[] }>("/guests"),
  sendChat: (name: string, text: string) =>
    request<{ item: unknown }>("/chat", {
      method: "POST",
      body: JSON.stringify({ name, text }),
    }),
}
