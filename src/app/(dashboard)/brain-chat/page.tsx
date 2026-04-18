"use client"

import * as React from "react"
import {
  Brain,
  Send,
  Plus,
  Clock,
  Sparkles,
  Slash,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { ChatMessage, type ChatMessageData } from "@/components/chat/chat-message"

// --- Mock Conversations ---

interface ConversationThread {
  id: string
  title: string
  preview: string
  timestamp: string
  messageCount: number
  isActive?: boolean
}

const mockThreads: ConversationThread[] = [
  {
    id: "t1",
    title: "Retatrutide Opportunity Analysis",
    preview: "890% trend spike -- zero competitors. This is a first-mover play...",
    timestamp: "2026-04-14T12:00:00Z",
    messageCount: 14,
    isActive: true,
  },
  {
    id: "t2",
    title: "Semaglutide Guide Strategy",
    preview: "Visual dosing guide vs. traditional PDF. Let me break down the numbers...",
    timestamp: "2026-04-14T08:00:00Z",
    messageCount: 8,
  },
  {
    id: "t3",
    title: "Weekly Pipeline Review",
    preview: "9 new ideas this week. 3 scored above 80. Here is the breakdown...",
    timestamp: "2026-04-13T16:00:00Z",
    messageCount: 22,
  },
  {
    id: "t4",
    title: "Competitor Alert: BiohackPro",
    preview: "BiohackPro just launched a new course at $49.99. Impacts our tirzepatide idea...",
    timestamp: "2026-04-13T10:00:00Z",
    messageCount: 6,
  },
  {
    id: "t5",
    title: "Golden Rules Refinement",
    preview: "Based on your last 12 decisions, I have identified a new pattern...",
    timestamp: "2026-04-12T20:00:00Z",
    messageCount: 11,
  },
  {
    id: "t6",
    title: "BPC-157 Stack Product Viability",
    preview: "The stacking protocol builder scores 88 composite. Here is why...",
    timestamp: "2026-04-12T14:00:00Z",
    messageCount: 9,
  },
]

const mockActiveMessages: ChatMessageData[] = [
  {
    id: "m1",
    role: "assistant",
    content: "I have been tracking a significant signal cluster around **Retatrutide** over the past 72 hours. Here is what I have found:\n\n**The numbers:**\n- Google Trends score: **99/100** (breakout classification)\n- Search interest up **890%** in 30 days\n- 2,340 Reddit mentions across r/Peptides, r/loseit, and r/Semaglutide\n- 890 direct questions, mostly about dosing and sourcing\n- **Zero** digital products exist for this compound\n\nThis is a textbook first-mover opportunity.",
    timestamp: "2026-04-14T11:00:00Z",
  },
  {
    id: "m2",
    role: "user",
    content: "What kind of product would work best here? And how does it compare to the semaglutide guide opportunity?",
    timestamp: "2026-04-14T11:05:00Z",
  },
  {
    id: "m3",
    role: "assistant",
    content: "Good question. Let me compare them head-to-head:\n\n**Retatrutide Protocol Builder (Score: 91)**\n- Trend: 99 | Demand: 85 | Competition: 100 | Feasibility: 72\n- Best format: SaaS tool / protocol planner\n- Revenue model: $9.99/mo subscription\n- Time to build: 2-3 weeks\n- Risk: Higher -- new compound, regulatory uncertainty\n\n**Semaglutide Dosing Guide (Score: 92)**\n- Trend: 95 | Demand: 98 | Competition: 85 | Feasibility: 80\n- Best format: Interactive template + calculator\n- Revenue model: $12.99-$24.99 one-time\n- Time to build: 3-5 days\n- Risk: Lower -- established compound, existing market validation\n\n**My recommendation:** Build the semaglutide guide first (3-5 days, lower risk, immediate revenue). Use that revenue to fund the retatrutide tool (2-3 weeks, higher ceiling). The semaglutide market is not going anywhere, but the retatrutide window will close as competitors enter.\n\nSequencing matters more than picking one.",
    timestamp: "2026-04-14T11:07:00Z",
  },
  {
    id: "m4",
    role: "user",
    content: "That sequencing makes sense. What about compliance risk on the retatrutide product?",
    timestamp: "2026-04-14T11:15:00Z",
  },
  {
    id: "m5",
    role: "assistant",
    content: "Flagged it **yellow** -- moderate risk. Here is the breakdown:\n\n1. **Regulatory landscape is unclear** -- Retatrutide is in Phase 3 trials (Eli Lilly). Not yet FDA-approved for any indication\n2. **Dosing content risk** -- same as semaglutide but amplified because it is a research compound\n3. **Platform risk** -- Etsy/Whop may flag products about unapproved compounds\n\n**Mitigations:**\n- Frame as \"research reference tool\" not dosing guide\n- Add \"for educational and research purposes only\" everywhere\n- Avoid \"buy,\" \"source,\" \"inject\" language -- use \"reference,\" \"study,\" \"information\"\n- Build on your own domain, not marketplace-dependent\n- Monitor FDA pipeline -- if approved, compliance risk drops to green immediately\n\nThe compliance flag does not kill this idea. It changes the go-to-market. Own-domain SaaS with strong disclaimers is the play, not an Etsy listing.",
    timestamp: "2026-04-14T11:17:00Z",
  },
  {
    id: "m6",
    role: "user",
    content: "/compare retatrutide vs tirzepatide opportunity",
    timestamp: "2026-04-14T11:25:00Z",
  },
  {
    id: "m7",
    role: "assistant",
    content: "Running comparison...\n\n**Retatrutide vs Tirzepatide -- Head to Head:**\n\n| Metric | Retatrutide | Tirzepatide |\n|--------|------------|-------------|\n| Composite Score | 91 | 79 |\n| Trend | 99 (breakout) | 88 (rising) |\n| Competition | 100 (zero) | 55 (crowded) |\n| Feasibility | 72 | 50 |\n| Revenue Potential | 90 | 92 |\n| Time to Build | 2-3 weeks | 4-6 weeks |\n\n**Key insight:** Retatrutide wins on opportunity timing (first-mover), but tirzepatide wins on revenue ceiling (course format, $49.99-$149.99 pricing). However, tirzepatide requires video content creation and you have a rule against products requiring showing your face.\n\n**Bottom line:** Retatrutide is the stronger play for you specifically. The tirzepatide course conflicts with your golden rules. I would deprioritize it.",
    timestamp: "2026-04-14T11:26:00Z",
  },
]

// --- Command Hints ---

const commandHints = [
  { command: "/rules", description: "View golden rules" },
  { command: "/stats", description: "Pipeline statistics" },
  { command: "/trending", description: "Top trending topics" },
  { command: "/deep-dive", description: "Deep analysis" },
  { command: "/compare", description: "Compare ideas" },
  { command: "/suggest", description: "Get suggestions" },
  { command: "/strategy", description: "Strategy review" },
]

// --- Main Page Component ---

export default function BrainChatPage() {
  const [activeThread, setActiveThread] = React.useState("t1")
  const [inputValue, setInputValue] = React.useState("")
  const [messages, setMessages] = React.useState<ChatMessageData[]>(mockActiveMessages)
  const [showCommands, setShowCommands] = React.useState(false)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  React.useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!inputValue.trim()) return
    const newMsg: ChatMessageData = {
      id: `m-${Date.now()}`,
      role: "user",
      content: inputValue,
      timestamp: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, newMsg])
    setInputValue("")
    setShowCommands(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value
    setInputValue(val)
    setShowCommands(val.startsWith("/") && val.length < 15)
  }

  const handleCommandSelect = (cmd: string) => {
    setInputValue(cmd + " ")
    setShowCommands(false)
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden -m-6">
      {/* Left Sidebar -- Conversation Threads */}
      <div className="flex w-72 shrink-0 flex-col border-r border-border bg-card/40">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Brain className="size-4 text-violet-400" />
            <h2 className="text-sm font-semibold text-foreground">Brain Chat</h2>
          </div>
          <Button variant="ghost" size="icon-xs">
            <Plus className="size-3.5" />
          </Button>
        </div>

        {/* New Conversation Button */}
        <div className="px-3 py-2">
          <Button variant="outline" size="sm" className="w-full gap-1.5 justify-start text-xs">
            <Plus className="size-3" />
            New Conversation
          </Button>
        </div>

        {/* Thread List */}
        <ScrollArea className="flex-1">
          <div className="px-2 py-1 space-y-0.5">
            {mockThreads.map((thread) => (
              <button
                key={thread.id}
                onClick={() => setActiveThread(thread.id)}
                className={cn(
                  "w-full rounded-lg px-3 py-2.5 text-left transition-colors",
                  activeThread === thread.id
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium truncate text-foreground">
                    {thread.title}
                  </span>
                  <Badge variant="outline" className="text-[9px] shrink-0 tabular-nums">
                    {thread.messageCount}
                  </Badge>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground truncate">
                  {thread.preview}
                </p>
                <div className="mt-1 flex items-center gap-1 text-[10px] text-muted-foreground/60">
                  <Clock className="size-2.5" />
                  {formatThreadTime(thread.timestamp)}
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-lg bg-violet-500/15">
              <Brain className="size-4 text-violet-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                {mockThreads.find((t) => t.id === activeThread)?.title ?? "Chat"}
              </h3>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Sparkles className="size-2.5" />
                Brain is analyzing {mockThreads.find((t) => t.id === activeThread)?.messageCount ?? 0} messages in this thread
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Badge variant="secondary" className="text-[10px] gap-1">
              <div className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Online
            </Badge>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 px-5">
          <div className="max-w-3xl mx-auto py-5 space-y-5">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Command Hints Dropdown */}
        {showCommands && (
          <div className="mx-5 mb-1">
            <div className="max-w-3xl mx-auto">
              <div className="rounded-lg border border-border bg-popover p-1.5 shadow-lg">
                <p className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Commands</p>
                {commandHints
                  .filter((c) => c.command.startsWith(inputValue) || inputValue === "/")
                  .map((cmd) => (
                    <button
                      key={cmd.command}
                      onClick={() => handleCommandSelect(cmd.command)}
                      className="flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-sm hover:bg-accent transition-colors"
                    >
                      <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono text-violet-400">
                        {cmd.command}
                      </code>
                      <span className="text-xs text-muted-foreground">{cmd.description}</span>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="border-t border-border px-5 py-3">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Textarea
                  placeholder="Ask Brain anything... or type / for commands"
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSend()
                    }
                  }}
                  className="min-h-10 resize-none pr-10"
                  rows={1}
                />
              </div>
              <Button
                size="icon"
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="shrink-0 self-end"
              >
                <Send className="size-4" />
              </Button>
            </div>
            <div className="mt-2 flex items-center gap-2 flex-wrap">
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <Slash className="size-2.5" />
                Commands:
              </span>
              {commandHints.slice(0, 5).map((cmd) => (
                <button
                  key={cmd.command}
                  onClick={() => handleCommandSelect(cmd.command)}
                  className="rounded bg-muted/50 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  {cmd.command}
                </button>
              ))}
              <span className="text-[10px] text-muted-foreground">+{commandHints.length - 5} more</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Helpers ---

function formatThreadTime(ts: string): string {
  const date = new Date(ts)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / 3_600_000)

  if (diffHours < 1) return "just now"
  if (diffHours < 24) return `${diffHours}h ago`

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays === 1) return "yesterday"
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}
