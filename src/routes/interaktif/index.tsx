import { createFileRoute } from "@tanstack/react-router"
import { SubMenu } from "#/components/home/SubMenu"

export const Route = createFileRoute("/interaktif/")({ component: InteraktifMenu })

function InteraktifMenu() {
  return (
    <SubMenu
      title="INTERAKTIF"
      crumb="INTERAKTIF"
      items={[
        {
          num: "01",
          title: "GAME",
          desc: "Beri makan diskus, jaga kualitas air.",
          to: "/interaktif/game",
        },
        {
          num: "02",
          title: "DUKUNGAN",
          desc: "Tinggalkan pesan dukungan, tampil langsung.",
          to: "/interaktif/dukungan",
        },
      ]}
    />
  )
}
