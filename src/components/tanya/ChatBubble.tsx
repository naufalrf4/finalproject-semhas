import type { ReactNode } from "react"
import { Fish, User } from "lucide-react"
import { cn } from "#/lib/utils.ts"

type ChatRole = "bot" | "user" | "system"

type ChatBubbleProps = {
  role: ChatRole
  children: ReactNode
}

function BotAvatar() {
  return (
    <span
      aria-hidden
      className="pixel-border flex size-9 shrink-0 select-none items-center justify-center bg-cyan text-ink"
    >
      <Fish className="size-5" />
    </span>
  )
}

export function ChatBubble({ role, children }: ChatBubbleProps) {
  if (role === "system") {
    return (
      <div className="my-2 flex justify-center">
        <span
          className="pixel-border bg-paper-2 px-3 py-1 text-center text-xs text-ink-soft"
          style={{ fontFamily: "var(--font-pixel)" }}
        >
          {children}
        </span>
      </div>
    )
  }

  const isBot = role === "bot"

  return (
    <div
      className={cn(
        "flex items-end gap-2",
        isBot ? "justify-start" : "justify-end",
      )}
    >
      {isBot ? <BotAvatar /> : null}
      <div
        className={cn(
          "pixel-card max-w-[78%] px-3 py-2 leading-snug",
          isBot ? "bg-card text-ink" : "bg-aqua text-primary-foreground",
        )}
      >
        {children}
      </div>
      {isBot ? null : (
        <span
          aria-hidden
          className="pixel-border flex size-9 shrink-0 select-none items-center justify-center bg-gold text-ink"
        >
          <User className="size-5" />
        </span>
      )}
    </div>
  )
}
