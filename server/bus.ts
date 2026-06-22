type Listener = (event: string, data: unknown) => void

const listeners = new Set<Listener>()
const seen = new Map<string, number>()
const TTL_MS = 35000

export function subscribe(fn: Listener): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function publish(event: string, data: unknown): void {
  for (const fn of listeners) {
    try {
      fn(event, data)
    } catch {
      void 0
    }
  }
}

export function heartbeat(id: string): void {
  seen.set(id, Date.now())
}

export function drop(id: string): void {
  seen.delete(id)
}

export function presenceCount(): number {
  const now = Date.now()
  for (const [id, ts] of seen) {
    if (now - ts > TTL_MS) seen.delete(id)
  }
  return seen.size
}
