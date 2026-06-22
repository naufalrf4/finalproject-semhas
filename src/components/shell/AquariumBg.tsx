type FishConfig = {
  top: string
  width: number
  duration: string
  delay: string
  tint: string
  mirrored: boolean
}

const FISH: FishConfig[] = [
  { top: "18%", width: 46, duration: "26s", delay: "0s", tint: "var(--aqua)", mirrored: false },
  { top: "62%", width: 46, duration: "34s", delay: "-8s", tint: "var(--cyan)", mirrored: true },
  { top: "81%", width: 34, duration: "42s", delay: "-20s", tint: "var(--aqua-deep)", mirrored: false },
]

const BUBBLES = Array.from({ length: 8 }, (_, i) => ({
  left: `${8 + i * 11}%`,
  size: 5 + (i % 3) * 4,
  duration: `${8 + (i % 4) * 2}s`,
  delay: `-${i * 1.6}s`,
}))

function DiscusSprite() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" className="absolute">
      <defs>
        <g id="discus">
          <rect x="0" y="8" width="8" height="8" fill="var(--gold)" />
          <rect x="10" y="0" width="12" height="4" fill="currentColor" />
          <rect x="10" y="20" width="12" height="4" fill="currentColor" />
          <rect x="6" y="4" width="20" height="16" fill="currentColor" />
          <rect x="12" y="4" width="3" height="16" fill="var(--aqua-deep)" />
          <rect x="17" y="4" width="2" height="16" fill="var(--aqua-deep)" />
          <rect x="20" y="8" width="4" height="4" fill="var(--paper)" />
          <rect x="21" y="9" width="2" height="2" fill="var(--ink)" />
          <rect x="26" y="11" width="2" height="3" fill="var(--aqua-deep)" />
        </g>
      </defs>
    </svg>
  )
}

function Fish({ config }: { config: FishConfig }) {
  const height = (config.width / 32) * 24
  return (
    <span
      className="absolute"
      style={{
        top: config.top,
        left: "-60px",
        color: config.tint,
        animation: `aqua-swim ${config.duration} linear ${config.delay} infinite`,
      }}
    >
      <span
        style={{
          display: "inline-block",
          transform: config.mirrored ? "scaleX(-1)" : "none",
          animation: "pixel-bob 3s steps(4,end) infinite",
        }}
      >
        <svg
          width={config.width}
          height={height}
          viewBox="0 0 32 24"
          style={{ imageRendering: "pixelated" }}
        >
          <use href="#discus" />
        </svg>
      </span>
    </span>
  )
}

function Bubble({ left, size, duration, delay }: (typeof BUBBLES)[number]) {
  return (
    <span
      className="absolute bottom-0"
      style={{
        left,
        width: size,
        height: size,
        background: "color-mix(in oklch, var(--cyan) 50%, transparent)",
        border: "1px solid color-mix(in oklch, var(--aqua-deep) 50%, transparent)",
        animation: `aqua-bubble ${duration} linear ${delay} infinite`,
      }}
    />
  )
}

export function AquariumBg() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <DiscusSprite />
      <div
        className="absolute inset-x-0 top-0 h-[6px]"
        style={{
          background:
            "repeating-linear-gradient(90deg, var(--cyan) 0 8px, var(--aqua) 8px 16px)",
          animation: "aqua-water 1.2s steps(2,end) infinite",
        }}
      />
      <div className="absolute inset-0 opacity-50">
        {FISH.map((config, i) => (
          <Fish key={i} config={config} />
        ))}
        {BUBBLES.map((b, i) => (
          <Bubble key={i} {...b} />
        ))}
      </div>
      <style>{`
        @keyframes aqua-swim {
          from { left: -60px; }
          to { left: calc(100vw + 60px); }
        }
        @keyframes aqua-bubble {
          0% { transform: translateY(0); opacity: 0; }
          15% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh); opacity: 0; }
        }
        @keyframes aqua-water {
          to { background-position-x: 16px; }
        }
      `}</style>
    </div>
  )
}
