import { useCallback, useRef } from "react"
import type { SfxName } from "#/lib/types"
import { useAppStore } from "#/lib/store"

type Tone = { freq: number; dur: number; type?: OscillatorType; delay?: number }

const PATTERNS: Record<SfxName, Tone[]> = {
  nav: [
    { freq: 660, dur: 0.08 },
    { freq: 880, dur: 0.1, delay: 60 },
  ],
  open: [{ freq: 520, dur: 0.07 }],
  tick: [{ freq: 740, dur: 0.06, type: "triangle" }],
  lock: [
    { freq: 180, dur: 0.12, type: "sawtooth" },
    { freq: 120, dur: 0.14, type: "sawtooth", delay: 90 },
  ],
  start: [
    { freq: 523, dur: 0.1 },
    { freq: 659, dur: 0.1, delay: 110 },
    { freq: 784, dur: 0.16, delay: 220 },
  ],
  send: [
    { freq: 880, dur: 0.07 },
    { freq: 1175, dur: 0.12, delay: 70 },
  ],
}

export function useSfx() {
  const ctxRef = useRef<AudioContext | null>(null)
  const muted = useAppStore((s) => s.muted)

  const play = useCallback(
    (name: SfxName) => {
      if (muted) return
      try {
        const Ctor =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext })
            .webkitAudioContext
        const ctx = ctxRef.current ?? new Ctor()
        ctxRef.current = ctx
        if (ctx.state === "suspended") void ctx.resume()
        for (const tone of PATTERNS[name]) {
          const start = ctx.currentTime + (tone.delay ?? 0) / 1000
          const osc = ctx.createOscillator()
          const gain = ctx.createGain()
          osc.type = tone.type ?? "square"
          osc.frequency.value = tone.freq
          osc.connect(gain)
          gain.connect(ctx.destination)
          gain.gain.setValueAtTime(0.06, start)
          gain.gain.exponentialRampToValueAtTime(0.0001, start + tone.dur)
          osc.start(start)
          osc.stop(start + tone.dur)
        }
      } catch {
        void 0
      }
    },
    [muted],
  )

  return play
}
