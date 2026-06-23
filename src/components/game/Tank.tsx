type TankProps = {
  water: number
  waterMax: number
  happy: boolean
}

function waterColor(ratio: number): string {
  if (ratio > 0.66) return "var(--cyan)"
  if (ratio > 0.33) return "color-mix(in oklch, var(--cyan) 60%, var(--gold) 40%)"
  return "color-mix(in oklch, var(--gold) 45%, var(--ink-soft) 55%)"
}

function waterLabel(ratio: number): string {
  if (ratio > 0.66) return "JERNIH"
  if (ratio > 0.33) return "KERUH"
  return "BURUK"
}

const FISH = [
  { top: "30%", dur: "5s", delay: "0s", w: 52, mirror: false },
  { top: "55%", dur: "7s", delay: "-2s", w: 40, mirror: true },
  { top: "70%", dur: "6s", delay: "-4s", w: 34, mirror: false },
]

export function Tank({ water, waterMax, happy }: TankProps) {
  const ratio = Math.max(0, Math.min(1, water / waterMax))
  const fill = waterColor(ratio)
  return (
    <div className="pixel-border relative h-56 w-full overflow-hidden bg-paper-2">
      <div
        className="absolute inset-x-0 bottom-0 transition-[height,background] duration-500"
        style={{ height: `${ratio * 100}%`, background: fill }}
        aria-hidden="true"
      >
        <div
          className="absolute inset-x-0 top-0 h-[4px]"
          style={{
            background:
              "repeating-linear-gradient(90deg, var(--paper) 0 6px, transparent 6px 12px)",
            animation: "tank-wave 1.4s steps(2,end) infinite",
          }}
        />
        {[12, 32, 54, 73, 88].map((left, i) => (
          <span
            key={i}
            className="absolute bottom-0 bg-paper/70"
            style={{
              left: `${left}%`,
              width: 5 + (i % 2) * 3,
              height: 5 + (i % 2) * 3,
              animation: `tank-bubble ${3 + (i % 3)}s linear ${-i * 0.7}s infinite`,
            }}
          />
        ))}
      </div>

      {happy ? (
        FISH.map((f, i) => (
          <span
            key={i}
            className="absolute"
            style={{
              top: f.top,
              left: "-60px",
              color: ratio > 0.5 ? "var(--aqua-deep)" : "var(--ink-soft)",
              animation: `tank-swim ${f.dur} linear ${f.delay} infinite`,
              zIndex: 2,
            }}
          >
            <span
              style={{
                display: "inline-block",
                transform: f.mirror ? "scaleX(-1)" : "none",
                animation: "tank-bob 0.8s steps(4,end) infinite",
              }}
            >
              <svg
                width={f.w}
                height={(f.w / 32) * 24}
                viewBox="0 0 32 24"
                style={{ imageRendering: "pixelated" }}
              >
                <use href="#discus" />
              </svg>
            </span>
          </span>
        ))
      ) : (
        <span
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ color: "var(--danger)", animation: "tank-float 2s steps(4,end) infinite", zIndex: 2 }}
        >
          <svg
            width={56}
            height={42}
            viewBox="0 0 32 24"
            style={{ imageRendering: "pixelated", transform: "rotate(180deg)" }}
          >
            <use href="#discus" />
          </svg>
        </span>
      )}

      <span
        className="absolute left-1 top-1 z-10 bg-ink px-2 py-0.5 text-xs text-paper"
        style={{ fontFamily: "var(--font-pixel)" }}
      >
        AIR {water}/{waterMax}
      </span>
      <span
        className="absolute right-1 top-1 z-10 px-2 py-0.5 text-xs"
        style={{
          fontFamily: "var(--font-pixel)",
          background: "var(--ink)",
          color: ratio > 0.66 ? "var(--cyan)" : ratio > 0.33 ? "var(--gold)" : "var(--danger)",
        }}
      >
        {waterLabel(ratio)}
      </span>

      <style>{`
        @keyframes tank-swim {
          from { left: -60px; }
          to { left: calc(100% + 60px); }
        }
        @keyframes tank-bob {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes tank-float {
          0%,100% { transform: translate(-50%,-50%) translateY(0); }
          50% { transform: translate(-50%,-50%) translateY(-5px); }
        }
        @keyframes tank-bubble {
          0% { bottom: 0; opacity: 0; }
          20% { opacity: 1; }
          100% { bottom: 100%; opacity: 0; }
        }
        @keyframes tank-wave {
          to { background-position-x: 12px; }
        }
      `}</style>
    </div>
  )
}
