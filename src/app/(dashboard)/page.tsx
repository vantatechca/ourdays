import {
  Lightbulb,
  Clock,
  CheckCircle,
  BarChart3,
  CalendarDays,
  TrendingUp,
  Zap,
  Star,
  Sparkles,
  Radar,
  ThumbsDown,
  BookOpen,
  Brain,
  Play,
  Video,
  Rss,
  ShoppingBag,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatsCard } from "@/components/dashboard/stats-card";
import {
  mockDashboardStats,
  mockActivity,
  mockScraperStatus,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";

function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours < 1) return "just now";
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function ActivityIcon({ action }: { action: string }) {
  const iconClass = "size-4";
  switch (action) {
    case "idea_detected":
      return <Lightbulb className={cn(iconClass, "text-amber-400")} />;
    case "idea_approved":
      return <CheckCircle className={cn(iconClass, "text-emerald-400")} />;
    case "idea_declined":
      return <ThumbsDown className={cn(iconClass, "text-red-400")} />;
    case "scraper_completed":
      return <Radar className={cn(iconClass, "text-blue-400")} />;
    case "rule_created":
      return <BookOpen className={cn(iconClass, "text-violet-400")} />;
    case "pattern_detected":
      return <Brain className={cn(iconClass, "text-cyan-400")} />;
    default:
      return <Sparkles className={cn(iconClass, "text-muted-foreground")} />;
  }
}

function activityDescription(
  activity: (typeof mockActivity)[number]
): string {
  const d = activity.details as Record<string, unknown>;
  switch (activity.action) {
    case "idea_detected":
      return `New idea detected: ${d.title} (score: ${d.score})`;
    case "idea_approved":
      return `Approved: ${d.title}`;
    case "idea_declined":
      return `Declined: ${d.title}`;
    case "scraper_completed":
      return `${d.scraper} scrape completed — ${d.signals} signals, ${d.ideas} new ideas`;
    case "rule_created":
      return `New rule added: ${d.rule}`;
    case "pattern_detected":
      return `Pattern detected: ${d.pattern} (${Math.round(Number(d.confidence) * 100)}% conf)`;
    default:
      return activity.action;
  }
}

function ScraperPlatformIcon({ platform }: { platform: string }) {
  const iconClass = "size-4";
  switch (platform) {
    case "reddit":
      return <Sparkles className={cn(iconClass, "text-orange-400")} />;
    case "google_trends":
      return <TrendingUp className={cn(iconClass, "text-blue-400")} />;
    case "youtube":
      return <Video className={cn(iconClass, "text-red-400")} />;
    case "rss":
      return <Rss className={cn(iconClass, "text-amber-400")} />;
    case "etsy":
      return <ShoppingBag className={cn(iconClass, "text-orange-500")} />;
    case "whop":
      return <Zap className={cn(iconClass, "text-violet-400")} />;
    case "bhw":
      return <BookOpen className={cn(iconClass, "text-cyan-400")} />;
    default:
      return <Radar className={cn(iconClass, "text-muted-foreground")} />;
  }
}

function scraperStatusBadge(status: string) {
  switch (status) {
    case "running":
      return (
        <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
          Running
        </Badge>
      );
    case "error":
      return (
        <Badge className="border-red-500/30 bg-red-500/10 text-red-400">
          Error
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary" className="text-muted-foreground">
          Idle
        </Badge>
      );
  }
}

export default function DashboardPage() {
  const stats = mockDashboardStats;

  return (
    <div className="space-y-6">
      {/* Page Header -- layout already provides p-6 wrapper */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          PeptideIQ research intelligence at a glance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatsCard
          label="Total Ideas"
          value={stats.totalIdeas}
          icon={<Lightbulb className="size-5" />}
          accent="blue"
          trend={{ value: 14, label: "vs last week" }}
        />
        <StatsCard
          label="Pending Review"
          value={stats.pendingReview}
          icon={<Clock className="size-5" />}
          accent="amber"
          trend={{ value: 8, label: "new" }}
        />
        <StatsCard
          label="Approved"
          value={stats.approved}
          icon={<CheckCircle className="size-5" />}
          accent="emerald"
          trend={{ value: 33, label: "this month" }}
        />
        <StatsCard
          label="Avg Score"
          value={stats.avgScore}
          icon={<BarChart3 className="size-5" />}
          accent="violet"
          trend={{ value: 2.1, label: "vs last week" }}
        />
        <StatsCard
          label="Ideas This Week"
          value={stats.ideasThisWeek}
          icon={<CalendarDays className="size-5" />}
          accent="default"
          trend={{ value: -5, label: "vs prior" }}
        />
        <StatsCard
          label="Top Trending"
          value={stats.topTrendingTopic}
          icon={<TrendingUp className="size-5" />}
          accent="red"
          trend={{ value: 890, label: "searches" }}
        />
      </div>

      {/* Quick Actions */}
      <Card className="border-0 bg-card/60 backdrop-blur-sm">
        <CardHeader className="pb-0">
          <CardTitle className="text-sm font-semibold text-muted-foreground">
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant="outline" className="gap-2">
            <Zap className="size-4 text-amber-400" />
            Run Full Scrape
          </Button>
          <Button variant="outline" className="gap-2">
            <Star className="size-4 text-emerald-400" />
            Today&apos;s Best
          </Button>
          <Button variant="outline" className="gap-2">
            <Sparkles className="size-4 text-blue-400" />
            What&apos;s New
          </Button>
        </CardContent>
      </Card>

      {/* Bottom Grid: Activity + Scrapers */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Activity Feed */}
        <Card className="border-0 bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Play className="size-4 text-emerald-400" />
              Activity Feed
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 px-4 pb-4">
            {mockActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted/40"
              >
                <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-muted/60">
                  <ActivityIcon action={activity.action} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm leading-snug text-foreground/90">
                    {activityDescription(activity)}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {getTimeAgo(activity.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Research Pulse / Scraper Status */}
        <Card className="border-0 bg-card/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Radar className="size-4 text-blue-400" />
              Research Pulse
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 px-4 pb-4">
            {mockScraperStatus.map((scraper) => (
              <div
                key={scraper.name}
                className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-muted/40"
              >
                <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted/60">
                  <ScraperPlatformIcon platform={scraper.platform} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground/90">
                      {scraper.name}
                    </span>
                    {scraperStatusBadge(scraper.status)}
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {scraper.signalsTotal.toLocaleString()} signals
                    <span className="mx-1.5 text-border">|</span>
                    Every {scraper.frequency}
                    <span className="mx-1.5 text-border">|</span>
                    Last: {getTimeAgo(scraper.lastRun)}
                  </p>
                </div>
                <div
                  className={cn(
                    "size-2 shrink-0 rounded-full",
                    scraper.status === "running"
                      ? "animate-pulse bg-emerald-400"
                      : scraper.status === "error"
                        ? "bg-red-400"
                        : "bg-muted-foreground/40"
                  )}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
