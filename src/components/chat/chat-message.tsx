"use client"

import { cn } from "@/lib/utils"
import { Brain, User } from "lucide-react"

export interface ChatMessageData {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

interface ChatMessageProps {
  message: ChatMessageData
  className?: string
}

export function ChatMessage({ message, className }: ChatMessageProps) {
  const isAssistant = message.role === "assistant"

  return (
    <div
      className={cn(
        "flex gap-3",
        isAssistant ? "items-start" : "items-start flex-row-reverse",
        className
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-lg",
          isAssistant
            ? "bg-violet-500/15 text-violet-400"
            : "bg-emerald-500/15 text-emerald-400"
        )}
      >
        {isAssistant ? (
          <Brain className="size-4" />
        ) : (
          <User className="size-4" />
        )}
      </div>

      {/* Message Bubble */}
      <div
        className={cn(
          "flex max-w-[80%] flex-col gap-1",
          isAssistant ? "items-start" : "items-end"
        )}
      >
        <div
          className={cn(
            "rounded-xl px-4 py-2.5 text-sm leading-relaxed",
            isAssistant
              ? "bg-card ring-1 ring-border text-card-foreground"
              : "bg-primary/10 text-foreground ring-1 ring-primary/20"
          )}
        >
          <MessageContent content={message.content} />
        </div>
        <span className="px-1 text-[10px] text-muted-foreground">
          {formatTimestamp(message.timestamp)}
        </span>
      </div>
    </div>
  )
}

function MessageContent({ content }: { content: string }) {
  const lines = content.split("\n")

  return (
    <div className="space-y-2">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1" />

        // Bold text: **text**
        const parts = line.split(/(\*\*[^*]+\*\*)/g)
        const rendered = parts.map((part, j) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <span key={j} className="font-semibold text-foreground">
                {part.slice(2, -2)}
              </span>
            )
          }
          // Inline code: `text`
          const codeParts = part.split(/(`[^`]+`)/g)
          return codeParts.map((cp, k) => {
            if (cp.startsWith("`") && cp.endsWith("`")) {
              return (
                <code
                  key={`${j}-${k}`}
                  className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-emerald-400"
                >
                  {cp.slice(1, -1)}
                </code>
              )
            }
            return <span key={`${j}-${k}`}>{cp}</span>
          })
        })

        // Bullet points
        if (line.trim().startsWith("- ") || line.trim().startsWith("* ")) {
          return (
            <div key={i} className="flex gap-2 pl-1">
              <span className="text-muted-foreground shrink-0">-</span>
              <span>{rendered}</span>
            </div>
          )
        }

        // Numbered items
        const numberedMatch = line.trim().match(/^(\d+)\.\s/)
        if (numberedMatch) {
          return (
            <div key={i} className="flex gap-2 pl-1">
              <span className="text-muted-foreground shrink-0 tabular-nums">
                {numberedMatch[1]}.
              </span>
              <span>{rendered}</span>
            </div>
          )
        }

        return <p key={i}>{rendered}</p>
      })}
    </div>
  )
}

function formatTimestamp(ts: string): string {
  const date = new Date(ts)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60_000)

  if (diffMins < 1) return "just now"
  if (diffMins < 60) return `${diffMins}m ago`

  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  })
}
