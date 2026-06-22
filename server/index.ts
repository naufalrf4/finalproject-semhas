import { Hono } from "hono"
import { stream } from "hono/streaming"
import { migrate } from "./db"
import { subscribe, publish, presenceCount } from "./bus"
import { rateLimit } from "./rateLimit"
import { validateName, validateMessage, validateScore } from "./validation"
import {
  listSupport,
  insertSupport,
  heartSupport,
} from "./support.repo"
import { topScores, insertScore, upsertGuest, listGuests } from "./game.repo"

const app = new Hono()

function clientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  )
}

app.get("/api/health", (c) => c.json({ ok: true }))

app.get("/api/config", (c) =>
  c.json({
    semhasOnline: process.env.SEMHAS_ONLINE === "true",
    zoomLink: process.env.SEMHAS_ONLINE === "true" ? process.env.ZOOM_LINK ?? "" : "",
    laporanUnlocked: process.env.LAPORAN_UNLOCKED === "true",
  }),
)

app.get("/api/support", async (c) => {
  const rows = await listSupport()
  return c.json({ items: rows })
})

app.post("/api/support", async (c) => {
  const ip = clientIp(c.req.raw.headers)
  if (!rateLimit(`support:${ip}`, 5, 60000))
    return c.json({ error: "Terlalu sering. Coba lagi nanti." }, 429)
  const body = await c.req.json().catch(() => null)
  if (!body) return c.json({ error: "Permintaan tidak valid." }, 400)
  const anonymous = body.anonymous === true
  const nameCheck = anonymous
    ? { ok: true as const, value: "Anonim" }
    : validateName(body.name)
  if (!nameCheck.ok) return c.json({ error: nameCheck.error }, 400)
  const msgCheck = validateMessage(body.message, 160)
  if (!msgCheck.ok) return c.json({ error: msgCheck.error }, 400)
  const row = await insertSupport(nameCheck.value, msgCheck.value, anonymous)
  publish("support:new", row)
  return c.json({ item: row }, 201)
})

app.post("/api/support/:id/heart", async (c) => {
  const ip = clientIp(c.req.raw.headers)
  const id = c.req.param("id")
  if (!/^\d+$/.test(id)) return c.json({ error: "ID tidak valid." }, 400)
  if (!rateLimit(`heart:${ip}:${id}`, 3, 10000))
    return c.json({ error: "Terlalu sering." }, 429)
  const row = await heartSupport(id)
  if (!row) return c.json({ error: "Tidak ditemukan." }, 404)
  publish("support:heart", { id: row.id, hearts: row.hearts })
  return c.json({ item: row })
})

app.get("/api/scores", async (c) => {
  const rows = await topScores(10)
  return c.json({ items: rows })
})

app.post("/api/scores", async (c) => {
  const ip = clientIp(c.req.raw.headers)
  if (!rateLimit(`score:${ip}`, 10, 60000))
    return c.json({ error: "Terlalu sering." }, 429)
  const body = await c.req.json().catch(() => null)
  if (!body) return c.json({ error: "Permintaan tidak valid." }, 400)
  const nameCheck = validateName(body.name)
  if (!nameCheck.ok) return c.json({ error: nameCheck.error }, 400)
  const scoreCheck = validateScore(body.score)
  if (!scoreCheck.ok) return c.json({ error: scoreCheck.error }, 400)
  const rounds = Number.isInteger(body.rounds) ? body.rounds : 1
  const row = await insertScore(nameCheck.value, scoreCheck.num, rounds)
  publish("score:new", row)
  return c.json({ item: row }, 201)
})

app.get("/api/guests", async (c) => {
  const rows = await listGuests()
  return c.json({ items: rows })
})

app.post("/api/guests", async (c) => {
  const ip = clientIp(c.req.raw.headers)
  if (!rateLimit(`guest:${ip}`, 3, 60000))
    return c.json({ error: "Terlalu sering." }, 429)
  const body = await c.req.json().catch(() => null)
  if (!body) return c.json({ error: "Permintaan tidak valid." }, 400)
  const nameCheck = validateName(body.name)
  if (!nameCheck.ok) return c.json({ error: nameCheck.error }, 400)
  const row = await upsertGuest(nameCheck.value)
  publish("guest:new", row)
  publish("presence", { online: presenceCount() })
  return c.json({ item: row }, 201)
})

app.post("/api/chat", async (c) => {
  const ip = clientIp(c.req.raw.headers)
  if (!rateLimit(`chat:${ip}`, 12, 30000))
    return c.json({ error: "Terlalu sering." }, 429)
  const body = await c.req.json().catch(() => null)
  if (!body) return c.json({ error: "Permintaan tidak valid." }, 400)
  const nameCheck = validateName(body.name)
  if (!nameCheck.ok) return c.json({ error: nameCheck.error }, 400)
  const msgCheck = validateMessage(body.text, 200)
  if (!msgCheck.ok) return c.json({ error: msgCheck.error }, 400)
  const msg = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: nameCheck.value,
    text: msgCheck.value,
    createdAt: Date.now(),
  }
  publish("chat:new", msg)
  return c.json({ item: msg }, 201)
})

app.get("/api/stream", (c) => {
  return stream(c, async (s) => {
    c.header("Content-Type", "text/event-stream")
    c.header("Cache-Control", "no-cache")
    c.header("Connection", "keep-alive")
    const send = (event: string, data: unknown) =>
      s.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
    await send("presence", { online: presenceCount() + 1 })
    const unsub = subscribe((event, data) => {
      void send(event, data)
    })
    publish("presence", { online: presenceCount() })
    const ping = setInterval(() => void send("ping", { t: Date.now() }), 25000)
    const presence = setInterval(
      () => void send("presence", { online: presenceCount() }),
      15000,
    )
    s.onAbort(() => {
      clearInterval(ping)
      clearInterval(presence)
      unsub()
      publish("presence", { online: presenceCount() })
    })
    await new Promise<void>((resolve) => s.onAbort(resolve))
  })
})

const port = Number(process.env.PORT ?? 8080)

migrate()
  .then(() => {
    console.log(`api ready on ${port}`)
  })
  .catch((err) => {
    console.error("migrate failed", err)
    process.exit(1)
  })

export default { port, fetch: app.fetch }
