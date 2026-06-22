import { Link } from "@tanstack/react-router"
import { AlertTriangle, Home, RotateCcw } from "lucide-react"

type ErrorStateProps = {
  title?: string
  message?: string
  onRetry?: () => void
}

export function ErrorState({ title, message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <AlertTriangle className="size-16 text-danger" strokeWidth={1.5} />
      <div className="font-pixel text-2xl text-danger">
        {title ?? "Terjadi Kesalahan"}
      </div>
      <p className="max-w-sm text-ink-soft">
        {message ?? "Ada yang tidak beres. Coba muat ulang halaman ini."}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="pixel-card pixel-press inline-flex items-center gap-2 px-5 py-3 font-pixel text-[10px] text-ink"
          >
            <RotateCcw className="size-4" />
            Coba lagi
          </button>
        ) : null}
        <Link
          to="/"
          className="pixel-card pixel-press inline-flex items-center gap-2 px-5 py-3 font-pixel text-[10px] text-ink"
        >
          <Home className="size-4" />
          Beranda
        </Link>
      </div>
    </div>
  )
}
