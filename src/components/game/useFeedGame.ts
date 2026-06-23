import { useCallback, useEffect, useReducer } from "react"
import {
  FOOD_ITEMS,
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
}

type GameAction =
  | { type: "start" }
  | { type: "add"; item: FoodItem }
  | { type: "tick" }
  | { type: "next" }
  | { type: "reset" }

function roundConfig(round: number) {
  const idx = Math.min(round, ROUND_TARGETS.length - 1)
  return { target: ROUND_TARGETS[idx], time: ROUND_TIME_MS[idx] }
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

  return { state, start, add, next, reset, foods: FOOD_ITEMS, skim: SKIM, waterMax: WATER_MAX }
}
