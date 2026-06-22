import type { FoodItem } from "#/lib/types"

export const FOOD_ITEMS: FoodItem[] = [
  { id: "artemia", label: "Artemia", points: 1, icon: "~" },
  { id: "pelet", label: "Pelet", points: 2, icon: "o" },
  { id: "cacing-beku", label: "Cacing Beku", points: 3, icon: "=" },
  { id: "cacing-sutra", label: "Cacing Sutra", points: 4, icon: "S" },
  { id: "bloodworm", label: "Bloodworm", points: 5, icon: "#" },
]

export const SKIM = { id: "skim", label: "Buang Sisa", points: -2, icon: "x" }

export const ROUND_TARGETS = [5, 8, 10, 13, 15, 17, 20, 23, 27, 30]
export const ROUND_TIME_MS = [18000, 16000, 14000, 13000, 12000, 11000, 10000, 9000, 8000, 7000]
export const WATER_MAX = 5
