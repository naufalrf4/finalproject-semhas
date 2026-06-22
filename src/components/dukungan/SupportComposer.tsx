import { useState } from "react"
import { useAppStore } from "#/lib/store"
import { useSfx } from "#/lib/sfx"
import { api } from "#/lib/api"
import { useMediaQuery } from "#/components/dukungan/useMediaQuery"
import { Button } from "#/components/ui/button.tsx"
import { Textarea } from "#/components/ui/textarea.tsx"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "#/components/ui/dialog.tsx"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "#/components/ui/drawer.tsx"

type SupportComposerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const MAX = 160

function ComposerForm({ onClose }: { onClose: () => void }) {
  const sfx = useSfx()
  const session = useAppStore((s) => s.session)
  const [message, setMessage] = useState("")
  const [anonymous, setAnonymous] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)

  const author = anonymous ? "Anonim" : (session?.name ?? "Anonim")

  const submit = async () => {
    const trimmed = message.trim()
    if (trimmed.length === 0 || sending) return
    setSending(true)
    setError(null)
    const res = await api.sendSupport(trimmed, session?.name ?? "Anonim", anonymous)
    setSending(false)
    if (!res.ok) {
      setError(res.error)
      return
    }
    sfx("send")
    setMessage("")
    setAnonymous(false)
    onClose()
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <Textarea
        value={message}
        onChange={(event) => setMessage(event.target.value.slice(0, MAX))}
        placeholder="Tulis dukungan untuk saya..."
        rows={4}
        className="pixel-border bg-paper-2 text-ink"
        style={{ fontFamily: "var(--font-body)" }}
      />
      <div className="flex items-center justify-between text-xs text-ink-soft">
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={anonymous}
            onChange={(event) => setAnonymous(event.target.checked)}
            className="pixel-border size-4 accent-aqua"
          />
          <span style={{ fontFamily: "var(--font-pixel)" }}>kirim anonim</span>
        </label>
        <span>
          {message.length}/{MAX}
        </span>
      </div>
      <p className="text-xs text-ink-soft" style={{ fontFamily: "var(--font-pixel)" }}>
        SEBAGAI: <span className="text-aqua">{author}</span>
      </p>
      {error ? (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
      <Button
        type="button"
        onClick={submit}
        disabled={message.trim().length === 0 || sending}
        className="pixel-border pixel-press bg-aqua text-primary-foreground"
        style={{ fontFamily: "var(--font-pixel)" }}
      >
        {sending ? "MENGIRIM..." : "KIRIM"}
      </Button>
    </div>
  )
}

export function SupportComposer({ open, onOpenChange }: SupportComposerProps) {
  const isDesktop = useMediaQuery("(min-width: 640px)")
  const close = () => onOpenChange(false)

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="pixel-card z-[200] w-[min(92vw,560px)] sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle style={{ fontFamily: "var(--font-pixel)" }}>
              TULIS DUKUNGAN
            </DialogTitle>
          </DialogHeader>
          <ComposerForm onClose={close} />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="pixel-card z-[200]">
        <DrawerHeader>
          <DrawerTitle style={{ fontFamily: "var(--font-pixel)" }}>
            TULIS DUKUNGAN
          </DrawerTitle>
        </DrawerHeader>
        <ComposerForm onClose={close} />
      </DrawerContent>
    </Drawer>
  )
}
