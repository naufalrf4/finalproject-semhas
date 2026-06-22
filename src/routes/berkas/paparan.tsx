import { createFileRoute } from "@tanstack/react-router"
import { DeckEmbed } from "#/components/berkas/DeckEmbed"

export const Route = createFileRoute("/berkas/paparan")({ component: Paparan })

function Paparan() {
  return <DeckEmbed src="/ppt/index.html" />
}
