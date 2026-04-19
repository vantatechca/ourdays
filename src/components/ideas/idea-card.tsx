"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle,
  XCircle,
  Star,
  MessageSquare,
  Archive,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUpRight,
  Sparkles,
  Video,
  ShoppingBag,
  Search,
  Zap,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { cn } from "@/lib/utils";
import type { IdeaCardData } from "@/lib/types";

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function scoreColor(score: number): string {
  if (score >= 70) return "text-emerald-400";
  if (score >= 40) return "text-amber-400";
  return "text-red-400";
}

function scoreBg(score: number): string {
  if (score >= 70) return "bg-emerald-500";
  if (score >= 40) return "bg-amber-500";
  return "bg-red-500";
}

function scoreBgMuted(score: number): string {
  if (score >= 70) return "bg-emerald-500/20";
  if (score >= 40) return "bg-amber-500/20";
  return "bg-red-500/20";
}

function complianceDot(flag: string): string {
  switch (flag) {
    case "green":
      return "bg-emerald-400";
    case "yellow":
      return "bg-amber-400";
    case "red":
      return "bg-red-400";
    default:
      return "bg-muted-foreground";
  }
}

function complianceLabel(flag: string): string {
  switch (flag) {
    case "green":
      return "Low Risk";
    case "yellow":
      return "Review";
    case "red":
      return "High Risk";
    default:
      return "Unknown";
  }
}

