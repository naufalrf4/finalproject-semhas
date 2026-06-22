import type { ReactNode } from "react"

type HubGridProps = {
  children: ReactNode
}

export function HubGrid({ children }: HubGridProps) {
  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
  )
}
