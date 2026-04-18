import * as React from "react";
import {
  Kanban,
  Radar,
  Eye,
  CheckCircle,
  FlaskConical,
  GripVertical,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockIdeas } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type PipelineStatus = "detected" | "reviewing" | "approved" | "incubating";

const columnConfig: Record<
  PipelineStatus,
  {
    label: string;
    icon: React.ReactNode;
    headerColor: string;
    dotColor: string;
  }
> = {
  detected: {
    label: "Detected",
    icon: <Radar className="size-4" />,
    headerColor: "text-blue-400",
    dotColor: "bg-blue-400",
  },
  reviewing: {
    label: "Reviewing",
    icon: <Eye className="size-4" />,
    headerColor: "text-amber-400",
    dotColor: "bg-amber-400",
  },
  approved: {
    label: "Approved",
    icon: <CheckCircle className="size-4" />,
    headerColor: "text-emerald-400",
    dotColor: "bg-emerald-400",
  },
  incubating: {
    label: "Incubating",
    icon: <FlaskConical className="size-4" />,
    headerColor: "text-violet-400",
    dotColor: "bg-violet-400",
  },
};

function scoreBadge(score: number) {
  if (score >= 85) {
    return (
      <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 tabular-nums">
        {score}
      </Badge>
    );
  }
  if (score >= 70) {
    return (
      <Badge className="border-amber-500/30 bg-amber-500/10 text-amber-400 tabular-nums">
        {score}
      </Badge>
    );
  }
  return (
    <Badge className="border-gray-500/30 bg-gray-500/10 text-gray-400 tabular-nums">
      {score}
    </Badge>
  );
}

function categoryBadge(category: string) {
  const labels: Record<string, string> = {
    template: "Template",
    saas_tool: "SaaS Tool",
    ebook: "eBook",
    calculator: "Calculator",
    course: "Course",
    tracker: "Tracker",
    ai_app: "AI App",
    membership: "Membership",
    printable: "Printable",
    community: "Community",
    coaching: "Coaching",
  };
  return (
    <Badge variant="secondary" className="text-[10px]">
      {labels[category] || category}
    </Badge>
  );
}

function complianceDot(flag: string) {
  return (
    <div
      className={cn(
        "size-2 rounded-full",
        flag === "green"
          ? "bg-emerald-400"
          : flag === "yellow"
            ? "bg-amber-400"
            : "bg-red-400"
      )}
      title={`Compliance: ${flag}`}
    />
  );
}

function PipelineCard({
  idea,
}: {
  idea: (typeof mockIdeas)[number];
}) {
  return (
    <Card className="border-0 bg-card/80 backdrop-blur-sm cursor-grab active:cursor-grabbing hover:ring-1 hover:ring-foreground/20 transition-all">
      <CardContent className="space-y-2.5 p-3">
        {/* Drag handle + Title */}
        <div className="flex items-start gap-2">
          <GripVertical className="mt-0.5 size-3.5 shrink-0 text-muted-foreground/40" />
          <p className="text-sm font-medium leading-snug text-foreground/90 line-clamp-2">
            {idea.title}
          </p>
        </div>

        {/* Score + Category + Compliance */}
        <div className="flex items-center gap-2">
          {scoreBadge(idea.compositeScore)}
          {categoryBadge(idea.category)}
          <div className="flex-1" />
          {complianceDot(idea.complianceFlag)}
        </div>

        {/* Peptide Topics */}
        {idea.peptideTopics.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {idea.peptideTopics.slice(0, 3).map((topic) => (
              <span
                key={topic}
                className="rounded-md bg-muted/60 px-1.5 py-0.5 text-[10px] text-muted-foreground"
              >
                {topic}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PipelineColumn({ status }: { status: PipelineStatus }) {
  const config = columnConfig[status];
  const ideas = mockIdeas.filter((idea) => idea.status === status);

  return (
    <div className="flex flex-col rounded-xl bg-muted/20 ring-1 ring-foreground/5">
      {/* Column Header */}
      <div className="flex items-center gap-2 px-3 py-3">
        <div className={cn("flex items-center gap-2", config.headerColor)}>
          {config.icon}
          <h3 className="text-sm font-semibold">{config.label}</h3>
        </div>
        <Badge
          variant="secondary"
          className="ml-auto text-xs tabular-nums"
        >
          {ideas.length}
        </Badge>
      </div>

      <Separator />

      {/* Cards */}
      <ScrollArea className="flex-1">
        <div className="space-y-2 p-2" style={{ minHeight: "400px" }}>
          {ideas.length === 0 ? (
            <div className="flex items-center justify-center py-12 text-xs text-muted-foreground">
              No ideas in this stage
            </div>
          ) : (
            ideas.map((idea) => (
              <PipelineCard key={idea.id} idea={idea} />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

export default function PipelinePage() {
  const statuses: PipelineStatus[] = [
    "detected",
    "reviewing",
    "approved",
    "incubating",
  ];

  const totalInPipeline = mockIdeas.filter((idea) =>
    statuses.includes(idea.status as PipelineStatus)
  ).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <Kanban className="size-6 text-blue-400" />
          Pipeline
        </h1>
        <p className="text-sm text-muted-foreground">
          Track ideas through the research-to-launch pipeline
        </p>
      </div>

      {/* Summary */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>
          <span className="font-medium text-foreground">
            {totalInPipeline}
          </span>{" "}
          ideas in pipeline
        </span>
        {statuses.map((status) => {
          const count = mockIdeas.filter((i) => i.status === status).length;
          const config = columnConfig[status];
          return (
            <React.Fragment key={status}>
              <Separator orientation="vertical" className="h-4" />
              <span>
                <span className={cn("font-medium", config.headerColor)}>
                  {count}
                </span>{" "}
                {config.label.toLowerCase()}
              </span>
            </React.Fragment>
          );
        })}
      </div>

      <Separator />

      {/* Kanban Board */}
      <div className="grid grid-cols-4 gap-4">
        {statuses.map((status) => (
          <PipelineColumn key={status} status={status} />
        ))}
      </div>
    </div>
  );
}
