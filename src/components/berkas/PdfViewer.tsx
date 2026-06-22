import {
  ArrowLeft,
  Download,
  Maximize2,
  Minimize2,
  RotateCw,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import "react-pdf/dist/Page/AnnotationLayer.css"
import "react-pdf/dist/Page/TextLayer.css"
import { Link } from "@tanstack/react-router"
import { useSfx } from "#/lib/sfx"

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString()

type PdfViewerProps = {
  src: string
  title: string
}

const ZOOM_MIN = 0.5
const ZOOM_MAX = 2.5
const ZOOM_STEP = 0.25

export function PdfViewer({ src, title }: PdfViewerProps) {
  const sfx = useSfx()
  const [numPages, setNumPages] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1)
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const [fullscreen, setFullscreen] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  const onLoadSuccess = useCallback(({ numPages: total }: { numPages: number }) => {
    setNumPages(total)
    setLoading(false)
    setFailed(false)
  }, [])

  const onLoadError = useCallback(() => {
    setLoading(false)
    setFailed(true)
  }, [])

  const retry = () => {
    sfx("tick")
    setLoading(true)
    setFailed(false)
    setPageNumber(1)
    setReloadKey((k) => k + 1)
  }

  const goPrev = () => {
    sfx("nav")
    setPageNumber((p) => Math.max(1, p - 1))
  }
  const goNext = () => {
    sfx("nav")
    setPageNumber((p) => Math.min(numPages || 1, p + 1))
  }
  const zoomIn = () => {
    sfx("tick")
    setScale((s) => Math.min(ZOOM_MAX, s + ZOOM_STEP))
  }
  const zoomOut = () => {
    sfx("tick")
    setScale((s) => Math.max(ZOOM_MIN, s - ZOOM_STEP))
  }
  const toggleFullscreen = () => {
    sfx("open")
    setFullscreen((v) => !v)
  }

  useEffect(() => {
    if (!fullscreen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false)
      if (e.key === "ArrowLeft") goPrev()
      if (e.key === "ArrowRight") goNext()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  })

  const skeleton = (
    <div className="grid h-[60vh] w-full place-items-center bg-paper-2 pixel-border">
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-3 w-48 overflow-hidden bg-card pixel-border">
          <div
            className="absolute inset-y-0 w-1/3 bg-aqua"
            style={{ animation: "pixel-shimmer 1.1s steps(8, end) infinite" }}
          />
        </div>
        <span className="text-ink-soft">Memuat dokumen...</span>
      </div>
    </div>
  )

  const errorBox = (
    <div className="grid h-[50vh] w-full place-items-center bg-paper-2 pixel-border">
      <div className="flex flex-col items-center gap-5 p-6 text-center">
        <p className="text-ink">PDF gagal dimuat.</p>
        <p className="text-ink-soft">{title} belum tersedia di {src}.</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={retry}
            className="pixel-card pixel-press inline-flex items-center gap-2 bg-card px-4 py-2 text-ink"
            style={{ fontFamily: "var(--font-pixel)", fontSize: "0.65rem" }}
          >
            <RotateCw className="h-4 w-4" />
            Coba lagi
          </button>
          <a
            href={src}
            download
            onClick={() => sfx("tick")}
            className="pixel-card pixel-press inline-flex items-center gap-2 bg-aqua px-4 py-2 text-primary-foreground"
            style={{ fontFamily: "var(--font-pixel)", fontSize: "0.65rem" }}
          >
            <Download className="h-4 w-4" />
            Unduh
          </a>
        </div>
      </div>
    </div>
  )

  const toolbar = (
    <div className="flex flex-wrap items-center justify-between gap-3 pixel-card bg-card px-4 py-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={goPrev}
          disabled={pageNumber <= 1 || failed}
          aria-label="Halaman sebelumnya"
          className="pixel-card pixel-press grid h-9 w-9 place-items-center bg-paper text-ink disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <span
          className="min-w-[5.5rem] text-center text-ink"
          style={{ fontFamily: "var(--font-pixel)", fontSize: "0.6rem" }}
        >
          {failed ? "0 / 0" : `${pageNumber} / ${numPages || "?"}`}
        </span>
        <button
          type="button"
          onClick={goNext}
          disabled={pageNumber >= numPages || failed}
          aria-label="Halaman berikutnya"
          className="pixel-card pixel-press grid h-9 w-9 place-items-center bg-paper text-ink disabled:opacity-40"
        >
          <ArrowLeft className="h-4 w-4 rotate-180" />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={zoomOut}
          disabled={scale <= ZOOM_MIN || failed}
          aria-label="Perkecil"
          className="pixel-card pixel-press grid h-9 w-9 place-items-center bg-paper text-ink disabled:opacity-40"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <span
          className="min-w-[3.5rem] text-center text-ink-soft"
          style={{ fontFamily: "var(--font-pixel)", fontSize: "0.6rem" }}
        >
          {Math.round(scale * 100)}%
        </span>
        <button
          type="button"
          onClick={zoomIn}
          disabled={scale >= ZOOM_MAX || failed}
          aria-label="Perbesar"
          className="pixel-card pixel-press grid h-9 w-9 place-items-center bg-paper text-ink disabled:opacity-40"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <a
          href={src}
          download
          onClick={() => sfx("tick")}
          aria-label="Unduh PDF"
          className="pixel-card pixel-press grid h-9 w-9 place-items-center bg-paper text-ink"
        >
          <Download className="h-4 w-4" />
        </a>
        <button
          type="button"
          onClick={toggleFullscreen}
          aria-label={fullscreen ? "Keluar layar penuh" : "Layar penuh"}
          className="pixel-card pixel-press grid h-9 w-9 place-items-center bg-paper text-ink"
        >
          {fullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  )

  const docArea = (
    <div className="flex justify-center overflow-auto bg-paper-2 p-4 pixel-border">
      <Document
        key={reloadKey}
        file={src}
        onLoadSuccess={onLoadSuccess}
        onLoadError={onLoadError}
        loading={skeleton}
        error={errorBox}
        className="flex justify-center"
      >
        {!failed && !loading ? (
          <div className="pixel-shadow">
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderAnnotationLayer
              renderTextLayer
            />
          </div>
        ) : null}
      </Document>
    </div>
  )

  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-[120] flex flex-col gap-3 bg-paper p-4">
        <div className="flex items-center justify-between gap-3">
          <span
            className="text-aqua-deep"
            style={{ fontFamily: "var(--font-pixel)", fontSize: "0.7rem" }}
          >
            {title}
          </span>
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label="Tutup layar penuh"
            className="pixel-card pixel-press grid h-10 w-10 place-items-center bg-card text-ink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {toolbar}
        <div className="flex flex-1 justify-center overflow-auto bg-paper-2 p-4 pixel-border">
          <Document
            key={reloadKey}
            file={src}
            onLoadSuccess={onLoadSuccess}
            onLoadError={onLoadError}
            loading={skeleton}
            error={errorBox}
            className="flex justify-center"
          >
            {!failed && !loading ? (
              <div className="pixel-shadow">
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  renderAnnotationLayer
                  renderTextLayer
                />
              </div>
            ) : null}
          </Document>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <Link
          to="/berkas"
          onClick={() => sfx("nav")}
          className="pixel-card pixel-press inline-flex items-center gap-2 bg-card px-4 py-2 text-ink"
          style={{ fontFamily: "var(--font-pixel)", fontSize: "0.65rem" }}
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Link>
        <h1
          className="text-aqua-deep"
          style={{ fontFamily: "var(--font-pixel)", fontSize: "0.8rem" }}
        >
          {title}
        </h1>
      </div>
      {toolbar}
      {docArea}
    </div>
  )
}
