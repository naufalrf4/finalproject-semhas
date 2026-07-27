import type { FoodItem } from "#/lib/types"

export const FOOD_ITEMS: FoodItem[] = [
  { id: "artemia", label: "Artemia", points: 1, icon: "~" },
  { id: "infusoria", label: "Infusoria", points: 2, icon: "." },
  { id: "pelet", label: "Pelet", points: 3, icon: "o" },
  { id: "kutu-air", label: "Kutu Air", points: 4, icon: "*" },
  { id: "cacing-beku", label: "Cacing Beku", points: 5, icon: "=" },
  { id: "jentik", label: "Jentik", points: 6, icon: "j" },
  { id: "cacing-sutra", label: "Cacing Sutra", points: 7, icon: "S" },
  { id: "udang", label: "Udang Cincang", points: 8, icon: "U" },
  { id: "bloodworm", label: "Bloodworm", points: 9, icon: "#" },
  { id: "daphnia", label: "Daphnia", points: 10, icon: "d" },
  { id: "tubifex", label: "Tubifex", points: 11, icon: "t" },
  { id: "krill", label: "Krill", points: 12, icon: "k" },
]

export const SKIM = { id: "skim", label: "Buang Sisa", points: -2, icon: "x" }

export const ROUND_TARGETS = [9, 13, 17, 21, 26, 30, 34, 39, 43, 47, 51, 55]
export const ROUND_TIME_MS = [
  10000, 9000, 8000, 7000, 6000, 5500, 5000, 4500, 4000, 3500, 3000, 2500,
]
export const WATER_MAX = 3

export const FOODS_PER_ROUND = [5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 8, 8]
