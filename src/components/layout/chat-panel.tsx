"use client"

import * as React from "react"
import { Brain, Send, X, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const mockMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content:
      "Welcome to Brain Chat. I can help you analyze peptide data, explore trends, and answer questions about your pipeline.",
    timestamp: new Date(Date.now() - 60000 * 5),
  },
  {
    id: "2",
    role: "user",
    content: "What are the top trending peptide targets this quarter?",
    timestamp: new Date(Date.now() - 60000 * 4),
  },
  {
    id: "3",
    role: "assistant",
    content:
      "Based on recent data, GLP-1 receptor agonists continue to dominate with a 34% increase in research activity. Antimicrobial peptides are also gaining traction, up 22% quarter-over-quarter.",
    timestamp: new Date(Date.now() - 60000 * 3),
  },
]

interface ChatPanelProps {
  open: boolean
  onToggle: () => void
}

export function ChatPanel({ open, onToggle }: ChatPanelProps) {
  const [messages, setMessages] = React.useState<Message[]>(mockMessages)
  const [input, setInput] = React.useState("")
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [
      ...prev,
      userMessage,
      {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "I'm processing your request. This is a mock response for the prototype.",
        timestamp: new Date(),
      },
    ])
    setInput("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Toggle Button (visible when panel is closed) */}
      {!open && (
        <Button
          variant="outline"
          size="icon"
          onClick={onToggle}
          className="fixed right-4 bottom-4 z-30 size-10 rounded-full shadow-lg border-border bg-card"
        >
          <MessageSquare className="size-4" />
          <span className="sr-only">Open Brain Chat</span>
        </Button>
      )}

      {/* Chat Panel */}
      <aside
        className={cn(
          "fixed top-14 right-0 bottom-0 z-20 flex flex-col border-l border-border bg-card transition-all duration-300",
          open ? "w-[360px]" : "w-0 overflow-hidden"
        )}
      >
        {/* Header */}
        <div className="flex h-12 items-center justify-between px-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Brain className="size-4 text-primary" />
            <span className="text-sm font-semibold">Brain Chat</span>
          </div>
          <Button variant="ghost" size="icon-xs" onClick={onToggle}>
            <X className="size-3.5" />
            <span className="sr-only">Close chat</span>
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 px-4">
          <div className="flex flex-col gap-4 py-4" ref={scrollRef}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex flex-col gap-1 max-w-[85%]",
                  message.role === "user" ? "ml-auto items-end" : "items-start"
                )}
              >
                <div
                  className={cn(
                    "rounded-xl px-3 py-2 text-sm leading-relaxed",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  )}
                >
                  {message.content}
                </div>
                <span className="text-[10px] text-muted-foreground px-1">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="border-t border-border p-3">
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Brain anything..."
              rows={1}
              className="flex-1 resize-none rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm placeholder:text-muted-foreground outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!input.trim()}
              className="shrink-0"
            >
              <Send className="size-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground text-center">
            Brain Chat is in beta. Responses may not be fully accurate.
          </p>
        </div>
      </aside>
    </>
  )
}
