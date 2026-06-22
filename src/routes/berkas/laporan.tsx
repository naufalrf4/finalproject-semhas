import { createFileRoute } from "@tanstack/react-router"
import { getConfig } from "#/lib/config"
import { LockScreen } from "#/components/berkas/LockScreen"
import { PdfViewer } from "#/components/berkas/PdfViewer"

export const Route = createFileRoute("/berkas/laporan")({ component: Laporan })

function Laporan() {
  const unlocked = getConfig().laporanUnlocked
  if (!unlocked) {
    return (
      <LockScreen
        title="Laporan Terkunci"
        message="Laporan dibuka setelah seminar hasil."
      />
    )
  }
  return <PdfViewer src="/pdf/laporan.pdf" title="Laporan" />
}
