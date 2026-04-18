"use client";

import { useState, useMemo } from "react";
import {
  Filter,
  ArrowDownWideNarrow,
  LayoutGrid,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { IdeaCard } from "@/components/ideas/idea-card";
import { mockIdeas } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { IdeaStatus, IdeaCategory } from "@/lib/types";

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const STATUS_OPTIONS: { value: IdeaStatus | "all"; label: string }[] = [
  { value: "all", label: "All Statuses" },
  { value: "detected", label: "Detected" },
  { value: "reviewing", label: "Reviewing" },
  { value: "approved", label: "Approved" },
  { value: "declined", label: "Declined" },
  { value: "incubating", label: "Incubating" },
  { value: "starred", label: "Starred" },
  { value: "archived", label: "Archived" },
];

const SORT_OPTIONS = [
  { value: "score_desc", label: "Score (High to Low)" },
  { value: "score_asc", label: "Score (Low to High)" },
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "trend_desc", label: "Trending" },
  { value: "demand_desc", label: "Most Demanded" },
];

const CATEGORY_OPTIONS: { value: IdeaCategory; label: string }[] = [
  { value: "ebook", label: "Ebook" },
  { value: "course", label: "Course" },
  { value: "template", label: "Template" },
  { value: "calculator", label: "Calculator" },
  { value: "saas_tool", label: "SaaS Tool" },
  { value: "ai_app", label: "AI App" },
  { value: "membership", label: "Membership" },
  { value: "tracker", label: "Tracker" },
  { value: "community", label: "Community" },
  { value: "coaching", label: "Coaching" },
];

const SCORE_RANGES = [
  { value: "all", label: "All Scores" },
  { value: "high", label: "70+" },
  { value: "medium", label: "40-69" },
  { value: "low", label: "Below 40" },
];

// Default: show detected + reviewing when "all" is selected
const DEFAULT_STATUSES: IdeaStatus[] = ["detected", "reviewing"];

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function IdeasPage() {
  const [statusFilter, setStatusFilter] = useState<IdeaStatus | "all">("all");
  const [scoreRange, setScoreRange] = useState("all");
  const [selectedCategories, setSelectedCategories] = useState<Set<IdeaCategory>>(
    new Set()
  );
  const [sortBy, setSortBy] = useState("score_desc");
  const [showFilters, setShowFilters] = useState(true);

  const filteredAndSorted = useMemo(() => {
    let filtered = [...mockIdeas];

    // Status filter
    if (statusFilter === "all") {
      filtered = filtered.filter((idea) =>
        DEFAULT_STATUSES.includes(idea.status)
      );
    } else {
      filtered = filtered.filter((idea) => idea.status === statusFilter);
    }

    // Score range
    if (scoreRange === "high") {
      filtered = filtered.filter((idea) => idea.compositeScore >= 70);
    } else if (scoreRange === "medium") {
      filtered = filtered.filter(
        (idea) => idea.compositeScore >= 40 && idea.compositeScore < 70
      );
    } else if (scoreRange === "low") {
      filtered = filtered.filter((idea) => idea.compositeScore < 40);
    }

    // Category filter
    if (selectedCategories.size > 0) {
      filtered = filtered.filter((idea) =>
        selectedCategories.has(idea.category as IdeaCategory)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "score_desc":
          return b.compositeScore - a.compositeScore;
        case "score_asc":
          return a.compositeScore - b.compositeScore;
        case "newest":
          return (
            new Date(b.discoveredAt).getTime() -
            new Date(a.discoveredAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.discoveredAt).getTime() -
            new Date(b.discoveredAt).getTime()
          );
        case "trend_desc":
          return b.trendScore - a.trendScore;
        case "demand_desc":
          return b.demandScore - a.demandScore;
        default:
          return b.compositeScore - a.compositeScore;
      }
    });

    return filtered;
  }, [statusFilter, scoreRange, selectedCategories, sortBy]);

  function toggleCategory(cat: IdeaCategory) {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  }

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Ideas</h1>
          <p className="text-sm text-muted-foreground">
            Browse and manage detected product opportunities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="tabular-nums">
            {filteredAndSorted.length} shown / {mockIdeas.length} total
          </Badge>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="size-3.5" />
            Filters
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      {showFilters && (
        <div className="flex flex-wrap items-start gap-4 rounded-xl bg-card/40 p-4 ring-1 ring-foreground/5">
          {/* Status */}
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              Status
            </span>
            <div className="flex flex-wrap gap-1">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setStatusFilter(opt.value)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                    statusFilter === opt.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Score Range */}
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              Score Range
            </span>
            <div className="flex gap-1">
              {SCORE_RANGES.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setScoreRange(opt.value)}
                  className={cn(
                    "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                    scoreRange === opt.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category Checkboxes */}
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              Category
            </span>
            <div className="flex flex-wrap gap-x-3 gap-y-1.5">
              {CATEGORY_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className="flex cursor-pointer items-center gap-1.5"
                >
                  <Checkbox
                    checked={selectedCategories.has(opt.value)}
                    onCheckedChange={() => toggleCategory(opt.value)}
                  />
                  <span className="text-xs text-muted-foreground">
                    {opt.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              Sort By
            </span>
            <div className="flex flex-wrap gap-1">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSortBy(opt.value)}
                  className={cn(
                    "flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                    sortBy === opt.value
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {sortBy === opt.value && (
                    <ArrowDownWideNarrow className="size-3" />
                  )}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clear all */}
          {(statusFilter !== "all" ||
            scoreRange !== "all" ||
            selectedCategories.size > 0 ||
            sortBy !== "score_desc") && (
            <Button
              variant="ghost"
              size="xs"
              className="mt-5 text-xs text-muted-foreground"
              onClick={() => {
                setStatusFilter("all");
                setScoreRange("all");
                setSelectedCategories(new Set());
                setSortBy("score_desc");
              }}
            >
              Clear all
            </Button>
          )}
        </div>
      )}

      {/* Results count */}
      {filteredAndSorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <LayoutGrid className="mb-3 size-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            No ideas match your current filters.
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2"
            onClick={() => {
              setStatusFilter("all");
              setScoreRange("all");
              setSelectedCategories(new Set());
            }}
          >
            Reset filters
          </Button>
        </div>
      ) : (
        /* Ideas Grid */
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {filteredAndSorted.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      )}
    </div>
  );
}
