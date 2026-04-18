"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  Zap,
  Target,
  Users,
  Hammer,
  ExternalLink,
  MessageSquare,
  Send,
  FileText,
  Search,
  Globe,
  Video,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Flame,
  Eye,
  Sparkles,
  ScrollText,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { mockIdeas, mockCompetitors } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChatMessage, type ChatMessageData } from "@/components/chat/chat-message"

// --- Status & Category Styling ---

const statusConfig: Record<string, { label: string; color: string }> = {
  detected: { label: "Detected", color: "bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/20" },
  reviewing: { label: "Reviewing", color: "bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/20" },
  approved: { label: "Approved", color: "bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20" },
  declined: { label: "Declined", color: "bg-red-500/15 text-red-400 ring-1 ring-red-500/20" },
  incubating: { label: "Incubating", color: "bg-violet-500/15 text-violet-400 ring-1 ring-violet-500/20" },
  archived: { label: "Archived", color: "bg-zinc-500/15 text-zinc-400 ring-1 ring-zinc-500/20" },
  starred: { label: "Starred", color: "bg-yellow-500/15 text-yellow-400 ring-1 ring-yellow-500/20" },
}

const complianceConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  green: { label: "Low Risk", icon: <CheckCircle2 className="size-3.5" />, color: "text-emerald-400" },
  yellow: { label: "Moderate Risk", icon: <AlertTriangle className="size-3.5" />, color: "text-amber-400" },
  red: { label: "High Risk", icon: <XCircle className="size-3.5" />, color: "text-red-400" },
}

const opportunityLabels: Record<string, string> = {
  proven_model: "Proven Model",
  gap_opportunity: "Gap Opportunity",
  emerging_trend: "Emerging Trend",
  first_mover: "First Mover",
  improvement: "Improvement",
}

// --- Score Gauge ---

