import { useMemo } from "react"
import type { QaCategory, QaItem } from "#/lib/types"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "#/components/ui/accordion.tsx"
import { Badge } from "#/components/ui/badge.tsx"
import { cn } from "#/lib/utils.ts"

type QaAccordionProps = {
  items: QaItem[]
  ready: Record<string, boolean>
  onToggleReady: (id: string) => void
  query: string
  category: QaCategory | "all"
}

const CATEGORY_LABELS: Record<QaCategory, string> = {
  metodologi: "Metodologi",
  validitas: "Validitas",
  sensor: "Sensor",
  keterbatasan: "Keterbatasan",
  kebaruan: "Kebaruan",
}

function matchesQuery(item: QaItem, query: string): boolean {
  const term = query.trim().toLowerCase()
  if (term === "") return true
  if (item.question.toLowerCase().includes(term)) return true
  return item.answer.some((line) => line.toLowerCase().includes(term))
}

export function QaAccordion({
  items,
  ready,
  onToggleReady,
  query,
  category,
}: QaAccordionProps) {
  const filtered = useMemo(
    () =>
      items.filter(
        (item) =>
          (category === "all" || item.category === category) &&
          matchesQuery(item, query),
      ),
    [items, query, category],
  )

  if (filtered.length === 0) {
    return (
      <div
        className="pixel-border bg-card px-4 py-6 text-center text-ink-soft"
        style={{ fontFamily: "var(--font-body)" }}
      >
        Tidak ada pertanyaan yang cocok.
      </div>
    )
  }

  return (
    <Accordion type="multiple" className="gap-3">
      {filtered.map((item) => {
        const isReady = ready[item.id] === true
        return (
          <AccordionItem
            key={item.id}
            value={item.id}
            className={cn(
              "pixel-card mb-3 border-b-0 px-3",
              isReady && "bg-paper-2",
            )}
          >
            <div className="flex items-start gap-2 pt-2">
              <Badge
                variant="outline"
                className="pixel-border shrink-0 bg-cyan text-ink"
                style={{ fontFamily: "var(--font-pixel)" }}
              >
                {CATEGORY_LABELS[item.category]}
              </Badge>
              <label className="ml-auto flex cursor-pointer items-center gap-1 text-xs text-ink-soft">
                <input
                  type="checkbox"
                  checked={isReady}
                  onChange={() => onToggleReady(item.id)}
                  className="pixel-border size-4 accent-aqua"
                />
                <span style={{ fontFamily: "var(--font-pixel)" }}>
                  siap
                </span>
              </label>
            </div>
            <AccordionTrigger
              className="text-base text-ink"
              style={{ fontFamily: "var(--font-body)" }}
            >
              {item.question}
            </AccordionTrigger>
            <AccordionContent>
              <ul className="ml-4 list-disc space-y-1.5 text-ink-soft">
                {item.answer.map((line, index) => (
                  <li key={index}>{line}</li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}
