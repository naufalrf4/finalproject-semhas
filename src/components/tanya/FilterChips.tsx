import type { QaCategory } from "#/lib/types"
import { cn } from "#/lib/utils.ts"

export type FilterValue = QaCategory | "all"

type FilterChipsProps = {
  categories: FilterValue[]
  active: FilterValue
  onChange: (value: FilterValue) => void
  counts?: Partial<Record<FilterValue, number>>
}

const LABELS: Record<FilterValue, string> = {
  all: "Semua",
  metodologi: "Metodologi",
  validitas: "Validitas",
  sensor: "Sensor",
  keterbatasan: "Keterbatasan",
  kebaruan: "Kebaruan",
}

export function FilterChips({
  categories,
  active,
  onChange,
  counts,
}: FilterChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => {
        const isActive = cat === active
        const count = counts?.[cat]
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onChange(cat)}
            aria-pressed={isActive}
            className={cn(
              "pixel-border pixel-press px-2.5 py-1 text-xs uppercase tracking-wide",
              isActive
                ? "bg-aqua text-primary-foreground"
                : "bg-card text-ink hover:bg-paper-2",
            )}
            style={{ fontFamily: "var(--font-pixel)" }}
          >
            {LABELS[cat]}
            {typeof count === "number" ? (
              <span className="ml-1 opacity-80">{count}</span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