function ScoreGauge({ score, label, size = "sm" }: { score: number; label: string; size?: "sm" | "lg" }) {
  const color =
    score >= 80 ? "text-emerald-400" : score >= 60 ? "text-amber-400" : "text-red-400"
  const bgColor =
    score >= 80 ? "bg-emerald-500/10" : score >= 60 ? "bg-amber-500/10" : "bg-red-500/10"

  if (size === "lg") {
    return (
      <div className="flex flex-col items-center gap-1">
        <div className={cn("flex size-20 items-center justify-center rounded-2xl", bgColor)}>
          <span className={cn("text-3xl font-bold tabular-nums", color)}>{score}</span>
        </div>
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className={cn("flex size-10 items-center justify-center rounded-lg", bgColor)}>
        <span className={cn("text-sm font-bold tabular-nums", color)}>{score}</span>
      </div>
      <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
    </div>
  )
}

// --- Trend Direction Icon ---

function TrendIcon({ direction }: { direction?: string }) {
  if (direction === "breakout") return <Flame className="size-3.5 text-orange-400" />
  if (direction === "rising") return <TrendingUp className="size-3.5 text-emerald-400" />
  if (direction === "declining") return <TrendingDown className="size-3.5 text-red-400" />
  return <Minus className="size-3.5 text-muted-foreground" />
}

// --- Mock data for tabs ---

const mockDiscussionMessages: ChatMessageData[] = [
  {
    id: "d1",
    role: "user",
    content: "I think the semaglutide guide should focus on visual dosing charts. Text-heavy guides already exist.",
    timestamp: "2026-04-14T10:30:00Z",
  },
  {
    id: "d2",
    role: "assistant",
    content: "Good call. The data supports this: **73% of reconstitution questions** on Reddit are about visual measurement, not theory. A visual-first approach would differentiate immediately.\n\nRecommend: interactive syringe overlay tool + printable quick-reference card.",
    timestamp: "2026-04-14T10:32:00Z",
  },
  {
    id: "d3",
    role: "user",
    content: "What about compliance concerns with dosing content?",
    timestamp: "2026-04-14T11:00:00Z",
  },
  {
    id: "d4",
    role: "assistant",
    content: "Flagged **yellow** for a reason. Key mitigations:\n\n1. Frame as \"educational reference\" not medical advice\n2. Add prominent disclaimer on every dosing page\n3. Avoid language like \"take\" or \"administer\" - use \"reference\" and \"informational\"\n4. Include \"consult your healthcare provider\" CTA\n\nWith these guardrails, risk drops significantly. Similar products on Etsy operate in this space already.",
    timestamp: "2026-04-14T11:02:00Z",
  },
]

const mockActionLog = [
  { id: "al1", action: "Status changed to Detected", actor: "Brain", timestamp: "2026-04-14T08:30:00Z", note: "Auto-detected from Reddit scraper signal cluster" },
  { id: "al2", action: "Composite score calculated", actor: "System", timestamp: "2026-04-14T08:31:00Z", note: "Score: 92 (Trend: 95, Demand: 98, Competition: 85, Feasibility: 80, Revenue: 82)" },
  { id: "al3", action: "Compliance flag set to Yellow", actor: "Brain", timestamp: "2026-04-14T08:32:00Z", note: "Dosage content may be interpreted as medical advice" },
  { id: "al4", action: "Discussion started", actor: "You", timestamp: "2026-04-14T10:30:00Z", note: "Opened discussion thread about visual approach" },
  { id: "al5", action: "Deep dive requested", actor: "You", timestamp: "2026-04-14T12:00:00Z", note: "Requested competitive analysis deep dive" },
]

const mockMarketChartData = [
  { month: "Nov", value: 42 },
  { month: "Dec", value: 48 },
  { month: "Jan", value: 55 },
  { month: "Feb", value: 63 },
  { month: "Mar", value: 78 },
  { month: "Apr", value: 94 },
]

const mockSourceEvidence = [
  {
    platform: "reddit",
    url: "https://reddit.com/r/Semaglutide/comments/abc123",
    title: "r/Semaglutide - How do I reconstitute 5mg vial?",
    snippet: "Can someone explain the exact steps for reconstituting a 5mg semaglutide vial? I have BAC water but confused about ratios...",
    date: "2026-04-13",
    engagement: "234 upvotes, 89 comments",
  },
  {
    platform: "reddit",
    url: "https://reddit.com/r/Semaglutide/comments/def456",
    title: "r/Semaglutide - Dosing titration confusion",
    snippet: "Starting at 0.25mg for 4 weeks then going to 0.5mg - but HOW do I measure 0.25mg on an insulin syringe?",
    date: "2026-04-12",
    engagement: "189 upvotes, 67 comments",
  },
  {
    platform: "google_trends",
    url: "https://trends.google.com/trends/explore?q=semaglutide+dosing",
    title: "Google Trends - semaglutide dosing",
    snippet: "Search interest score: 94/100. Rising trend with +45% change in 30 days. Related queries: semaglutide reconstitution, semaglutide injection, semaglutide calculator.",
    date: "2026-04-14",
    engagement: "94/100 interest",
  },
  {
    platform: "youtube",
    url: "https://youtube.com/watch?v=xyz789",
    title: "How to Reconstitute Semaglutide (Step by Step)",
    snippet: "340 videos covering semaglutide reconstitution. Top video has 1.2M views. Comments consistently ask for a printable quick reference.",
    date: "2026-04-11",
    engagement: "1.2M views on top video",
  },
  {
    platform: "etsy",
    url: "https://etsy.com/search?q=semaglutide+guide",
    title: "Etsy - Semaglutide Guide Products",
    snippet: "Only 6 competitors found. Average review: 4.7 stars. Top seller has 120 reviews. Most are basic PDF journals, not interactive dosing tools.",
    date: "2026-04-14",
    engagement: "6 listings",
  },
]

// --- Platform icon helper ---

function PlatformIcon({ platform }: { platform: string }) {
  switch (platform) {
    case "reddit":
      return <MessageSquare className="size-4 text-orange-400" />
    case "google_trends":
      return <TrendingUp className="size-4 text-blue-400" />
    case "youtube":
      return <Video className="size-4 text-red-400" />
    case "etsy":
      return <Globe className="size-4 text-amber-400" />
    default:
      return <Globe className="size-4 text-muted-foreground" />
  }
}

// --- Main Page Component ---

export default function IdeaDetailPage() {
  const params = useParams()
  const ideaId = params.id as string

  const idea = mockIdeas.find((i) => i.id === ideaId || i.slug === ideaId) ?? mockIdeas[0]

  const [noteInput, setNoteInput] = React.useState("")
  const [discussionInput, setDiscussionInput] = React.useState("")
  const [messages, setMessages] = React.useState<ChatMessageData[]>(mockDiscussionMessages)

  const handleSendDiscussion = () => {
    if (!discussionInput.trim()) return
    const newMsg: ChatMessageData = {
      id: `d-${Date.now()}`,
      role: "user",
      content: discussionInput,
      timestamp: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, newMsg])
    setDiscussionInput("")
  }

  const status = statusConfig[idea.status] ?? statusConfig.detected
  const compliance = complianceConfig[idea.complianceFlag] ?? complianceConfig.green

  return (
    <div className="flex flex-col min-h-screen -m-6 pb-20">
      {/* Back nav */}
      <div className="px-6 py-3">
        <Link
          href="/ideas"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Ideas
        </Link>
      </div>

      {/* Hero Section */}
      <div className="px-6 pb-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          {/* Left: Title & Meta */}
          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className={cn("inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold", status.color)}>
                {status.label}
              </span>
              <Badge variant="outline" className="capitalize">
                {idea.category.replace(/_/g, " ")}
              </Badge>
              {idea.complianceFlag && (
                <span className={cn("inline-flex items-center gap-1 text-xs font-medium", compliance.color)}>
                  {compliance.icon}
                  {compliance.label}
                </span>
              )}
              {idea.opportunityType && (
                <Badge variant="secondary" className="text-xs">
                  {opportunityLabels[idea.opportunityType] ?? idea.opportunityType}
                </Badge>
              )}
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
              {idea.title}
            </h1>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
              {idea.summary}
            </p>

            {/* Peptide Topics */}
            <div className="flex flex-wrap gap-1.5">
              {idea.peptideTopics.map((topic) => (
                <Badge key={topic} variant="outline" className="text-xs bg-violet-500/10 text-violet-400 border-violet-500/20">
                  {topic}
                </Badge>
              ))}
              {idea.subNiche.map((niche) => (
                <Badge key={niche} variant="outline" className="text-xs capitalize">
                  {niche.replace(/_/g, " ")}
                </Badge>
              ))}
            </div>
          </div>

          {/* Right: Score Block */}
          <div className="flex items-start gap-5 shrink-0">
            <ScoreGauge score={idea.compositeScore} label="Composite" size="lg" />
            <div className="grid grid-cols-3 gap-3">
              <ScoreGauge score={idea.trendScore} label="Trend" />
              <ScoreGauge score={idea.demandScore} label="Demand" />
              <ScoreGauge score={idea.competitionScore} label="Competition" />
              <ScoreGauge score={idea.feasibilityScore} label="Feasibility" />
              <ScoreGauge score={idea.revenuePotentialScore} label="Revenue" />
              <ScoreGauge score={idea.confidenceScore} label="Confidence" />
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Tabbed Content */}
      <div className="flex-1 px-6 pt-5">
        <Tabs defaultValue="overview">
          <TabsList variant="line" className="mb-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="market">Market Data</TabsTrigger>
            <TabsTrigger value="competitive">Competitive</TabsTrigger>
            <TabsTrigger value="evidence">Evidence</TabsTrigger>
            <TabsTrigger value="discussion">Discussion</TabsTrigger>
            <TabsTrigger value="log">Action Log</TabsTrigger>
          </TabsList>

          {/* --- OVERVIEW TAB --- */}
          <TabsContent value="overview">
            <div className="grid gap-5 lg:grid-cols-2">
              {/* Summary & Analysis */}
              <Card className="border-0 bg-card/60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="size-4 text-muted-foreground" />
                    Summary & Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Summary</h4>
                    <p className="text-sm leading-relaxed text-foreground/90">{idea.summary}</p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Detailed Analysis</h4>
                    <p className="text-sm leading-relaxed text-foreground/90">
                      This opportunity scores exceptionally well across demand ({idea.demandScore}) and trend ({idea.trendScore}) dimensions.
                      The {idea.category.replace(/_/g, " ")} format in the {idea.subNiche.join(", ").replace(/_/g, " ")} sub-niche shows
                      strong market validation with {idea.redditMentionCount.toLocaleString()} Reddit mentions
                      and {idea.redditQuestionCount.toLocaleString()} direct questions. The competition score of {idea.competitionScore} indicates
                      {idea.competitionScore >= 80
                        ? " a wide-open market with minimal existing solutions"
                        : idea.competitionScore >= 60
                          ? " moderate competition with room for differentiation"
                          : " a crowded space requiring strong differentiation"}.
                    </p>
                  </div>
                  {idea.complianceNotes && (
                    <>
                      <Separator />
                      <div>
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">Compliance Notes</h4>
                        <div className={cn("flex items-start gap-2 rounded-lg p-3", idea.complianceFlag === "red" ? "bg-red-500/10" : idea.complianceFlag === "yellow" ? "bg-amber-500/10" : "bg-emerald-500/10")}>
                          <span className={compliance.color}>{compliance.icon}</span>
                          <p className="text-sm text-foreground/90">{idea.complianceNotes}</p>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Quick Facts */}
              <div className="space-y-5">
                {/* Target & Revenue */}
                <Card className="border-0 bg-card/60">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="size-4 text-muted-foreground" />
                      Target & Revenue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Target Audience</p>
                        <p className="mt-1 text-sm text-foreground">{idea.targetAudience ?? "General audience"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Opportunity Type</p>
                        <p className="mt-1 text-sm text-foreground">{opportunityLabels[idea.opportunityType ?? ""] ?? "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Price Range</p>
                        <p className="mt-1 text-sm font-semibold text-emerald-400">{idea.estimatedPriceRange ?? "TBD"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Revenue Potential</p>
                        <p className="mt-1 text-sm font-semibold text-foreground">{idea.revenuePotentialScore}/100</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Build Effort */}
                <Card className="border-0 bg-card/60">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Hammer className="size-4 text-muted-foreground" />
                      Build Effort
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Effort Level</p>
                        <p className={cn(
                          "mt-1 text-sm font-semibold capitalize",
                          idea.effortToBuild === "low" ? "text-emerald-400" : idea.effortToBuild === "medium" ? "text-amber-400" : "text-red-400"
                        )}>
                          {idea.effortToBuild ?? "TBD"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Time to Build</p>
                        <p className="mt-1 text-sm text-foreground">{idea.timeToBuild ?? "TBD"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Feasibility Score</p>
                        <p className="mt-1 text-sm font-semibold text-foreground">{idea.feasibilityScore}/100</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Product Types</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {idea.productType.map((pt) => (
                            <Badge key={pt} variant="outline" className="text-[10px] capitalize">
                              {pt.replace(/_/g, " ")}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Differentiation */}
                <Card className="border-0 bg-card/60">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="size-4 text-muted-foreground" />
                      Differentiation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground/90 leading-relaxed">
                      {idea.competitionScore >= 80
                        ? `With only ${idea.etsyCompetitorCount + idea.whopCompetitorCount} total competitors across Etsy (${idea.etsyCompetitorCount}) and Whop (${idea.whopCompetitorCount}), this is a wide-open market. First-mover advantage is strong. Focus on building a premium, interactive product that sets the standard.`
                        : `There are ${idea.etsyCompetitorCount} Etsy competitors and ${idea.whopCompetitorCount} Whop competitors. Differentiate through interactivity, visual design, and data-driven personalization that static PDFs cannot match.`}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* --- MARKET DATA TAB --- */}
          <TabsContent value="market">
            <div className="grid gap-5 lg:grid-cols-2">
              {/* Google Trends Chart Area */}
              <Card className="border-0 bg-card/60 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="size-4 text-blue-400" />
                    Google Trends - Interest Over Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end gap-1 h-40">
                    {mockMarketChartData.map((d) => (
                      <div key={d.month} className="flex flex-1 flex-col items-center gap-1">
                        <div
                          className="w-full rounded-t bg-blue-500/30 transition-all hover:bg-blue-500/50"
                          style={{ height: `${(d.value / 100) * 140}px` }}
                        />
                        <span className="text-[10px] text-muted-foreground">{d.month}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                      <TrendIcon direction={idea.googleTrendsDirection} />
                      <span className="text-xs text-muted-foreground capitalize">{idea.googleTrendsDirection ?? "stable"}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Current score: <span className="font-semibold text-foreground">{idea.googleTrendsScore}/100</span></span>
                  </div>
                </CardContent>
              </Card>

              {/* Reddit Stats */}
              <Card className="border-0 bg-card/60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="size-4 text-orange-400" />
                    Reddit Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-orange-500/10 p-3 text-center">
                      <p className="text-2xl font-bold text-orange-400">{idea.redditMentionCount.toLocaleString()}</p>
                      <p className="text-[10px] font-medium text-muted-foreground mt-1">Total Mentions</p>
                    </div>
                    <div className="rounded-lg bg-orange-500/10 p-3 text-center">
                      <p className="text-2xl font-bold text-orange-400">{idea.redditQuestionCount.toLocaleString()}</p>
                      <p className="text-[10px] font-medium text-muted-foreground mt-1">Direct Questions</p>
                    </div>
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">
                    Question-to-mention ratio: <span className="font-semibold text-foreground">{((idea.redditQuestionCount / idea.redditMentionCount) * 100).toFixed(0)}%</span> -- indicates high confusion/demand for solutions
                  </div>
                </CardContent>
              </Card>

              {/* YouTube Stats */}
              <Card className="border-0 bg-card/60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="size-4 text-red-400" />
                    YouTube Coverage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg bg-red-500/10 p-3 text-center">
                    <p className="text-2xl font-bold text-red-400">{idea.youtubeVideoCount}</p>
                    <p className="text-[10px] font-medium text-muted-foreground mt-1">Related Videos</p>
                  </div>
                  <div className="mt-3 text-xs text-muted-foreground">
                    {idea.youtubeVideoCount > 200
                      ? "High video saturation. Opportunity lies in tools/templates, not more video content."
                      : idea.youtubeVideoCount > 50
                        ? "Moderate video coverage. Supplementary digital products would complement existing video content."
                        : "Low video coverage. Early market stage -- room for both content and tools."}
                  </div>
                </CardContent>
              </Card>

              {/* Search Volume */}
              <Card className="border-0 bg-card/60 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="size-4 text-muted-foreground" />
                    Search Volume & Signals
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      { label: "Google Trends Score", value: idea.googleTrendsScore ?? 0, max: 100, color: "text-blue-400" },
                      { label: "Reddit Mentions", value: idea.redditMentionCount, max: 5000, color: "text-orange-400" },
                      { label: "Reddit Questions", value: idea.redditQuestionCount, max: 3000, color: "text-orange-400" },
                      { label: "YouTube Videos", value: idea.youtubeVideoCount, max: 500, color: "text-red-400" },
                    ].map((metric) => (
                      <div key={metric.label} className="space-y-1.5">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{metric.label}</p>
                        <p className={cn("text-lg font-bold tabular-nums", metric.color)}>{metric.value.toLocaleString()}</p>
                        <div className="h-1 rounded-full bg-muted">
                          <div
                            className={cn("h-1 rounded-full", metric.color === "text-blue-400" ? "bg-blue-500" : metric.color === "text-orange-400" ? "bg-orange-500" : "bg-red-500")}
                            style={{ width: `${Math.min((metric.value / metric.max) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* --- COMPETITIVE LANDSCAPE TAB --- */}
          <TabsContent value="competitive">
            <div className="space-y-5">
              {/* Competitor Count */}
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { platform: "Etsy", count: idea.etsyCompetitorCount, color: "text-amber-400", bg: "bg-amber-500/10" },
                  { platform: "Whop", count: idea.whopCompetitorCount, color: "text-violet-400", bg: "bg-violet-500/10" },
                  { platform: "Total", count: idea.etsyCompetitorCount + idea.whopCompetitorCount, color: "text-foreground", bg: "bg-muted" },
                ].map((item) => (
                  <Card key={item.platform} className="border-0 bg-card/60">
                    <CardContent className="flex items-center gap-3 py-0">
                      <div className={cn("flex size-10 items-center justify-center rounded-lg", item.bg)}>
                        <span className={cn("text-lg font-bold tabular-nums", item.color)}>{item.count}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.platform}</p>
                        <p className="text-xs text-muted-foreground">Competitors</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Existing Products Table */}
              <Card className="border-0 bg-card/60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="size-4 text-muted-foreground" />
                    Existing Products (Relevant Competitors)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product</th>
                          <th className="pb-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Seller</th>
                          <th className="pb-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Price</th>
                          <th className="pb-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Reviews</th>
                          <th className="pb-2 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Est. Sales</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {mockCompetitors.flatMap((c) =>
                          c.products.map((p) => (
                            <tr key={`${c.id}-${p.name}`} className="hover:bg-muted/30 transition-colors">
                              <td className="py-2.5 pr-4 text-foreground font-medium">{p.name}</td>
                              <td className="py-2.5 pr-4">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-foreground/80">{c.name}</span>
                                  <Badge variant="outline" className="text-[9px] capitalize">{c.platform}</Badge>
                                </div>
                              </td>
                              <td className="py-2.5 text-right font-mono text-emerald-400">${p.price.toFixed(2)}</td>
                              <td className="py-2.5 text-right tabular-nums text-foreground/80">{p.reviews}</td>
                              <td className="py-2.5 text-right tabular-nums text-foreground/80">{p.estimatedSales.toLocaleString()}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* AI Gap Analysis */}
              <Card className="border-0 bg-card/60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="size-4 text-amber-400" />
                    AI Gap Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-foreground/90 leading-relaxed">
                    Based on analysis of {mockCompetitors.reduce((acc, c) => acc + c.products.length, 0)} competitor products across {mockCompetitors.length} sellers:
                  </p>
                  <ul className="space-y-2 text-sm">
                    {[
                      "No existing product offers interactive dosing calculations -- all are static PDFs or printables",
                      "Visual syringe overlays are absent from every competitor offering",
                      "Most competitor products are generic journal/tracker formats, not specialized for reconstitution",
                      "Price gap exists between $9.99 static PDFs and premium $49.99 courses -- room for a $14.99-24.99 interactive tool",
                      "Zero competitors offer titration schedule builders with personalized dosing",
                    ].map((gap, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <ChevronRight className="size-3.5 mt-0.5 shrink-0 text-amber-400" />
                        <span className="text-foreground/90">{gap}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* --- EVIDENCE & SOURCES TAB --- */}
          <TabsContent value="evidence">
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="size-4 text-muted-foreground" />
                <h3 className="text-sm font-semibold text-foreground">Sources ({mockSourceEvidence.length})</h3>
                <span className="text-xs text-muted-foreground">
                  From {idea.sourcePlatforms.length} platform{idea.sourcePlatforms.length !== 1 ? "s" : ""}
                </span>
              </div>

              {mockSourceEvidence.map((source) => (
                <Card key={source.url} className="border-0 bg-card/60">
                  <CardContent className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <PlatformIcon platform={source.platform} />
                        <span className="text-sm font-medium text-foreground truncate">{source.title}</span>
                      </div>
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Open <ExternalLink className="size-3" />
                      </a>
                    </div>
                    <p className="text-sm text-foreground/70 leading-relaxed pl-6">
                      {source.snippet}
                    </p>
                    <div className="flex items-center gap-3 pl-6 text-xs text-muted-foreground">
                      <span>{source.date}</span>
                      <span>{source.engagement}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* --- DISCUSSION TAB --- */}
          <TabsContent value="discussion">
            <Card className="border-0 bg-card/60">
              <CardContent>
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4 py-2">
                    {messages.map((msg) => (
                      <ChatMessage key={msg.id} message={msg} />
                    ))}
                  </div>
                </ScrollArea>

                <Separator className="my-3" />

                <div className="flex gap-2">
                  <Textarea
                    placeholder="Discuss this idea with Brain..."
                    value={discussionInput}
                    onChange={(e) => setDiscussionInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendDiscussion()
                      }
                    }}
                    className="min-h-10 flex-1 resize-none"
                    rows={1}
                  />
                  <Button
                    size="icon"
                    onClick={handleSendDiscussion}
                    disabled={!discussionInput.trim()}
                  >
                    <Send className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* --- ACTION LOG TAB --- */}
          <TabsContent value="log">
            <Card className="border-0 bg-card/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ScrollText className="size-4 text-muted-foreground" />
                  Action Log
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative space-y-0">
                  {/* Timeline line */}
                  <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border" />

                  {mockActionLog.map((entry, i) => (
                    <div key={entry.id} className="relative flex gap-3 pb-5 last:pb-0">
                      {/* Dot */}
                      <div className="relative z-10 mt-1.5 flex size-[23px] shrink-0 items-center justify-center">
                        <div className={cn(
                          "size-2.5 rounded-full",
                          i === 0 ? "bg-blue-400" : "bg-muted-foreground/40"
                        )} />
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">{entry.action}</span>
                          <Badge variant="outline" className="text-[9px]">{entry.actor}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{entry.note}</p>
                        <p className="text-[10px] text-muted-foreground/60">
                          {new Date(entry.timestamp).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* --- STICKY BOTTOM BAR --- */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-card/95 backdrop-blur-sm">
        <div className="flex items-center gap-3 px-6 py-3">
          {/* Status Dropdown */}
          <Select defaultValue={idea.status}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="detected">Detected</SelectItem>
              <SelectItem value="reviewing">Reviewing</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
              <SelectItem value="incubating">Incubating</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>

          {/* Note Input */}
          <Input
            placeholder="Add a note..."
            value={noteInput}
            onChange={(e) => setNoteInput(e.target.value)}
            className="flex-1 max-w-sm"
          />

          <div className="flex-1" />

          {/* Action Buttons */}
          <Button variant="outline" size="sm" className="gap-1.5">
            <Search className="size-3.5" />
            Deep Dive
          </Button>
          <Button size="sm" className="gap-1.5">
            <FileText className="size-3.5" />
            Generate Product Spec
          </Button>
        </div>
      </div>
    </div>
  )
}
