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
  TrendingUp,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
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
  const [showGapAnalysis, setShowGapAnalysis] = React.useState(false);
  const [showAddCompetitor, setShowAddCompetitor] = React.useState(false);
  const [newCompetitor, setNewCompetitor] = React.useState({
    name: "",
    platform: "etsy",
    profileUrl: "",
  });

  const totalProducts = mockCompetitors.reduce(
    (sum, c) => sum + c.totalProducts,
    0
  );
  const highPriority = mockCompetitors.filter(
    (c) => c.watchPriority === "high"
  ).length;

  const handleAddCompetitor = () => {
    if (!newCompetitor.name.trim()) {
      toast.error("Please enter a competitor name");
      return;
    }
    toast.success(`Competitor "${newCompetitor.name}" added successfully!`);
    setNewCompetitor({ name: "", platform: "etsy", profileUrl: "" });
    setShowAddCompetitor(false);
  };

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
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setShowGapAnalysis(true)}
          >
            <BarChart3 className="size-4 text-violet-400" />
            Gap Analysis
          </Button>
          <Button className="gap-2" onClick={() => setShowAddCompetitor(true)}>
            <Plus className="size-4" />
            Add Competitor
          </Button>
        </div>
      </div>

      {/* Gap Analysis Modal */}
      <Modal
        open={showGapAnalysis}
        onClose={() => setShowGapAnalysis(false)}
        size="lg"
        title={
          <span className="flex items-center gap-2">
            <BarChart3 className="size-5 text-violet-400" />
            Market Gap Analysis
          </span>
        }
      >
        <div className="space-y-4">
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3">
                <div className="flex items-start gap-2">
                  <TrendingUp className="size-4 text-emerald-400 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-emerald-400">
                      Underserved: Retatrutide Tools
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      0 competitors have products in this space. 890% search growth. First-mover advantage available.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="size-4 text-amber-400 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-amber-400">
                      Gap: Interactive Dosing Calculators
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Most competitors offer static PDFs. Interactive tools could capture 30% premium pricing.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-3">
                <div className="flex items-start gap-2">
                  <TrendingUp className="size-4 text-blue-400 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-blue-400">
                      Underpriced: BPC-157 Guides
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Current average: $14.99. Demand supports $24.99+ for comprehensive guides.
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="size-4 text-red-400 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-red-400">
                      Saturated: Generic Semaglutide Guides
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {mockCompetitors.length} competitors tracked. Avoid unless offering unique angle.
                    </p>
                  </div>
                </div>
              </div>
        </div>
      </Modal>

      {/* Add Competitor Modal */}
      <Modal
        open={showAddCompetitor}
        onClose={() => setShowAddCompetitor(false)}
        title={
          <span className="flex items-center gap-2">
            <Plus className="size-5" />
            Add Competitor
          </span>
        }
        footer={
          <>
            <Button variant="outline" onClick={() => setShowAddCompetitor(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCompetitor}>Add Competitor</Button>
          </>
        }
      >
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="comp-name" className="text-xs">Name</Label>
            <Input
              id="comp-name"
              placeholder="e.g. BiohackPro"
              value={newCompetitor.name}
              onChange={(e) => setNewCompetitor((prev) => ({ ...prev, name: e.target.value }))}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="comp-platform" className="text-xs">Platform</Label>
            <select
              id="comp-platform"
              value={newCompetitor.platform}
              onChange={(e) => setNewCompetitor((prev) => ({ ...prev, platform: e.target.value }))}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="etsy">Etsy</option>
              <option value="whop">Whop</option>
              <option value="gumroad">Gumroad</option>
              <option value="shopify">Shopify</option>
              <option value="udemy">Udemy</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="comp-url" className="text-xs">Profile URL</Label>
            <Input
              id="comp-url"
              placeholder="https://..."
              value={newCompetitor.profileUrl}
              onChange={(e) => setNewCompetitor((prev) => ({ ...prev, profileUrl: e.target.value }))}
            />
          </div>
        </div>
      </Modal>

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