function categoryLabel(cat: string): string {
  return cat
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

function opportunityLabel(opp: string): string {
  return opp
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

function opportunityColor(opp: string): string {
  switch (opp) {
    case "first_mover":
      return "border-violet-500/30 bg-violet-500/10 text-violet-400";
    case "gap_opportunity":
      return "border-blue-500/30 bg-blue-500/10 text-blue-400";
    case "emerging_trend":
      return "border-cyan-500/30 bg-cyan-500/10 text-cyan-400";
    case "proven_model":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
    case "improvement":
      return "border-amber-500/30 bg-amber-500/10 text-amber-400";
    default:
      return "border-border bg-muted text-muted-foreground";
  }
}

function daysAgo(dateStr: string): number {
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function TrendDirectionIcon({
  direction,
}: {
  direction: string | undefined;
}) {
  if (!direction) return null;
  switch (direction) {
    case "rising":
      return <TrendingUp className="size-3.5 text-emerald-400" />;
    case "breakout":
      return <ArrowUpRight className="size-3.5 text-violet-400" />;
    case "declining":
      return <TrendingDown className="size-3.5 text-red-400" />;
    default:
      return <Minus className="size-3.5 text-muted-foreground" />;
  }
}

function PlatformIcon({ platform }: { platform: string }) {
  const cls = "size-3.5";
  switch (platform) {
    case "reddit":
      return <Sparkles className={cn(cls, "text-orange-400")} />;
    case "youtube":
      return <Video className={cn(cls, "text-red-400")} />;
    case "google_trends":
      return <Search className={cn(cls, "text-blue-400")} />;
    case "etsy":
      return <ShoppingBag className={cn(cls, "text-orange-500")} />;
    case "whop":
      return <Zap className={cn(cls, "text-violet-400")} />;
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/*  Score Bar                                                          */
/* ------------------------------------------------------------------ */

function ScoreBar({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-12 shrink-0 text-[11px] text-muted-foreground">
        {label}
      </span>
      <div className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-muted/60">
        <div
          className={cn("absolute inset-y-0 left-0 rounded-full", scoreBg(value))}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className={cn("w-6 text-right text-[11px] font-medium", scoreColor(value))}>
        {value}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

interface IdeaCardProps {
  idea: IdeaCardData;
  className?: string;
}

export function IdeaCard({ idea, className }: IdeaCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [action, setAction] = useState<"approved" | "declined" | "archived" | null>(null);
  const [starred, setStarred] = useState(false);
  const days = daysAgo(idea.discoveredAt);

  const handleAction = (newAction: "approved" | "declined" | "archived") => {
    setAction((prev) => (prev === newAction ? null : newAction));
  };

  return (
    <Card
      className={cn(
        "group border-0 bg-card/60 backdrop-blur-sm transition-all hover:bg-card/80 hover:ring-foreground/20",
        className
      )}
    >
      <CardHeader className="gap-2 pb-0">
        {/* Top row: badges */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="secondary" className="text-xs">
            {categoryLabel(idea.category)}
          </Badge>
          {idea.opportunityType && (
            <Badge className={cn("text-xs", opportunityColor(idea.opportunityType))}>
              {opportunityLabel(idea.opportunityType)}
            </Badge>
          )}
          <div className="ml-auto flex items-center gap-1.5">
            <div
              className={cn("size-2 rounded-full", complianceDot(idea.complianceFlag))}
              title={`Compliance: ${complianceLabel(idea.complianceFlag)}`}
            />
            <span className="text-[10px] text-muted-foreground">
              {complianceLabel(idea.complianceFlag)}
            </span>
          </div>
        </div>

        {/* Title */}
        <Link
          href={`/ideas/${idea.slug}`}
          className="text-sm font-semibold leading-snug text-foreground transition-colors hover:text-primary"
        >
          {idea.title}
        </Link>

        {/* Summary */}
        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {idea.summary}
        </p>
      </CardHeader>

      <CardContent className="space-y-3 pt-2">
        {/* Score + Confidence Row */}
        <div className="flex items-center gap-4">
          {/* Large Composite Score */}
          <div className="flex flex-col items-center">
            <span
              className={cn(
                "text-3xl font-black tabular-nums tracking-tighter",
                scoreColor(idea.compositeScore)
              )}
            >
              {idea.compositeScore}
            </span>
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Score
            </span>
          </div>

          {/* Mini Score Breakdown */}
          <div className="flex-1 space-y-1">
            <ScoreBar label="Trend" value={idea.trendScore} />
            <ScoreBar label="Demand" value={idea.demandScore} />
            <ScoreBar label="Compet." value={idea.competitionScore} />
            <ScoreBar label="Feasib." value={idea.feasibilityScore} />
            <ScoreBar label="Revenue" value={idea.revenuePotentialScore} />
          </div>
        </div>

        {/* Confidence */}
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "h-1 flex-1 overflow-hidden rounded-full",
              scoreBgMuted(idea.confidenceScore)
            )}
          >
            <div
              className={cn("h-full rounded-full", scoreBg(idea.confidenceScore))}
              style={{ width: `${idea.confidenceScore}%` }}
            />
          </div>
          <span className={cn("text-xs font-medium", scoreColor(idea.confidenceScore))}>
            {idea.confidenceScore}% conf
          </span>
        </div>

        {/* Peptide Topics */}
        <div className="flex flex-wrap gap-1">
          {idea.peptideTopics.map((topic) => (
            <Badge
              key={topic}
              variant="outline"
              className="border-border/50 text-[10px] text-muted-foreground"
            >
              {topic}
            </Badge>
          ))}
        </div>

        {/* Source Platforms */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {idea.sourcePlatforms.map((p) => (
              <div
                key={p}
                className="flex size-5 items-center justify-center rounded bg-muted/60"
                title={p}
              >
                <PlatformIcon platform={p} />
              </div>
            ))}
          </div>
          <div className="h-3 w-px bg-border" />
          {/* Google Trends Direction */}
          <div className="flex items-center gap-1">
            <TrendDirectionIcon direction={idea.googleTrendsDirection} />
            {idea.googleTrendsScore && (
              <span className="text-[10px] text-muted-foreground">
                GT: {idea.googleTrendsScore}
              </span>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
          {idea.redditMentionCount > 0 && (
            <span className="flex items-center gap-1">
              <Sparkles className="size-3 text-orange-400" />
              {idea.redditMentionCount.toLocaleString()} mentions
            </span>
          )}
          {idea.youtubeVideoCount > 0 && (
            <span className="flex items-center gap-1">
              <Video className="size-3 text-red-400" />
              {idea.youtubeVideoCount} videos
            </span>
          )}
          {idea.etsyCompetitorCount > 0 && (
            <span className="flex items-center gap-1">
              <ShoppingBag className="size-3 text-orange-500" />
              {idea.etsyCompetitorCount} competitors
            </span>
          )}
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className="space-y-2 border-t border-border/50 pt-3">
            {idea.estimatedPriceRange && (
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Price Range</span>
                <span className="font-medium text-foreground">
                  {idea.estimatedPriceRange}
                </span>
              </div>
            )}
            {idea.effortToBuild && (
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Build Effort</span>
                <span className="font-medium capitalize text-foreground">
                  {idea.effortToBuild}
                </span>
              </div>
            )}
            {idea.timeToBuild && (
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Time to Build</span>
                <span className="font-medium text-foreground">
                  {idea.timeToBuild}
                </span>
              </div>
            )}
            {idea.targetAudience && (
              <div className="flex justify-between text-xs">
                <span className="shrink-0 text-muted-foreground">Audience</span>
                <span className="ml-4 text-right font-medium text-foreground">
                  {idea.targetAudience}
                </span>
              </div>
            )}
            {idea.complianceNotes && (
              <div className="rounded-md bg-muted/40 p-2 text-xs text-muted-foreground">
                <span className="font-medium text-foreground/80">
                  Compliance:
                </span>{" "}
                {idea.complianceNotes}
              </div>
            )}
          </div>
        )}

        {/* Discovered time + toggle */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">
            Discovered {days === 0 ? "today" : `${days}d ago`}
          </span>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[11px] font-medium text-primary/70 transition-colors hover:text-primary"
          >
            {expanded ? "Less" : "More details"}
          </button>
        </div>
      </CardContent>

      {/* Action Buttons */}
      <CardFooter className="gap-1 border-t-border/40 bg-transparent px-3 py-2">
        <Button
          variant="ghost"
          size="icon-xs"
          className={cn(
            "text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300",
            action === "approved" && "bg-emerald-500/20 text-emerald-300"
          )}
          title="Approve"
          onClick={() => handleAction("approved")}
        >
          <CheckCircle className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon-xs"
          className={cn(
            "text-red-400 hover:bg-red-500/10 hover:text-red-300",
            action === "declined" && "bg-red-500/20 text-red-300"
          )}
          title="Decline"
          onClick={() => handleAction("declined")}
        >
          <XCircle className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon-xs"
          className={cn(
            "text-amber-400 hover:bg-amber-500/10 hover:text-amber-300",
            starred && "bg-amber-500/20 text-amber-300"
          )}
          title="Star"
          onClick={() => setStarred((prev) => !prev)}
        >
          <Star className={cn("size-3.5", starred && "fill-current")} />
        </Button>
        <ButtonLink
          href={`/brain-chat?idea=${idea.slug}`}
          variant="ghost"
          size="icon-xs"
          className="text-blue-400 hover:bg-blue-500/10 hover:text-blue-300"
          title="Chat"
        >
          <MessageSquare className="size-3.5" />
        </ButtonLink>
        <Button
          variant="ghost"
          size="icon-xs"
          className={cn(
            "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            action === "archived" && "bg-muted text-foreground"
          )}
          title="Archive"
          onClick={() => handleAction("archived")}
        >
          <Archive className="size-3.5" />
        </Button>
        <div className="flex-1" />
        <ButtonLink
          href={`/ideas/${idea.slug}`}
          variant="ghost"
          size="xs"
          className="gap-1 text-xs text-muted-foreground"
        >
          View
          <ArrowUpRight className="size-3" />
        </ButtonLink>
      </CardFooter>
    </Card>
  );
}
