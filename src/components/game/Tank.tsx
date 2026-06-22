import { Fish } from "lucide-react"

type TankProps = {
  water: number
  waterMax: number
  happy: boolean
}

export function Tank({ water, waterMax, happy }: TankProps) {
  const ratio = Math.max(0, Math.min(1, water / waterMax))
  return (
    <div className="pixel-border relative h-40 w-full overflow-hidden bg-paper-2">
      <div
        className="absolute inset-x-0 bottom-0 bg-cyan transition-[height] duration-300"
        style={{ height: `${ratio * 100}%` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <Fish
          className={happy ? "size-16 text-aqua-deep" : "size-16 text-danger"}
          strokeWidth={1.5}
        />
      </div>
      <span
        className="absolute left-1 top-1 bg-ink px-2 py-0.5 text-xs text-paper"
        style={{ fontFamily: "var(--font-pixel)" }}
      >
        AIR {water}/{waterMax}
      </span>
    </div>
  )
}
