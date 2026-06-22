export type VisitorSession = {
  name: string
  enteredAt: number
}

export type SupportMessage = {
  id: string
  name: string
  message: string
  hearts: number
  anonymous: boolean
  createdAt: number
}

export type ChatMessage = {
  id: string
  name: string
  text: string
  system: boolean
  createdAt: number
}

export type GuestEntry = {
  id: string
  name: string
  createdAt: number
}

export type GameScore = {
  id: string
  name: string
  score: number
  rounds: number
  createdAt: number
}

export type QaCategory =
  | "metodologi"
  | "validitas"
  | "sensor"
  | "keterbatasan"
  | "kebaruan"

export type QaItem = {
  id: string
  category: QaCategory
  question: string
  answer: string[]
  suggests: string[]
}

export type AppConfig = {
  semhasOnline: boolean
  zoomLink: string
  laporanUnlocked: boolean
  umamiSrc: string
  umamiWebsiteId: string
}

export type SfxName = "nav" | "open" | "tick" | "lock" | "start" | "send"

export type FoodItem = {
  id: string
  label: string
  points: number
  icon: string
}
