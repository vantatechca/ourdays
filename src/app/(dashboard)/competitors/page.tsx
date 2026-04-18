"use client";

import * as React from "react";
import {
  Users,
  Plus,
  ExternalLink,
  DollarSign,
  Star,
  ChevronDown,
  ChevronRight,
  BarChart3,
  Package,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { mockCompetitors } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

function platformBadge(platform: string) {
  switch (platform) {
    case "etsy":
      return (
        <Badge className="border-orange-500/30 bg-orange-500/10 text-orange-400">
          Etsy
        </Badge>
      );
    case "whop":
      return (
        <Badge className="border-violet-500/30 bg-violet-500/10 text-violet-400">
          Whop
        </Badge>
      );
    case "gumroad":
      return (
        <Badge className="border-pink-500/30 bg-pink-500/10 text-pink-400">
          Gumroad
        </Badge>
      );
    default:
      return <Badge variant="secondary">{platform}</Badge>;
  }
}

function priorityBadge(priority: string) {
  switch (priority) {
    case "high":
      return (
        <Badge className="border-red-500/30 bg-red-500/10 text-red-400">
          High Priority
        </Badge>
      );
    case "normal":
      return (
        <Badge className="border-blue-500/30 bg-blue-500/10 text-blue-400">
          Normal
        </Badge>
      );
    case "low":
      return (
        <Badge className="border-gray-500/30 bg-gray-500/10 text-gray-400">
          Low
        </Badge>
      );
    default:
      return <Badge variant="secondary">{priority}</Badge>;
  }
}

function CompetitorCard({
  competitor,
}: {
  competitor: (typeof mockCompetitors)[number];
}) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <Card className="border-0 bg-card/60 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-muted/60">
              <Users className="size-4 text-muted-foreground" />
            </div>
            <div>
              <div className="text-base font-semibold">{competitor.name}</div>
              <div className="flex items-center gap-2 mt-0.5">
                {platformBadge(competitor.platform)}
                {priorityBadge(competitor.watchPriority)}
              </div>
            </div>
          </div>
          <a
            href={competitor.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="size-4" />
          </a>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-muted/40 p-2.5 text-center">
            <div className="flex items-center justify-center gap-1">
              <Package className="size-3 text-muted-foreground/60" />
              <span className="text-lg font-bold tabular-nums">
                {competitor.totalProducts}
              </span>
            </div>
            <div className="text-[10px] text-muted-foreground">Products</div>
          </div>
          <div className="rounded-lg bg-muted/40 p-2.5 text-center">
            <div className="flex items-center justify-center gap-1">
              <DollarSign className="size-3 text-emerald-400/60" />
              <span className="text-lg font-bold tabular-nums text-emerald-400">
                {competitor.estimatedRevenue.replace("/mo", "")}
              </span>
            </div>
            <div className="text-[10px] text-muted-foreground">Est. Rev/mo</div>
          </div>
          <div className="rounded-lg bg-muted/40 p-2.5 text-center">
            <div
              className={cn(
                "size-2.5 rounded-full mx-auto mb-1",
                competitor.isActive ? "bg-emerald-400" : "bg-gray-500"
              )}
            />
            <div className="text-[10px] text-muted-foreground">
              {competitor.isActive ? "Active" : "Inactive"}
            </div>
          </div>
        </div>

        {/* Expand/Collapse Products */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {expanded ? (
            <ChevronDown className="size-3.5" />
          ) : (
            <ChevronRight className="size-3.5" />
          )}
          <span className="font-medium">
            {competitor.products.length} tracked products
          </span>
        </button>

        {expanded && (
          <div className="space-y-2">
            <Separator />
            {competitor.products.map((product) => (
              <div
                key={product.name}
                className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2.5"
              >
                <div className="space-y-0.5">
                  <p className="text-sm font-medium text-foreground/90">
                    {product.name}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <DollarSign className="size-3" />
                      {product.price.toFixed(2)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="size-3" />
                      {product.reviews} reviews
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold tabular-nums text-foreground/80">
                    ~{product.estimatedSales.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-muted-foreground">
                    est. sales
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function CompetitorsPage() {
  const totalProducts = mockCompetitors.reduce(
    (sum, c) => sum + c.totalProducts,
    0
  );
  const highPriority = mockCompetitors.filter(
    (c) => c.watchPriority === "high"
  ).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <Users className="size-6 text-blue-400" />
            Competitor Intelligence
          </h1>
          <p className="text-sm text-muted-foreground">
            Track competitor products, pricing, and market positioning
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <BarChart3 className="size-4 text-violet-400" />
            Gap Analysis
          </Button>
          <Button className="gap-2">
            <Plus className="size-4" />
            Add Competitor
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>
          <span className="font-medium text-foreground">
            {mockCompetitors.length}
          </span>{" "}
          competitors tracked
        </span>
        <Separator orientation="vertical" className="h-4" />
        <span>
          <span className="font-medium text-foreground">{totalProducts}</span>{" "}
          total products
        </span>
        <Separator orientation="vertical" className="h-4" />
        <span>
          <span className="font-medium text-red-400">{highPriority}</span> high
          priority
        </span>
      </div>

      <Separator />

      {/* Competitor Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {mockCompetitors.map((competitor) => (
          <CompetitorCard key={competitor.id} competitor={competitor} />
        ))}
      </div>
    </div>
  );
}
