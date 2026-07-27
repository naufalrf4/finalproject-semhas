import { useEffect, useState } from "react"
import { CalendarPlus, ExternalLink, Video, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "#/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "#/components/ui/drawer"
import { useMediaQuery } from "#/components/dukungan/useMediaQuery"
import { useSfx } from "#/lib/sfx"
import {
  SEMHAS_REGISTER_URL,
  SEMHAS_SITE_URL,
  SEMHAS_WHEN_LABEL,
  buildGoogleCalendarUrl,
  getCountdown,
  type CountdownParts,
} from "#/lib/semhas"

const STEPS = [
  "Daftar dulu lewat FRIDA SV IPB supaya kehadiran tercatat.",
  "Simpan jadwalnya di Google Calendar biar tidak terlewat.",
  "Tombol Zoom terbuka satu jam sebelum seminar dimulai.",
]

type SemhasModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  zoomReady: boolean
  zoomLink: string
}

export function SemhasModal({
  open,
  onOpenChange,
  zoomReady,
  zoomLink,
}: SemhasModalProps) {
  const isDesktop = useMediaQuery("(min-width: 640px)")

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="pixel-card z-[200] w-[min(94vw,28rem)] max-w-md gap-0 overflow-hidden p-0 duration-250 ease-out data-open:animate-in data-open:fade-in-0 data-open:zoom-in-90 data-open:slide-in-from-bottom-4 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95"
          showCloseButton={false}
        >
          <Body zoomReady={zoomReady} zoomLink={zoomLink} onClose={() => onOpenChange(false)} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="pixel-card z-[200] max-h-[88vh]">
        <Body zoomReady={zoomReady} zoomLink={zoomLink} onClose={() => onOpenChange(false)} mobile />
      </DrawerContent>
    </Drawer>
  )
}

