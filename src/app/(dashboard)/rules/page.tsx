"use client";

import * as React from "react";
import {
  BookOpen,
  Plus,
  Sparkles,
  ShieldCheck,
  ShieldBan,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  ChevronRight,
  Activity,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { mockGoldenRules } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type RuleType = "must_have" | "must_avoid" | "prefer" | "deprioritize";
type RuleDirection = "boost" | "penalize" | "block" | "require";

const ruleTypeConfig: Record<
  RuleType,
  { label: string; icon: React.ReactNode; color: string }
> = {
  must_have: {
    label: "Must Have",
    icon: <ShieldCheck className="size-4" />,
    color: "text-emerald-400",
  },
  must_avoid: {
    label: "Must Avoid",
    icon: <ShieldBan className="size-4" />,
    color: "text-red-400",
  },
  prefer: {
    label: "Prefer",
    icon: <ThumbsUp className="size-4" />,
    color: "text-blue-400",
  },
  deprioritize: {
    label: "Deprioritize",
    icon: <ThumbsDown className="size-4" />,
    color: "text-amber-400",
  },
};

function directionBadge(direction: RuleDirection) {
  switch (direction) {
    case "boost":
      return (
        <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
          BOOST
        </Badge>
      );
    case "penalize":
      return (
        <Badge className="border-amber-500/30 bg-amber-500/10 text-amber-400">
          PENALIZE
        </Badge>
      );
    case "block":
      return (
        <Badge className="border-red-500/30 bg-red-500/10 text-red-400">
          BLOCK
        </Badge>
      );
    case "require":
      return (
        <Badge className="border-blue-500/30 bg-blue-500/10 text-blue-400">
          REQUIRE
        </Badge>
      );
  }
}

function sourceBadge(source: string) {
  switch (source) {
    case "manual":
      return <Badge variant="secondary">Manual</Badge>;
    case "ai_suggested":
      return (
        <Badge className="border-violet-500/30 bg-violet-500/10 text-violet-400">
          AI Suggested
        </Badge>
      );
    case "learned":
      return (
        <Badge className="border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
          Learned
        </Badge>
      );
    case "conversation":
      return (
        <Badge className="border-amber-500/30 bg-amber-500/10 text-amber-400">
          Conversation
        </Badge>
      );
    default:
      return <Badge variant="secondary">{source}</Badge>;
  }
}

function RuleCard({ rule }: { rule: (typeof mockGoldenRules)[number] }) {
  const [active, setActive] = React.useState(rule.isActive);

  return (
    <Card className="border-0 bg-card/60 backdrop-blur-sm">
      <CardContent className="flex items-start gap-4">
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium leading-snug text-foreground/90">
              {rule.ruleText}
            </p>
            <Switch
              checked={active}
              onCheckedChange={setActive}
              size="sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {directionBadge(rule.direction)}
            {sourceBadge(rule.source)}
          </div>

          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground/60">Weight:</span>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-16 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(rule.weight / 2) * 100}%` }}
                  />
                </div>
                <span className="font-mono text-foreground/70">
                  {rule.weight.toFixed(1)}
                </span>
              </div>
            </div>
            <Separator orientation="vertical" className="h-3" />
            <div className="flex items-center gap-1.5">
              <Activity className="size-3 text-muted-foreground/60" />
              <span>
                Applied{" "}
                <span className="font-medium text-foreground/70">
                  {rule.appliedCount}x
                </span>
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <RotateCcw className="size-3 text-muted-foreground/60" />
              <span>
                Overridden{" "}
                <span className="font-medium text-foreground/70">
                  {rule.overrideCount}x
                </span>
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RuleGroup({
  type,
  rules,
}: {
  type: RuleType;
  rules: (typeof mockGoldenRules)[number][];
}) {
  const [open, setOpen] = React.useState(true);
  const config = ruleTypeConfig[type];

  if (rules.length === 0) return null;

  return (
    <div className="space-y-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 text-left"
      >
        <div className={cn("flex items-center gap-2", config.color)}>
          {config.icon}
          <h2 className="text-sm font-semibold">{config.label}</h2>
        </div>
        <Badge variant="secondary" className="ml-1 text-xs">
          {rules.length}
        </Badge>
        <div className="flex-1" />
        {open ? (
          <ChevronDown className="size-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="size-4 text-muted-foreground" />
        )}
      </button>

      {open && (
        <div className="space-y-2">
          {rules.map((rule) => (
            <RuleCard key={rule.id} rule={rule} />
          ))}
        </div>
      )}
    </div>
  );
}

function AddRuleDialog() {
  const [open, setOpen] = React.useState(false);
  const [ruleText, setRuleText] = React.useState("");
  const [ruleType, setRuleType] = React.useState("must_have");
  const [direction, setDirection] = React.useState("boost");
  const [weight, setWeight] = React.useState([1.0]);
  const [importance, setImportance] = React.useState([0.8]);

  const handleSave = () => {
    if (!ruleText.trim()) {
      toast.error("Please enter rule text");
      return;
    }
    toast.success(`Rule saved: "${ruleText}" (${ruleType} / ${direction})`);
    setRuleText("");
    setRuleType("must_have");
    setDirection("boost");
    setWeight([1.0]);
    setImportance([0.8]);
    setOpen(false);
  };

  return (
    <>
      <Button className="gap-2" onClick={() => setOpen(true)}>
        <Plus className="size-4" />
        Add Rule
      </Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Add Golden Rule"
        description="Define a new rule to guide idea scoring and filtering."
        footer={
          <>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Rule</Button>
          </>
        }
      >
        <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Rule Text</Label>
                <Input
                  placeholder="e.g., Prefer products with recurring revenue..."
                  value={ruleText}
                  onChange={(e) => setRuleText(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Rule Type</Label>
                  <select
                    value={ruleType}
                    onChange={(e) => setRuleType(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="must_have">Must Have</option>
                    <option value="must_avoid">Must Avoid</option>
                    <option value="prefer">Prefer</option>
                    <option value="deprioritize">Deprioritize</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Direction</Label>
                  <select
                    value={direction}
                    onChange={(e) => setDirection(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="boost">Boost</option>
                    <option value="penalize">Penalize</option>
                    <option value="block">Block</option>
                    <option value="require">Require</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Weight</Label>
                  <span className="text-xs font-mono text-muted-foreground">
                    {weight[0].toFixed(1)}
                  </span>
                </div>
                <Slider
                  value={weight}
                  onValueChange={(val) => setWeight(Array.isArray(val) ? [...val] : [val])}
                  min={0}
                  max={2}
                  step={0.1}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Importance</Label>
                  <span className="text-xs font-mono text-muted-foreground">
                    {importance[0].toFixed(1)}
                  </span>
                </div>
                <Slider
                  value={importance}
                  onValueChange={(val) => setImportance(Array.isArray(val) ? [...val] : [val])}
                  min={0}
                  max={1}
                  step={0.1}
                />
              </div>
        </div>
      </Modal>
    </>
  );
}

export default function RulesPage() {
  const ruleTypes: RuleType[] = [
    "must_have",
    "must_avoid",
    "prefer",
    "deprioritize",
  ];

  const grouped = ruleTypes.reduce(
    (acc, type) => {
      acc[type] = mockGoldenRules.filter((r) => r.ruleType === type);
      return acc;
    },
    {} as Record<RuleType, (typeof mockGoldenRules)[number][]>
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
            <BookOpen className="size-6 text-violet-400" />
            Golden Rules
          </h1>
          <p className="text-sm text-muted-foreground">
            Rules that guide how ideas are scored, filtered, and prioritized
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() =>
              toast.info("AI suggested rules", {
                description: "Prefer products under $25 • Avoid video-based content • Boost first-mover opportunities",
                duration: 6000,
              })
            }
          >
            <Sparkles className="size-4 text-amber-400" />
            Suggest Rules
          </Button>
          <AddRuleDialog />
        </div>
      </div>

      {/* Summary Stats */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>
          <span className="font-medium text-foreground">
            {mockGoldenRules.length}
          </span>{" "}
          rules total
        </span>
        <Separator orientation="vertical" className="h-4" />
        <span>
          <span className="font-medium text-emerald-400">
            {mockGoldenRules.filter((r) => r.isActive).length}
          </span>{" "}
          active
        </span>
        <Separator orientation="vertical" className="h-4" />
        <span>
          <span className="font-medium text-foreground">
            {mockGoldenRules.reduce((sum, r) => sum + r.appliedCount, 0)}
          </span>{" "}
          total applications
        </span>
      </div>

      <Separator />

      {/* Rule Groups */}
      <div className="space-y-6">
        {ruleTypes.map((type) => (
          <RuleGroup key={type} type={type} rules={grouped[type]} />
        ))}
      </div>
    </div>
  );
}
