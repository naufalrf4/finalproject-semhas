import { Link } from "@tanstack/react-router"
import { Fish, Home } from "lucide-react"

export function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <Fish className="size-16 text-aqua" strokeWidth={1.5} />
      <div className="font-pixel text-4xl text-aqua-deep">404</div>
      <p className="font-pixel text-xs leading-relaxed text-ink">
        Halaman tidak ditemukan
      </p>
      <p className="max-w-sm text-ink-soft">
        Sepertinya ikan ini berenang ke kolam yang salah.
      </p>
      <Link
        to="/"
        className="pixel-card pixel-press inline-flex items-center gap-2 px-5 py-3 font-pixel text-[10px] text-ink"
      >
        <Home className="size-4" />
        Kembali ke beranda
      </Link>
    </div>
  )
}
