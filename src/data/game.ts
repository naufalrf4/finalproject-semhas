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
]

export const SKIM = { id: "skim", label: "Buang Sisa", points: -2, icon: "x" }

export const ROUND_TARGETS = [7, 11, 14, 18, 22, 26, 30, 33, 37, 40, 43, 45]
export const ROUND_TIME_MS = [
  12000, 10000, 9000, 8000, 7000, 6500, 6000, 5500, 5000, 4500, 4000, 3500,
]
export const WATER_MAX = 3
