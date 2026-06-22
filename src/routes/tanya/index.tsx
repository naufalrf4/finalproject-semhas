import { createFileRoute } from "@tanstack/react-router"
import { SubMenu } from "#/components/home/SubMenu"

export const Route = createFileRoute("/tanya/")({ component: TanyaMenu })

function TanyaMenu() {
  return (
    <SubMenu
      title="TANYA-JAWAB"
      crumb="TANYA-JAWAB"
      items={[
        {
          num: "01",
          title: "ANTISIPASI FORUM",
          desc: "Daftar pertanyaan forum dan poin jawaban.",
          to: "/tanya/forum",
        },
        {
          num: "02",
          title: "TANYA CHATBOT",
          desc: "Pilih pertanyaan, jawaban muncul otomatis.",
          to: "/tanya/chatbot",
        },
      ]}
    />
  )
}