function Body({
  zoomReady,
  zoomLink,
  onClose,
  mobile = false,
}: {
  zoomReady: boolean
  zoomLink: string
  onClose: () => void
  mobile?: boolean
}) {
  const sfx = useSfx()
  const [countdown, setCountdown] = useState<CountdownParts>(() => getCountdown())

  useEffect(() => {
    const id = window.setInterval(() => setCountdown(getCountdown()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const gcalUrl = buildGoogleCalendarUrl(zoomLink)
  const zoomOpen = zoomReady && countdown.zoomOpen

  const openZoom = () => {
    if (!zoomOpen || !zoomLink) return
    sfx("open")
    window.open(zoomLink, "_blank", "noopener,noreferrer")
    onClose()
  }

  const openRegister = () => {
    sfx("open")
    window.open(SEMHAS_REGISTER_URL, "_blank", "noopener,noreferrer")
  }

  const openGcal = () => {
    sfx("tick")
    window.open(gcalUrl, "_blank", "noopener,noreferrer")
  }

  const title = (
    <div className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-2">
        <svg
          width={28}
          height={21}
          viewBox="0 0 32 24"
          aria-hidden="true"
          className="text-cyan"
          style={{ imageRendering: "pixelated" }}
        >
          <use href="#discus" />
        </svg>
        <span className="text-aqua" style={{ fontFamily: "var(--font-pixel)" }}>
          SEMINAR HASIL
        </span>
      </span>
      <button
        type="button"
        onClick={onClose}
        aria-label="Tutup"
        className="pixel-card pixel-press grid h-8 w-8 shrink-0 place-items-center bg-paper text-ink"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )

  const header = mobile ? (
    <DrawerHeader className="gap-1 border-b bg-paper-2 p-4 text-left">
      <DrawerTitle asChild>{title}</DrawerTitle>
      <DrawerDescription className="text-ink-soft">
        {SEMHAS_WHEN_LABEL}
      </DrawerDescription>
    </DrawerHeader>
  ) : (
    <DialogHeader className="gap-1 border-b bg-paper-2 p-4">
      <DialogTitle asChild>{title}</DialogTitle>
      <DialogDescription className="text-ink-soft">
        {SEMHAS_WHEN_LABEL}
      </DialogDescription>
    </DialogHeader>
  )

  return (
    <div className={mobile ? "overflow-y-auto" : ""}>
      {header}

      <CountdownBlock countdown={countdown} zoomReady={zoomReady} />

      <ol className="flex flex-col gap-2 border-b px-4 py-4">
        {STEPS.map((step, index) => (
          <li key={step} className="flex items-start gap-3">
            <span
              className="grid h-5 w-5 shrink-0 place-items-center bg-ink text-paper"
              style={{ fontFamily: "var(--font-pixel)", fontSize: "0.5rem" }}
            >
              {index + 1}
            </span>
            <span className="text-sm leading-snug text-ink-soft">{step}</span>
          </li>
        ))}
      </ol>

      <div className="flex flex-col gap-2 p-4">
        <button
          type="button"
          onClick={openRegister}
          className="pixel-card pixel-press flex items-center justify-center gap-2 bg-cyan px-4 py-3 text-primary-foreground"
          style={{ fontFamily: "var(--font-pixel)", fontSize: "0.65rem" }}
        >
          <ExternalLink className="h-4 w-4" />
          DAFTAR DI FRIDASVIPB
        </button>
        <button
          type="button"
          onClick={openGcal}
          className="pixel-card pixel-press flex items-center justify-center gap-2 bg-gold px-4 py-3 text-primary-foreground"
          style={{ fontFamily: "var(--font-pixel)", fontSize: "0.65rem" }}
        >
          <CalendarPlus className="h-4 w-4" />
          TAMBAH KE GOOGLE CALENDAR
        </button>
        <button
          type="button"
          onClick={openZoom}
          disabled={!zoomOpen}
          className="pixel-card pixel-press flex items-center justify-center gap-2 bg-aqua px-4 py-3 text-primary-foreground disabled:opacity-40"
          style={{ fontFamily: "var(--font-pixel)", fontSize: "0.65rem" }}
        >
          <Video className="h-4 w-4" />
          {zoomOpen ? "GABUNG ZOOM" : "ZOOM BELUM DIBUKA"}
        </button>
        {!zoomOpen ? (
          <p className="text-center text-ink-soft text-xs">
            {zoomReady
              ? "Tombol Zoom terbuka satu jam sebelum seminar dimulai."
              : "Link Zoom belum aktif."}
          </p>
        ) : null}
      </div>

      <a
        href={SEMHAS_SITE_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => sfx("tick")}
        className="block border-t bg-paper-2 px-4 py-3 text-center text-ink-soft underline-offset-2 hover:underline"
      >
        {SEMHAS_SITE_URL}
      </a>
    </div>
  )
}

function CountdownBlock({
  countdown,
  zoomReady,
}: {
  countdown: CountdownParts
  zoomReady: boolean
}) {
  if (countdown.past) {
    return (
      <div
        className="p-4 text-center text-ink-soft"
        style={{ fontFamily: "var(--font-pixel)", fontSize: "0.7rem" }}
      >
        SEMINAR TELAH SELESAI
      </div>
    )
  }
  if (countdown.live) {
    return (
      <div
        className="p-4 text-center text-aqua"
        style={{ fontFamily: "var(--font-pixel)", fontSize: "0.7rem" }}
      >
        SEMINAR BERLANGSUNG{zoomReady ? " - GABUNG SEKARANG" : ""}
      </div>
    )
  }
  const items: Array<{ value: number; label: string }> = [
    { value: countdown.days, label: "HARI" },
    { value: countdown.hours, label: "JAM" },
    { value: countdown.minutes, label: "MNT" },
    { value: countdown.seconds, label: "DTK" },
  ]
  return (
    <div className="flex justify-center gap-2 p-4">
      {items.map((it) => (
        <div
          key={it.label}
          className="pixel-card flex w-16 flex-col items-center gap-1 bg-paper-2 py-2"
        >
          <span
            className="text-aqua text-xl tabular-nums"
            style={{ fontFamily: "var(--font-pixel)" }}
          >
            {String(it.value).padStart(2, "0")}
          </span>
          <span
            className="text-ink-soft"
            style={{ fontFamily: "var(--font-pixel)", fontSize: "0.5rem" }}
          >
            {it.label}
          </span>
        </div>
      ))}
    </div>
  )
}
