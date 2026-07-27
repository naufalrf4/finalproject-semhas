import { useCallback, useEffect, useReducer } from "react"
import {
  FOOD_ITEMS,
  FOODS_PER_ROUND,
  ROUND_TARGETS,
  ROUND_TIME_MS,
  SKIM,
  WATER_MAX,
} from "#/data/game"
import type { FoodItem } from "#/lib/types"

type Phase = "idle" | "playing" | "cleared" | "over"

type GameState = {
  phase: Phase
  round: number
  target: number
  total: number
  water: number
  score: number
  timeLeft: number
  picked: string[]
  offer: FoodItem[]
}

type GameAction =
  | { type: "start" }
  | { type: "add"; item: FoodItem }
  | { type: "tick" }
  | { type: "next" }
  | { type: "reset" }

function roundConfig(round: number) {
  const idx = Math.min(round, ROUND_TARGETS.length - 1)
  return {
    target: ROUND_TARGETS[idx],
    time: ROUND_TIME_MS[idx],
    count: FOODS_PER_ROUND[idx],
  }
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function canReach(items: FoodItem[], target: number): boolean {
  let sums = new Set<number>([0])
  for (const item of items) {
    const next = new Set(sums)
    for (const s of sums) {
      const v = s + item.points
      if (v <= target) next.add(v)
    }
    sums = next
  }
  return sums.has(target)
}

function pickOffer(round: number, target: number): FoodItem[] {
  const { count } = roundConfig(round)
  for (let attempt = 0; attempt < 60; attempt += 1) {
    const offer = shuffle(FOOD_ITEMS).slice(0, count)
    if (canReach(offer, target)) {
      return [...offer].sort((a, b) => a.points - b.points)
    }
  }
  const anchor = FOOD_ITEMS.reduce((prev, cur) =>
    Math.abs(cur.points - target) < Math.abs(prev.points - target) ? cur : prev,
  )
  const rest = shuffle(FOOD_ITEMS.filter((f) => f.id !== anchor.id)).slice(0, count - 1)
  return [anchor, ...rest].sort((a, b) => a.points - b.points)
}

function initRound(round: number, score: number, water: number): GameState {
  const { target, time } = roundConfig(round)
  return {
    phase: "playing",
    round,
    target,
    total: 0,
    water,
    score,
    timeLeft: time,
    picked: [],
    offer: pickOffer(round, target),
  }
}

const INITIAL: GameState = {
  phase: "idle",
  round: 0,
  target: ROUND_TARGETS[0],
  total: 0,
  water: WATER_MAX,
  score: 0,
  timeLeft: ROUND_TIME_MS[0],
  picked: [],
  offer: [],
}

const TICK_MS = 100

function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "start":
      return initRound(0, 0, WATER_MAX)
    case "add": {
      if (state.phase !== "playing") return state
      if (state.picked.includes(action.item.id)) return state
      const picked = [...state.picked, action.item.id]
      const total = state.total + action.item.points
      if (total === state.target) {
        const bonus = Math.ceil(state.timeLeft / 1000)
        return {
          ...state,
          total,
          picked,
          phase: "cleared",
          score: state.score + 10 + bonus + state.round * 2,
        }
      }
      if (total > state.target) {
        const water = state.water - 1
        if (water <= 0) return { ...state, total, picked, water: 0, phase: "over" }
        return { ...state, total, picked, water }
      }
      return { ...state, total, picked }
    }
    case "tick": {
      if (state.phase !== "playing") return state
      const timeLeft = state.timeLeft - TICK_MS
      if (timeLeft <= 0) {
        const water = state.water - 1
        if (water <= 0) return { ...state, timeLeft: 0, water: 0, phase: "over" }
        return {
          ...state,
          timeLeft: roundConfig(state.round).time,
          water,
          total: 0,
          picked: [],
          offer: pickOffer(state.round, state.target),
        }
      }
      return { ...state, timeLeft }
    }
    case "next":
      return initRound(state.round + 1, state.score, state.water)
    case "reset":
      return INITIAL
    default:
      return state
  }
}

export function useFeedGame() {
  const [state, dispatch] = useReducer(reducer, INITIAL)

  useEffect(() => {
    if (state.phase !== "playing") return
    const id = window.setInterval(() => dispatch({ type: "tick" }), TICK_MS)
    return () => window.clearInterval(id)
  }, [state.phase, state.round])

  const start = useCallback(() => dispatch({ type: "start" }), [])
  const add = useCallback((item: FoodItem) => dispatch({ type: "add", item }), [])
  const next = useCallback(() => dispatch({ type: "next" }), [])
  const reset = useCallback(() => dispatch({ type: "reset" }), [])

  return { state, start, add, next, reset, foods: state.offer, skim: SKIM, waterMax: WATER_MAX }
}
