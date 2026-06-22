import { createFileRoute } from "@tanstack/react-router"
import { GamePageBody } from "#/components/game/GamePageBody"

export const Route = createFileRoute("/interaktif/game")({ component: GamePageBody })
