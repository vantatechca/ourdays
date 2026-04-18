import {
  TrendingUp,
  TrendingDown,
  Minus,
  Flame,
  ArrowUpRight,
  MessageSquare,
  Video,
  Newspaper,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { mockTrends } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

function directionIcon(direction: string) {
  switch (direction) {
    case "breakout":
      return <Flame className="size-4 text-red-500" />;
    case "rising":
      return <TrendingUp className="size-4 text-emerald-500" />;
    case "stable":
      return <Minus className="size-4 text-blue-500" />;
    case "declining":
      return <TrendingDown className="size-4 text-gray-500" />;
    default:
      return null;
  }
}

function directionColor(direction: string) {
  switch (direction) {
    case "breakout":
      return "text-red-500";
    case "rising":
      return "text-emerald-500";
    case "stable":
      return "text-blue-500";
    case "declining":
      return "text-gray-500";
    default:
      return "text-muted-foreground";
  }
}

function heatmapBg(direction: string) {
  switch (direction) {
    case "breakout":
      return "bg-red-500/20 border-red-500/30 hover:bg-red-500/30";
    case "rising":
      return "bg-emerald-500/15 border-emerald-500/25 hover:bg-emerald-500/25";
    case "stable":
      return "bg-blue-500/10 border-blue-500/20 hover:bg-blue-500/20";
    case "declining":
      return "bg-gray-500/10 border-gray-500/20 hover:bg-gray-500/20";
    default:
      return "bg-muted border-border";
  }
}

function directionBadge(direction: string) {
  switch (direction) {
    case "breakout":
      return (
        <Badge className="border-red-500/30 bg-red-500/10 text-red-500">
          Breakout
        </Badge>
      );
    case "rising":
      return (
        <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-500">
          Rising
        </Badge>
      );
    case "stable":
      return (
        <Badge className="border-blue-500/30 bg-blue-500/10 text-blue-500">
          Stable
        </Badge>
      );
    case "declining":
      return (
        <Badge className="border-gray-500/30 bg-gray-500/10 text-gray-500">
          Declining
        </Badge>
      );
    default:
      return <Badge variant="secondary">{direction}</Badge>;
  }
}

export default function TrendsPage() {
  const risingStars = mockTrends
    .filter((t) => t.direction === "breakout" || t.direction === "rising")
    .sort((a, b) => b.changePercent - a.changePercent);

  const breakoutCount = mockTrends.filter(
    (t) => t.direction === "breakout"
  ).length;
  const risingCount = mockTrends.filter(
    (t) => t.direction === "rising"
  ).length;
  const stableCount = mockTrends.filter(
    (t) => t.direction === "stable"
  ).length;
  const decliningCount = mockTrends.filter(
    (t) => t.direction === "declining"
  ).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <TrendingUp className="size-6 text-emerald-400" />
          Trend Overview
        </h1>
        <p className="text-sm text-muted-foreground">
          Keyword trends, platform signals, and market pulse
        </p>
      </div>

      {/* Summary Stats */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>
          <span className="font-medium text-red-500">{breakoutCount}</span>{" "}
          breakout
        </span>
        <Separator orientation="vertical" className="h-4" />
        <span>
          <span className="font-medium text-emerald-500">{risingCount}</span>{" "}
          rising
        </span>
        <Separator orientation="vertical" className="h-4" />
        <span>
          <span className="font-medium text-blue-500">{stableCount}</span>{" "}
          stable
        </span>
        <Separator orientation="vertical" className="h-4" />
        <span>
          <span className="font-medium text-gray-500">{decliningCount}</span>{" "}
          declining
        </span>
      </div>

      <Separator />

      {/* Rising Stars */}
      <div className="space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <Zap className="size-4 text-amber-400" />
          Rising Stars
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {risingStars.map((trend) => (
            <Card
              key={trend.keyword}
              className="border-0 bg-card/60 backdrop-blur-sm"
            >
              <CardContent className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-medium text-foreground/90">
                    {trend.keyword}
                  </span>
                  {directionIcon(trend.direction)}
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-bold tabular-nums">
                      {trend.value}
                    </span>
                    <span className="text-xs text-muted-foreground">/100</span>
                  </div>
                  <div
                    className={cn(
                      "flex items-center gap-0.5 text-sm font-medium",
                      directionColor(trend.direction)
                    )}
                  >
                    <ArrowUpRight className="size-3.5" />
                    {trend.changePercent > 0 ? "+" : ""}
                    {trend.changePercent}%
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {directionBadge(trend.direction)}
                  <Badge variant="secondary" className="text-xs">
                    {trend.platform === "google_trends"
                      ? "Google Trends"
                      : trend.platform.charAt(0).toUpperCase() +
                        trend.platform.slice(1)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Trend Heatmap */}
      <div className="space-y-3">
        <h2 className="flex items-center gap-2 text-sm font-semibold">
          <Flame className="size-4 text-red-400" />
          Trend Heatmap
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {mockTrends
            .sort((a, b) => b.value - a.value)
            .map((trend) => (
              <div
                key={trend.keyword}
                className={cn(
                  "flex flex-col items-center justify-center rounded-lg border p-3 text-center transition-colors",
                  heatmapBg(trend.direction)
                )}
              >
                <span className="text-xs font-medium text-foreground/80">
                  {trend.keyword}
                </span>
                <span
                  className={cn(
                    "mt-1 text-lg font-bold tabular-nums",
                    directionColor(trend.direction)
                  )}
                >
                  {trend.value}
                </span>
                <span className="mt-0.5 text-[10px] text-muted-foreground">
                  {trend.changePercent > 0 ? "+" : ""}
                  {trend.changePercent}%
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Platform Pulses */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Reddit Pulse */}
        <Card className="border-0 bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageSquare className="size-4 text-orange-400" />
              Reddit Pulse
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-muted/40 p-3 text-center">
                <div className="text-xl font-bold tabular-nums">4,231</div>
                <div className="text-xs text-muted-foreground">
                  Total Mentions
                </div>
              </div>
              <div className="rounded-lg bg-muted/40 p-3 text-center">
                <div className="text-xl font-bold tabular-nums">2,847</div>
                <div className="text-xs text-muted-foreground">Questions</div>
              </div>
            </div>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Top subreddit</span>
                <span className="font-medium text-foreground/70">
                  r/Peptides
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Trending topic</span>
                <span className="font-medium text-red-400">Retatrutide</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Sentiment</span>
                <span className="font-medium text-emerald-400">
                  Mostly Positive
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* YouTube Pulse */}
        <Card className="border-0 bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Video className="size-4 text-red-400" />
              YouTube Pulse
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-muted/40 p-3 text-center">
                <div className="text-xl font-bold tabular-nums">1,215</div>
                <div className="text-xs text-muted-foreground">
                  Videos Tracked
                </div>
              </div>
              <div className="rounded-lg bg-muted/40 p-3 text-center">
                <div className="text-xl font-bold tabular-nums">89</div>
                <div className="text-xs text-muted-foreground">New This Week</div>
              </div>
            </div>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex items-center justify-between">
                <span>Top creator niche</span>
                <span className="font-medium text-foreground/70">
                  Weight Loss
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Fastest growing</span>
                <span className="font-medium text-red-400">
                  Retatrutide reviews
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Avg views/video</span>
                <span className="font-medium text-foreground/70">12.4K</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* News Feed */}
        <Card className="border-0 bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Newspaper className="size-4 text-amber-400" />
              News Feed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-muted/40 p-3 text-center">
                <div className="text-xl font-bold tabular-nums">189</div>
                <div className="text-xs text-muted-foreground">
                  RSS Items Today
                </div>
              </div>
              <div className="rounded-lg bg-muted/40 p-3 text-center">
                <div className="text-xl font-bold tabular-nums">12</div>
                <div className="text-xs text-muted-foreground">
                  Relevant Hits
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="rounded-md bg-muted/30 p-2.5">
                <p className="text-xs font-medium text-foreground/80">
                  FDA updates GLP-1 receptor agonist guidance...
                </p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  Reuters Health - 2h ago
                </p>
              </div>
              <div className="rounded-md bg-muted/30 p-2.5">
                <p className="text-xs font-medium text-foreground/80">
                  Peptide therapy market projected to reach $52B...
                </p>
                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  BioSpace - 5h ago
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
