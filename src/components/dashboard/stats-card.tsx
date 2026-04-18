import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import type { ReactNode } from "react";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  accent?: "default" | "emerald" | "amber" | "red" | "blue" | "violet";
  className?: string;
}

const accentColors: Record<string, string> = {
  default: "text-muted-foreground",
  emerald: "text-emerald-400",
  amber: "text-amber-400",
  red: "text-red-400",
  blue: "text-blue-400",
  violet: "text-violet-400",
};

const accentBgColors: Record<string, string> = {
  default: "bg-muted/60",
  emerald: "bg-emerald-500/10",
  amber: "bg-amber-500/10",
  red: "bg-red-500/10",
  blue: "bg-blue-500/10",
  violet: "bg-violet-500/10",
};

export function StatsCard({
  label,
  value,
  icon,
  trend,
  accent = "default",
  className,
}: StatsCardProps) {
  return (
    <Card className={cn("border-0 bg-card/60 backdrop-blur-sm", className)}>
      <CardContent className="flex items-center gap-3 py-0">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-lg",
            accentBgColors[accent]
          )}
        >
          <span className={cn("size-5", accentColors[accent])}>{icon}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-medium text-muted-foreground">
            {label}
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-xl font-bold tracking-tight text-foreground">
              {value}
            </p>
            {trend && (
              <span
                className={cn(
                  "text-[11px] font-medium",
                  trend.value > 0
                    ? "text-emerald-400"
                    : trend.value < 0
                      ? "text-red-400"
                      : "text-muted-foreground"
                )}
              >
                {trend.value > 0 ? "+" : ""}
                {trend.value}% {trend.label}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
