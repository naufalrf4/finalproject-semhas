import { createFileRoute } from "@tanstack/react-router"
import { PdfViewer } from "#/components/berkas/PdfViewer"

export const Route = createFileRoute("/berkas/makalah")({ component: Makalah })

function Makalah() {
  return <PdfViewer src="/pdf/makalah.pdf" title="Makalah" />
}
