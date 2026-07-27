export const SEMHAS_START_ISO = "2026-07-29T08:00:00+07:00"
export const SEMHAS_END_ISO = "2026-07-29T10:00:00+07:00"
export const SEMHAS_TZ = "Asia/Jakarta"
export const SEMHAS_TITLE = "Seminar Hasil - Naufal Rizqullah Firdaus"
export const SEMHAS_OPEN_BEFORE_MS = 60 * 60 * 1000
export const SEMHAS_LOCATION = "Zoom Meeting"
export const SEMHAS_SITE_URL = "https://finalproject.nrflabs.net"
export const SEMHAS_DETAILS =
  "Seminar Hasil Tugas Akhir Naufal Rizqullah Firdaus. Detail: https://finalproject.nrflabs.net - Daftar dulu di https://fridasvipb.app lalu gabung via Zoom."
export const SEMHAS_REGISTER_URL = "https://fridasvipb.app"
export const SEMHAS_WHEN_LABEL = "Rabu, 29 Juli 2026 08:00 WIB"

export function getSemhasStartMs(): number {
  return new Date(SEMHAS_START_ISO).getTime()
}

export function buildGoogleCalendarUrl(zoomLink: string): string {
  const start = toGcalStamp(SEMHAS_START_ISO)
  const end = toGcalStamp(SEMHAS_END_ISO)
  const details = zoomLink
    ? `${SEMHAS_DETAILS}\n\nLink Zoom: ${zoomLink}`
    : SEMHAS_DETAILS
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: SEMHAS_TITLE,
    dates: `${start}/${end}`,
    details,
    location: SEMHAS_LOCATION,
    ctz: SEMHAS_TZ,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

function toGcalStamp(iso: string): string {
  const d = new Date(iso)
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, "0")
  const day = String(d.getUTCDate()).padStart(2, "0")
  const h = String(d.getUTCHours()).padStart(2, "0")
  const min = String(d.getUTCMinutes()).padStart(2, "0")
  const s = String(d.getUTCSeconds()).padStart(2, "0")
  return `${y}${m}${day}T${h}${min}${s}Z`
}

export type CountdownParts = {
  totalMs: number
  days: number
  hours: number
  minutes: number
  seconds: number
  live: boolean
  past: boolean
  zoomOpen: boolean
}

export function getCountdown(nowMs: number = Date.now()): CountdownParts {
  const start = getSemhasStartMs()
  const end = new Date(SEMHAS_END_ISO).getTime()
  const zoomOpen = nowMs >= start - SEMHAS_OPEN_BEFORE_MS && nowMs < end
  if (nowMs >= end) {
    return { totalMs: 0, days: 0, hours: 0, minutes: 0, seconds: 0, live: false, past: true, zoomOpen: false }
  }
  if (nowMs >= start) {
    return { totalMs: 0, days: 0, hours: 0, minutes: 0, seconds: 0, live: true, past: false, zoomOpen }
  }
  const totalMs = start - nowMs
  const totalSec = Math.floor(totalMs / 1000)
  const days = Math.floor(totalSec / 86400)
  const hours = Math.floor((totalSec % 86400) / 3600)
  const minutes = Math.floor((totalSec % 3600) / 60)
  const seconds = totalSec % 60
  return { totalMs, days, hours, minutes, seconds, live: false, past: false, zoomOpen }
}
