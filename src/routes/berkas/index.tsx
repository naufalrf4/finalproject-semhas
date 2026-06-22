import { useEffect, useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { getConfig } from "#/lib/config"
import { SubMenu } from "#/components/home/SubMenu"

export const Route = createFileRoute("/berkas/")({ component: BerkasMenu })

function BerkasMenu() {
  const [locked, setLocked] = useState(true)

  useEffect(() => {
    setLocked(!getConfig().laporanUnlocked)
  }, [])

  return (
    <SubMenu
      title="BERKAS PROYEK AKHIR"
      crumb="BERKAS"
      items={[
        {
          num: "01",
          title: "PAPARAN",
          desc: "Slide presentasi seminar hasil.",
          to: "/berkas/paparan",
        },
        {
          num: "02",
          title: "MAKALAH",
          desc: "Baca makalah lengkap di halaman.",
          to: "/berkas/makalah",
        },
        {
          num: "03",
          title: "LAPORAN",
          desc: locked
            ? "Dibuka setelah seminar hasil."
            : "Laporan proyek akhir lengkap.",
          to: "/berkas/laporan",
          locked,
        },
      ]}
    />
  )
}
